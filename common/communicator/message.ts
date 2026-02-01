import type Payload from "./payload";
import { genId } from "@common/functions/utils/random";
import { MESSAGE_KINDS } from "@common/enums";

export default class Message {
  id: string = '';
  accountId?: string;
  payload?: Payload = { kind: MESSAGE_KINDS.KIND_MISSING }
  createdAt: number = Date.now();
  lastSentAt: number = Date.now();
  sendAttempts: number = 0;

  constructor(message: MessageInterface) {
    Object.assign(this, message);
    if (!message.id) this.id = genId();
    if (!message.createdAt) this.createdAt = Date.now();
  };
};

export interface MessageInterface {
  id?: string;
  accountId?: string;
  payload?: Payload;
  createdAt?: number;
  lastSentAt?: number;
  sendAttempts?: number;
};