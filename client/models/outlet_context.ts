import type SubCommandResolved from "@common/models/subCommandResolved";
import type BattleState from "@common/models/battleState";
import type Account from "@common/models/account";
import MessageClient from "@common/communicator/message_client";

export default interface OutletContext {
  account: Account | null;
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void;
  battleState: BattleState | null;
  battleStateLast: BattleState | null;
  subCommandsResolved: SubCommandResolved[] | null;
  toCommand: string | null;
};