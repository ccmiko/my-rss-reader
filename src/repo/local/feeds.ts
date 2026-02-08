import { readFileSync, writeFileSync } from 'fs';

type Rule = {
  key: string;
  word: string;
  type: 'allow' | 'deny';
};

type BeforeParseFeed = {
  userId: string;
  feedId: string;
  url: string;
  title: string;
  description: string;
  notice: string;
  noticeType: 'discord';
  cycles: string;
  rules: Rule[];
};

type Feed = BeforeParseFeed;

const FILE_PATH = `${__dirname}/../.local/feeds.json`;

const _readFile = () => {
  const file = readFileSync(FILE_PATH);
  const data = JSON.parse(file.toString()).data as BeforeParseFeed[];
  const parsedData: Feed[] = data.map((v) => {
    return v;
  });
  return parsedData;
};

const _writeFile = (data: any) => {
  writeFileSync(FILE_PATH, JSON.stringify({ data }, null, 2));
};

export const feeds = {
  get: (id: string) => {
    const data = _readFile();
    const item = data.find((v) => v.userId === id);
    return item;
  },
  getMany: (id: string) => {
    const data = _readFile();
    const item = data.filter((v) => v.userId === id);
    return item;
  },
  upsert: (id: string, newItem: Feed) => {
    const data = _readFile();
    const item = data.find((v) => v.userId === id);
    if (!item) {
      throw new Error('itemがありません');
    }
    const newData = data.map((v) => {
      return v.userId === id ? newItem : v;
    });
    _writeFile(newData);
  }
};
