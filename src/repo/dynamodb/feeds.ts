import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getClient } from './common';
import { Feed } from '../../model/feeds';

const TABLE_NAME = 'feeds';

const getById = async (id: string) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  });

  const cli = getClient();
  try {
    const res = await cli.send(command);
    if (res && res.Items && res.Items.length > 0) {
      const feed = res.Items.map((item) => {
        return new Feed(
          item.userId,
          item.feedId,
          item.url,
          item.title || '',
          item.description || '',
          item.notice,
          item.noticeType || 'discord',
          item.cycles || '',
          item.rules || []
        );
      });
      return feed;
    } else {
      return null;
    }
  } catch (error: any) {
    // TODO: エラーハンドリング改善
    throw error;
  }
};

export const feeds = {
  getById
};
