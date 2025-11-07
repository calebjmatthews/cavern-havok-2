import type Account from "./account";

export default interface Room {
  id: string;
  createdAt: number;
  createdById: string;
  joinedByIds: string[];
  accounts: { [accountId: string] : Account};
};