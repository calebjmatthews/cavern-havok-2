import type Account from "@common/models/account";
import type Room from "@common/models/room";
import type BattleState from "@common/models/battleState";
import type SubCommandResolved from "@common/models/subCommandResolved";
import MessageClient from "@common/communicator/message_client";

export default interface OutletContext {
  account: Account | null;
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void;
  room: Room | null;
  battleState: BattleState | null;
  battleStateLast: BattleState | null;
  subCommandsResolved: SubCommandResolved[] | null;
  toCommand: string | null;
};