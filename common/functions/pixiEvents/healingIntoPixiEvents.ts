import type Outcome from "@common/models/outcome";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type { PixiEvent } from "@common/models/pixiEvent";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import { ANIMATION_TYPES } from "@client/enums";
const LAS = LAYERED_ANIMATED_STATES;

const healingIntoPixiEvents = (args: {
  outcome: Outcome,
  pixiEvents: PixiEvent[],
  target: Fighter | Obstacle | Creation | undefined,
  outcomeDelayBeforeAffected: number,
  delayFromRoot: number
}) => {
  const { outcome, pixiEvents, target, outcomeDelayBeforeAffected, delayFromRoot } = args;
  const healing = outcome?.healing;
  if (!target || !healing) return pixiEvents;

  // Change target state to cheering depending on whether target's health was already full and not user
  if (
    (outcome.affectedId && outcome.affectedId !== outcome.userId)
    && (outcome.wasHealed ?? 0) > 1 && target?.occupantKind === 'fighter'
  ) pixiEvents.push({
    id: genId(),
    functionName: 'changeFighterState',
    delay: outcomeDelayBeforeAffected,
    args: { targetsId: outcome.affectedId, fighterState: LAS.CHEERING }
  });
  
  pixiEvents.push({
    id: genId(),
    functionName: 'createParticleContainer',
    delay: outcomeDelayBeforeAffected,
    args: {
      targetsId: target.id,
      particleContainerName: ANIMATION_TYPES.HEALING_NUMBERS,
      ...getHealthNumberProps(healing),
      targetMirrored: target.side === 'A'
    }
  });

  return pixiEvents;
};

export default healingIntoPixiEvents;