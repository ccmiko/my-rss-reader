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

export const parse = async (url: string) => {
  const parser = new rssParser();
  const parsedUrl = new URL(url).href;
  const feed = (await parser.parseURL(parsedUrl)) as ParsedFeedItem;
  return feed;
};
