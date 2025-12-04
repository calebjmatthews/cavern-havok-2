import { v4 as uuid } from 'uuid';

import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadClaimGuestAccount, PayloadClientConnect, PayloadCommandSend, PayloadFighterPlaced, 
  PayloadMessageReceivedByClient, PayloadRequestGuestAccount, PayloadAdventureRequestNew, 
  PayloadRoomClosureRequest, PayloadRoomCreationRequest, PayloadRoomJoinRequest,
  PayloadChamberReadyForNew, PayloadTreasureSelected
} from './payload';

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
  | PayloadRequestGuestAccount | PayloadFighterPlaced | PayloadClaimGuestAccount
  | PayloadRoomCreationRequest | PayloadRoomJoinRequest | PayloadRoomClosureRequest
  | PayloadAdventureRequestNew | PayloadTreasureSelected | PayloadChamberReadyForNew;