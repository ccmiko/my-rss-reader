import { executes, feeds, users } from "./repo";
import { sendMessage } from "./utils/discord";
import { parse } from "./utils/rssParser";

const TMP_USER_ID = "AAAAAA"

async function main() {
  const now = new Date();
  let hasNotice = false;

  const user = users.get(TMP_USER_ID);
  if (!user) {
    throw new Error(`executeがありません userId: ${TMP_USER_ID}`);
  }
  const feedInfoList = feeds.getMany(user.userId);
  if (!feedInfoList) {
    throw new Error(`feedInfoListがありません userId: ${user.userId}`);
  }

  for (let i = 0; i < feedInfoList.length; i++) {
    const feedInfo = feedInfoList[i];
    const { userId, feedId, url, rules, notice } = feedInfo;
    const id = `${userId}_${feedId}`;
    const execute = executes.get(id);
    if (!execute) {
      throw new Error(`executeがありません id: ${id}`);
    }
    const lastSucceedDt = execute.lastSucceedDt.getTime();
    const feed = await parse(url);
    const noticeItems = feed.items.filter((item) => {
      const notNoticed =
        item.isoDate && new Date(item.isoDate).getTime() >= lastSucceedDt;
      const ruleIsOk =
        rules.length === 0 ||
        rules.every((rule) => {
          const value: string = item[rule.key];
          const result =
            rule.type === "allow"
              ? value.includes(rule.word)
              : !value.includes(rule.word);
          return result;
        });
      return notNoticed && ruleIsOk;
    });

    for (let i = 0; i < noticeItems.length; i++) {
      if (!hasNotice) {
        hasNotice = true;
      }
      const noticeItem = noticeItems[i];
      const { title, link } = noticeItem;
      const payload = {
        content: `🦊こんこん！新着通知じゃ！🦊\n**${feed.title}**\n${title}\n<${link}>`,
      };
      await sendMessage(notice, payload);
    }

    executes.upsert(id, {
      ...execute,
      lastSucceedDt: now,
    });
  }

  if (!hasNotice) {
    const { notice } = user;
    const payload = {
      content: `🦊こんこん！新着通知がなかったぞい！🦊\n実行日時: ${now.toUTCString()}`,
    };
    await sendMessage(notice, payload);
  }
}

(async () => {
  setInterval(async () => {
    console.log(`実行開始: ${new Date().toUTCString()}`)
    try {
      await main();
    } catch (error) {
      console.log("エラー発生")
      console.error(error)
    }
    console.log(`実行完了: ${new Date().toUTCString()}`)
  },
  // 1000 * 60 // 1分
  // 1000 * 300// 10分
  1000 * 3600 // 1時間

);
})();
