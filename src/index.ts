import { handlerUser } from './handler';
import { User } from './model/users';
import { users as _users } from './repo';
import { sendMessage } from './utils/discord';

async function main() {
  const now = new Date();
  let user: User | null = null;

  try {
    console.log(`実行開始: ${new Date().toUTCString()}`);
    const users = await _users.getAll();
    if (!users) {
      console.log(`userが0件です`);
      return;
    }
    for (let i = 0; i < users.length; i++) {
      user = users[i];
      await handlerUser(user, now);
    }
    console.log(`実行完了: ${new Date().toUTCString()}`);
  } catch (error) {
    if (user) {
      const { userId, notice } = user;
      const payload = {
        content: `🦊むう！エラーが発生したぞい...🦊\nuserId: ${userId}`
      };
      await sendMessage(notice, payload);
    }

    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export const handler = async (event: any, context: any): Promise<void> => {
  await main();
};
