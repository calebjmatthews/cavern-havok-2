import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadClientConnect, PayloadCommandSend, PayloadMessageReceivedByClient, PayloadRequestGuestAccount } from './payload';

export default class MessageClient extends Message {
  declare payload?: ClientPayload;

  constructor(comm: MessageClientInterface) {
    super(comm);
    Object.assign(this, comm);
    if (!comm.createdAt) this.createdAt = Date.now();
  };
};

interface MessageClientInterface extends MessageInterface {
  payload?: ClientPayload;
};

type ClientPayload = PayloadClientConnect | PayloadMessageReceivedByClient | PayloadCommandSend
  | PayloadRequestGuestAccount | PayloadRequestNewBattle;