import {
  BatchGetCommand,
  BatchWriteCommand,
  PutCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { getClient } from './common';
import { Execute } from '../../model/executes';

const TABLE_NAME = 'executes';

const getById = async (id: string) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId_feedId = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  });

  const cli = getClient();
  try {
    const res = await cli.send(command);
    if (res && res.Items && res.Items.length > 0) {
      const item = res.Items[0];
      return new Execute(
        item.userId_feedId,
        new Date(item.lastSucceedDt || '1970-01-01T00:00:00Z')
      );
    } else {
      return null;
    }
  } catch (error: any) {
    // TODO: エラーハンドリング改善
    throw error;
  }
};

const getByIds = async (ids: string[]) => {
  if (ids.length === 0) {
    return [];
  }
  const keys = ids.map((id) => ({
    userId_feedId: id
  }));
  const command = new BatchGetCommand({
    RequestItems: {
      [TABLE_NAME]: {
        Keys: keys
      }
    }
  });
  const cli = getClient();
  try {
    const res = await cli.send(command);
    if (res && res.Responses && res.Responses[TABLE_NAME]) {
      const executes = res.Responses[TABLE_NAME].map((item) => {
        return new Execute(
          item.userId_feedId,
          new Date(item.lastSucceedDt || '1970-01-01T00:00:00Z')
        );
      });
      return executes;
    } else {
      return [];
    }
  } catch (error: any) {
    // TODO: エラーハンドリング改善
    throw error;
  }
};

const put = async (id: string, now: Date) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      userId_feedId: id,
      lastSucceedDt: now.toISOString()
    }
  });
  const cli = getClient();
  try {
    await cli.send(command);
  } catch (error: any) {
    // TODO: エラーハンドリング改善
    throw error;
  }
};

const batchUpsert = async (ids: string[], now: Date) => {
  if (ids.length > 25) {
    // TODO: ハンドリング改善（25件で分割するか、ここで25件以上のケースを異常とするか）
    throw new Error('一度に25件以上のupsertはできません');
  }
  const putRequests = ids.map((id) => ({
    PutRequest: {
      Item: {
        userId_feedId: id,
        lastSucceedDt: now.toISOString()
      }
    }
  }));

  const command = new BatchWriteCommand({
    RequestItems: {
      [TABLE_NAME]: putRequests
    }
  });
  const cli = getClient();
  try {
    await cli.send(command);
  } catch (error: any) {
    // TODO: エラーハンドリング改善
    throw error;
  }
};

export const executes = {
  getById,
  getByIds,
  put,
  batchUpsert
};
