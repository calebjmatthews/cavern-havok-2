import { v4 as uuid } from 'uuid';

import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadClientConnect, PayloadCommandSend, PayloadFighterPlaced, PayloadMessageReceivedByClient, PayloadRequestGuestAccount, PayloadRequestNewBattle } from './payload';

export default class MessageClient extends Message {
  declare payload?: PayloadClient;

  constructor(message: MessageClientInterface) {
    super(message);
    Object.assign(this, message);
    if (!message.id) this.id = uuid();
    if (!message.createdAt) this.createdAt = Date.now();
  };
};

interface MessageClientInterface extends MessageInterface {
  payload?: PayloadClient;
};

export type PayloadClient = PayloadClientConnect | PayloadMessageReceivedByClient | PayloadCommandSend
  | PayloadRequestGuestAccount | PayloadRequestNewBattle | PayloadFighterPlaced;