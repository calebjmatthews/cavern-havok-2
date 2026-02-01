import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadClaimGuestAccount, PayloadClientConnect, PayloadCommandSend, PayloadFighterPlaced, 
  PayloadMessageReceivedByClient, PayloadRequestGuestAccount, PayloadAdventureRequestNew, 
  PayloadRoomClosureRequest, PayloadRoomCreationRequest, PayloadRoomJoinRequest,
  PayloadChamberReadyForNew, PayloadTreasureSelected
} from './payload';
import { genId } from '@common/functions/utils/random';

export default class MessageClient extends Message {
  declare payload?: PayloadClient;

  constructor(message: MessageClientInterface) {
    super(message);
    Object.assign(this, message);
    if (!message.id) this.id = genId();
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