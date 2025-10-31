import type Payload from "./payload";
import { MESSAGE_KINDS } from "@common/enums";

export default class Message {
  id: string = '';
  accountId?: string;
  payload?: Payload = { kind: MESSAGE_KINDS.KIND_MISSING }
  createdAt: number = Date.now();
  lastSentAt: number = Date.now();
  sendAttempts: number = 0;

  constructor(comm: MessageInterface) {
    Object.assign(this, comm);
    if (!comm.createdAt) this.createdAt = Date.now();
  };
};

export interface MessageInterface {
  id: string;
  accountId?: string;
  payload?: Payload;
  createdAt?: number;
  lastSentAt?: number;
  sendAttempts?: number;
};