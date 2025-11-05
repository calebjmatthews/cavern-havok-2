import MessageClient from "@common/communicator/message_client";
import type SubCommandResolved from "@common/models/subCommandResolved";
import type BattleState from "@common/models/battleState";

export default interface OutletContext {
  accountId: string | null;
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void;
  battleState: BattleState | null;
  battleStateLast: BattleState | null;
  subCommandsResolved: SubCommandResolved[] | null;
  toCommand: string | null;
};