export type UserType = {
  userId: string;
  userName: string;
  notice: string;
  noticeType: 'discord';
};

export class User implements UserType {
  userId: string;
  userName: string;
  notice: string;
  noticeType: 'discord';

  constructor(data: UserType) {
    this.userId = data.userId;
    this.userName = data.userName;
    this.notice = data.notice;
    this.noticeType = data.noticeType;
  }
}
