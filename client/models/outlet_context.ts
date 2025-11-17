import type Account from "@common/models/account";
import type Room from "@common/models/room";
import type BattleState from "@common/models/battleState";
import type SubCommandResolved from "@common/models/subCommandResolved";
import MessageClient from "@common/communicator/message_client";
import type SceneState from "@common/models/sceneState";

export default interface OutletContext {
  account: Account | null;
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void;
  room: Room | null;
  battleState: BattleState | null;
  setBattleState: (nextBattleState: BattleState | null) => void;
  battleStateLast: BattleState | null;
  setBattleStateLast: (nextBattleState: BattleState | null) => void;
  battleStateFuture: BattleState | null;
  setBattleStateFuture: (nextBattleState: BattleState | null) => void;
  subCommandsResolved: SubCommandResolved[] | null;
  setSubCommandsResolved: (nextActionsResolved: SubCommandResolved[] | null) => void;
  subCommandsResolvedFuture: SubCommandResolved[] | null;
  setSubCommandsResolvedFuture: (nextActionsResolved: SubCommandResolved[] | null) => void;
  toCommand: string | null;
  sceneState: SceneState | null;
  setSceneState: (nextScene: SceneState | null) => void;
};