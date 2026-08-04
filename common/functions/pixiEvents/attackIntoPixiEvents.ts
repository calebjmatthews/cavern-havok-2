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

const attackIntoPixiEvents = (args: {
  outcome: Outcome,
  pixiEvents: PixiEvent[],
  target: Fighter | Obstacle | Creation | undefined,
  outcomeDelayBeforeAffected: number,
  outcomeDelay: number,
  isLunge: boolean | undefined
}) => {
  const { outcome, pixiEvents, target, outcomeDelayBeforeAffected, outcomeDelay, isLunge } = args;

  // Change target state to damaged depending on defense + damage
  if (
    outcome.affectedId && (outcome.sufferedDamage ?? 0) > 1 && target?.occupantKind === 'fighter'
  ) pixiEvents.push({
    id: genId(),
    functionName: 'changeFighterState',
    delay: outcomeDelayBeforeAffected,
    args: { targetsId: outcome.affectedId, fighterState: LAS.DAMAGED }
  });

  // Add target animation depending on defense + damage
  if (outcome.affectedId && (outcome.sufferedDamage ?? 0) > 0) pixiEvents.push({
    id: genId(),
    functionName: 'applyAnimation',
    delay: outcomeDelayBeforeAffected,
    args: { targetsId: outcome.affectedId, animationTypeId: ANIMATION_TYPES.WOBBLE }
  });

  // Display damage numbers
  if (outcome.affectedId && outcome.damage !== undefined) pixiEvents.push({
    id: genId(),
    functionName: 'createParticleContainer',
    delay: outcomeDelayBeforeAffected,
    args: {
      targetsId: outcome.affectedId,
      particleContainerName: ANIMATION_TYPES.DAMAGE_NUMBERS,
      targetMirrored: (target?.side ?? 'B') === 'A',
      ...getHealthNumberProps(outcome.damage, { inverted: true })
    }
  });

  if (isLunge && outcome.userId) pixiEvents.push({
    id: genId(),
    functionName: 'applyAnimation',
    delay: outcomeDelay,
    args: {
      targetsId: outcome.userId,
      animationTypeId: ANIMATION_TYPES.LUNGE,
      animationOptions: { cx: -21, cy: -12 }
    },
  });

  return pixiEvents;
};

export default attackIntoPixiEvents;