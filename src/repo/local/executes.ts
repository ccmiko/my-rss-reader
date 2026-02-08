import { readFileSync, writeFileSync } from 'fs';

type BeforeParseExecute = {
  id: string;
  lastSucceedDt: string;
};

type Execute = {
  id: string;
  lastSucceedDt: Date;
};

const FILE_PATH = `${__dirname}/../.local/executes.json`;

const _readFile = () => {
  const file = readFileSync(FILE_PATH);
  const data = JSON.parse(file.toString()).data as BeforeParseExecute[];
  const parsedData: Execute[] = data.map((v) => {
    return {
      ...v,
      lastSucceedDt: new Date(v.lastSucceedDt)
    };
  });
  return parsedData;
};

const _writeFile = (data: any) => {
  writeFileSync(FILE_PATH, JSON.stringify({ data }, null, 2));
};

export const executes = {
  get: (id: string) => {
    const data = _readFile();
    const item = data.find((v) => v.id === id);
    return item;
  },
  upsert: (id: string, newItem: Execute) => {
    const data = _readFile();
    const item = data.find((v) => v.id === id);
    if (!item) {
      throw new Error('itemがありません');
    }
    const newData = data.map((v) => {
      return v.id === id ? newItem : v;
    });
    _writeFile(newData);
  }
};
