import MessageClient from "@common/communicator/message_client";
import type ActionResolved from "@common/models/actionResolved";
import type BattleState from "@common/models/battleState";

export default interface OutletContext {
  accountId: string | null;
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void;
  battleState: BattleState | null;
  battleStateLast: BattleState | null;
  actionsResolved: ActionResolved[] | null;
  toCommand: string | null;
};