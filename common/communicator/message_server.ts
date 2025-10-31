import { v4 as uuid } from 'uuid';

import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadBattleEnd, PayloadCommandAccepted, PayloadGrantGuestAccount, PayloadMessageReceievedByServer, PayloadRoundStart } from './payload';

export default class MessageServer extends Message {
  declare payload?: PayloadServer;

  constructor(message: MessageServerInterface) {
    super(message);
    Object.assign(this, message);
    if (!message.id) this.id = uuid();
    if (!message.createdAt) this.createdAt = Date.now();
  };
};
 
interface MessageServerInterface extends MessageInterface {
  payload?: PayloadServer;
};

export type PayloadServer = PayloadRoundStart | PayloadCommandAccepted | PayloadBattleEnd
| PayloadMessageReceievedByServer | PayloadGrantGuestAccount;
