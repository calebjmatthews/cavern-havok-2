import { HEALTH_DANGER_THRESHOLD } from "@common/constants";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";

const getFighterStateDefault = (args: {
  battleState: BattleState,
  fighter: Fighter
}) => {
  const { fighter } = args;

  if (fighter.health <= 0) return LAYERED_ANIMATED_STATES.DOWN;
  if (fighter.health <= HEALTH_DANGER_THRESHOLD) return LAYERED_ANIMATED_STATES.CRITICAL;
  // ToDo: Handle pending commands, and therefore walking, casting, or clenching states
  return LAYERED_ANIMATED_STATES.RESTING;

};

export default getFighterStateDefault;