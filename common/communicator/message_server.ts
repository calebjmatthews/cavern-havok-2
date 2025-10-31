import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadBattleEnd, PayloadCommandAccepted, PayloadGrantGuestAccount, PayloadMessageReceievedByServer, PayloadRoundStart } from './payload';

export default class MessageServer extends Message {
  declare payload?: ServerPayload;

  constructor(comm: MessageServerInterface) {
    super(comm);
    Object.assign(this, comm);
    if (!comm.createdAt) this.createdAt = Date.now();
  };
};
 
interface MessageServerInterface extends MessageInterface {
  payload?: ServerPayload;
};

type ServerPayload = PayloadRoundStart | PayloadCommandAccepted | PayloadBattleEnd
| PayloadMessageReceievedByServer | PayloadGrantGuestAccount;
