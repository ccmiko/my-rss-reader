import rssParser from "rss-parser";

export const parse = async (url: string) => {
  const parser = new rssParser();
  const feed = await parser.parseURL(url);
  return feed;
};
