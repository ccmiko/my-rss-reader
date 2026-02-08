import { Execute } from './model/executes';
import { Feed, RuleType } from './model/feeds';
import { User } from './model/users';
import { executes as _executes, feeds as _feeds } from './repo';
import { sendMessage } from './utils/discord';
import { parse, ParsedFeed } from './utils/rssParser';

export const handlerUser = async (user: User, now: Date): Promise<void> => {
  const feeds = await _feeds.getById(user.userId);
  if (!feeds) {
    console.log(`feedが0件です userId:${user.userId}`);
    return;
  }

  // 先にID一覧を抽出して、DynamoDBアクセス回数のコスト削減
  const ids: string[] = [];
  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i];
    const { userId, feedId } = feed;
    const id = `${userId}_${feedId}`;
    ids.push(id);
  }
  const executes = await _executes.getByIds(ids);

  const processedIds: string[] = [];
  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i];
    const processedId = await _handleFeed(feed, executes);
    processedIds.push(processedId);
  }

  //DynamoDBアクセス回数のコスト削減のため、一括更新
  await _executes.batchUpsert(processedIds, now);
};

const _handleFeed = async (feed: Feed, executes: Execute[]) => {
  const { userId, feedId, url, rules } = feed;
  const id = `${userId}_${feedId}`;
  const execute = executes.find((v) => v.id === id);
  const lastSucceedDt = execute?.lastSucceedDt.getTime() || 0;
  const feedItems = await parse(url);
  const noticeItems = _getNoticeItems(feedItems.items, rules, lastSucceedDt);
  for (let i = 0; i < noticeItems.length; i++) {
    const noticeItem = noticeItems[i];
    await _handleNoticeItem(feedItems.title, feed, noticeItem);
  }
  return id;
};

const _getNoticeItems = (feedItems: ParsedFeed[], rules: RuleType[], lastSucceedDt: number) => {
  const noticeItems = feedItems.filter((item) => {
    const notNoticed = item.isoDate && new Date(item.isoDate).getTime() >= lastSucceedDt;
    const ruleIsOk =
      rules.length === 0 ||
      rules.every((rule) => {
        const value = item[rule.key];
        const result =
          rule.type === 'allow' ? value.includes(rule.word) : !value.includes(rule.word);
        return result;
      });
    return notNoticed && ruleIsOk;
  });
  return noticeItems;
};

const _handleNoticeItem = async (feedTitle: string, feed: Feed, item: ParsedFeed) => {
  const { title, link } = item;
  const payload = {
    content: `🦊こんこん！新着通知じゃ！🦊\n**${feedTitle}**\n${title}\n<${link}>`
  };
  await sendMessage(feed.notice, payload);
};
