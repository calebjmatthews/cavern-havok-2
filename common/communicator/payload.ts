import { MESSAGE_KINDS } from "@common/enums";
import type Command from "@common/models/command";

export default interface Payload {
  kind: MESSAGE_KINDS;
};

export interface PayloadClientConnect extends Payload {
  kind: MESSAGE_KINDS.CLIENT_CONNECT;
  accountId: string;
};

export interface PayloadCommandSend extends Payload {
  kind: MESSAGE_KINDS.COMMAND_SEND;
  accountId: string;
  command: Command;
};

export interface PayloadMessageReceivedByClient extends Payload {
  kind: MESSAGE_KINDS.MESSAGE_RECEIVED_BY_CLIENT;
};

export interface PayloadRequestGuestAccount extends Payload {
  kind: MESSAGE_KINDS.REQUEST_GUEST_ACCOUNT;
};

export interface PayloadGrantGuestAccount extends Payload {
  kind: MESSAGE_KINDS.GRANT_GUEST_ACCOUNT;
  accountId: string;
};

export interface PayloadBattleEnd extends Payload {
  kind: MESSAGE_KINDS.BATTLE_CONCLUSION;
  // battlefield: BattlefieldInterface;
  // battleEventSets: BattleEvent[][];
  // battleExperiences,
  // battleTreasures
};

export interface PayloadCommandAccepted extends Payload {
  kind: MESSAGE_KINDS.COMMAND_ACCEPTED;
  toCommand?: string;
};

export interface PayloadMessageReceievedByServer extends Payload {
  kind: MESSAGE_KINDS.MESSAGE_RECEIVED_BY_SERVER;
};

export interface PayloadRoundStart extends Payload {
  kind: MESSAGE_KINDS.ROUND_START;
  // battlefield: BattlefieldInterface;
  // toCommand: string;
  // battleEventSets?: BattleEvent[][];
};

export interface PayloadRequestNewBattle extends Payload {
  kind: MESSAGE_KINDS.REQUEST_NEW_BATTLE
}