import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getClient } from './common';
import { User } from '../../model/users';

const TABLE_NAME = 'users';

const getAll = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    ProjectionExpression: 'userId, userName, notice, noticeType'
  });

  const cli = getClient();
  try {
    const res = await cli.send(command);
    if (res && res.Items && res.Items.length > 0) {
      const users = res.Items.map((item) => {
        return new User({
          userId: item.userId,
          userName: item.userName,
          notice: item.notice,
          noticeType: item.noticeType
        });
      });
      return users;
    } else {
      return null;
    }
  } catch (error: any) {
    // TODO: エラーハンドリング改善
    throw error;
  }
};

export const users = {
  getAll
};
