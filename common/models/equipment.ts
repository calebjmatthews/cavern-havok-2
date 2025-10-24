import type BattleState from "./battle_state";
import type Effect from "./effect";
import type Passive from "./passive";

export default interface Equipment {
  id: string;
  getCanUse?: (args: {
    battleState: BattleState;
    userId: string;
  }) => boolean;
  getCanTarget?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  getEffects?: (args: {
    battleState: BattleState;
    userId: string;
    target: [number, number];
  }) => Effect[];
  getPassives?: (args: {
    battleState: BattleState;
    userId: string;
  }) => Passive[];
  // getAnimationSteps
  // getDuration
};