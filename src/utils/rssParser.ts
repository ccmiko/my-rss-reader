import rssParser from 'rss-parser';

export type ParsedFeed = {
  title: string;
  link: string;
  isoDate: string;
};
export type ParsedFeedItem = {
  title: string;
  items: ParsedFeed[];
};

const FETCH_TIMEOUT_MS = 10_000;

export const parse = async (url: string) => {
  // 応答しないフィードで処理全体（Lambdaのタイムアウト60秒）が止まらないようにする
  const parser = new rssParser({ timeout: FETCH_TIMEOUT_MS, maxRedirects: 3 });
  const parsedUrl = new URL(url).href;
  const feed = (await parser.parseURL(parsedUrl)) as ParsedFeedItem;
  return feed;
};
