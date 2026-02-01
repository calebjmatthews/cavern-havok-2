import Message from '../communicator/message';
import type { MessageInterface } from '../communicator/message';
import type { PayloadServerConnect, PayloadConclusion, PayloadCommandAccepted, PayloadGrantGuestAccount, 
  PayloadMessageReceievedByServer, PayloadRoundStart, PayloadFighterPlacement,
  PayloadClaimedGuestAccount, PayloadRoomUpdated,  PayloadRoomClosed, PayloadCommandsUpdated, 
  PayloadSceneStart, PayloadAdventureOver, PayloadTreasureApplied
} from './payload';
import { genId } from '@common/functions/utils/random';

export default class MessageServer extends Message {
  declare payload?: PayloadServer;

  constructor(message: MessageServerInterface) {
    super(message);
    Object.assign(this, message);
    if (!message.id) this.id = genId();
    if (!message.createdAt) this.createdAt = Date.now();
  };
};
 
interface MessageServerInterface extends MessageInterface {
  payload?: PayloadServer;
};

export type PayloadServer = PayloadServerConnect | PayloadRoundStart | PayloadCommandAccepted
  | PayloadConclusion | PayloadMessageReceievedByServer | PayloadGrantGuestAccount
  | PayloadFighterPlacement | PayloadClaimedGuestAccount | PayloadRoomUpdated | PayloadRoomClosed
  | PayloadCommandsUpdated | PayloadSceneStart | PayloadAdventureOver | PayloadTreasureApplied;
