import type Account from "@common/models/account";
import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Room from "@common/models/room";
import type Treasure from "@common/models/treasure";
import { ADVENTURE_KINDS, CHARACTER_CLASSES, MESSAGE_KINDS } from "@common/enums";

export default interface Payload {
  kind: MESSAGE_KINDS;
};

export interface PayloadMessageReceivedByClient extends Payload {
  kind: MESSAGE_KINDS.MESSAGE_RECEIVED_BY_CLIENT;
};

export interface PayloadMessageReceievedByServer extends Payload {
  kind: MESSAGE_KINDS.MESSAGE_RECEIVED_BY_SERVER;
};

export interface PayloadClientConnect extends Payload {
  kind: MESSAGE_KINDS.CLIENT_CONNECT;
  accountId: string;
};

export interface PayloadServerConnect extends Payload {
  kind: MESSAGE_KINDS.SERVER_CONNECT;
  account: Account;
  battleState?: BattleState;
  room?: Room;
  toCommand?: string;
};

export interface PayloadCommandSend extends Payload {
  kind: MESSAGE_KINDS.COMMAND_SEND;
  accountId: string;
  command: Command;
};

export interface PayloadCommandsUpdated extends Payload {
  kind: MESSAGE_KINDS.COMMANDS_UPDATED;
  battleState: BattleState;
};

export interface PayloadRequestGuestAccount extends Payload {
  kind: MESSAGE_KINDS.REQUEST_GUEST_ACCOUNT;
};

export interface PayloadGrantGuestAccount extends Payload {
  kind: MESSAGE_KINDS.GRANT_GUEST_ACCOUNT;
  account: Account;
};

export interface PayloadClaimGuestAccount extends Payload {
  kind: MESSAGE_KINDS.CLAIM_GUEST_ACCOUNT;
  accountId: string;
  name: string;
  characterClass: CHARACTER_CLASSES;
};

export interface PayloadClaimedGuestAccount extends Payload {
  kind: MESSAGE_KINDS.CLAIMED_GUEST_ACCOUNT;
  account: Account;
};

export interface PayloadRoomCreationRequest extends Payload {
  kind: MESSAGE_KINDS.ROOM_CREATION_REQUEST;
  accountId: string;
};

export interface PayloadRoomJoinRequest extends Payload {
  kind: MESSAGE_KINDS.ROOM_JOIN_REQUEST;
  roomId: string;
  accountId: string;
};

export interface PayloadRoomUpdated extends Payload {
  kind: MESSAGE_KINDS.ROOM_UPDATE;
  room: Room;
};

export interface PayloadRoomClosureRequest extends Payload {
  kind: MESSAGE_KINDS.ROOM_CLOSURE_REQUEST;
  roomId: string;
  accountId: string;
};

export interface PayloadRoomClosed extends Payload {
  kind: MESSAGE_KINDS.ROOM_CLOSED;
}

export interface PayloadConclusion extends Payload {
  kind: MESSAGE_KINDS.BATTLE_CONCLUSION;
  battleState: BattleState;
  battleStateLast: BattleState;
  // battleTreasures
};

export interface PayloadCommandAccepted extends Payload {
  kind: MESSAGE_KINDS.COMMAND_ACCEPTED;
  toCommand?: string;
};

export interface PayloadCommandsUpdated extends Payload {
  kind: MESSAGE_KINDS.COMMANDS_UPDATED;
  battleState: BattleState;
};

export interface PayloadRoundStart extends Payload {
  kind: MESSAGE_KINDS.ROUND_START;
  battleState: BattleState;
  battleStateLast?: BattleState;
  toCommand?: string;
};

export interface PayloadAdventureRequestNew extends Payload {
  kind: MESSAGE_KINDS.ADVENTURE_REQUEST_NEW;
  adventureKindId: ADVENTURE_KINDS;
};

export interface PayloadChamberReadyForNew extends Payload {
  kind: MESSAGE_KINDS.CHAMBER_READY_FOR_NEW;
  treasure: Treasure;
};
 
export interface PayloadFighterPlacement extends Payload {
  kind: MESSAGE_KINDS.FIGHTER_PLACEMENT;
  battleState: BattleState;
  toCommand: string;
};

export interface PayloadFighterPlaced extends Payload {
  kind: MESSAGE_KINDS.FIGHTER_PLACED;
  accountId: string;
  toCommand: string;
  coords: [number, number];
};