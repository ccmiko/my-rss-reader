export type RuleType = {
  key: 'title';
  word: string;
  type: 'allow' | 'deny';
};

export type FeedType = {
  userId: string;
  feedId: string;
  url: string;
  title: string;
  description: string;
  notice: string;
  noticeType: 'discord';
  cycles: string;
  rules: RuleType[];
};

export class Feed implements FeedType {
  userId: string;
  feedId: string;
  url: string;
  title: string;
  description: string;
  notice: string;
  noticeType: 'discord';
  cycles: string;
  rules: RuleType[];

  constructor(
    userId: string,
    feedId: string,
    url: string,
    title: string,
    description: string,
    notice: string,
    noticeType: string,
    cycles: string,
    rules: RuleType[]
  ) {
    this.userId = userId;
    this.feedId = feedId;
    this.url = url;
    this.title = title;
    this.description = description;
    this.notice = notice;
    this.noticeType = noticeType as 'discord';
    this.cycles = cycles;
    this.rules = rules;
  }
}
