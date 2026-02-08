import { readFileSync, writeFileSync } from 'fs';

type BeforeParseUser = {
  userId: string;
  userName: string;
  notice: string;
  noticeType: 'discord';
};

type User = BeforeParseUser;

const FILE_PATH = `${__dirname}/../.local/users.json`;

const _readFile = () => {
  const file = readFileSync(FILE_PATH);
  const data = JSON.parse(file.toString()).data as BeforeParseUser[];
  const parsedData: User[] = data.map((v) => {
    return v;
  });
  return parsedData;
};

const _writeFile = (data: any) => {
  writeFileSync(FILE_PATH, JSON.stringify({ data }, null, 2));
};

export const users = {
  get: (id: string) => {
    const data = _readFile();
    const item = data.find((v) => v.userId === id);
    return item;
  },
  upsert: (id: string, newItem: User) => {
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
