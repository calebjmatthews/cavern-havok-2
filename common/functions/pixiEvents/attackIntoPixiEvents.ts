import type Outcome from "@common/models/outcome";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import getChangedFighterState from "./getChangedFighterDefaultState";
import getSwingPixiEvent from "./getSwingPixiEvent";
import getThrowPixiEvents from "./getThrowPixiEvents";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import {
  DELAY_BEFORE_DAMAGED_DEFAULT, INTERVAL_DURATION_DEFAULT, FINISHING_DURATION_DEFAULT,
  HEALTH_BAR_TRANSITION_DURATION
} from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";
const LAS = LAYERED_ANIMATED_STATES;

const attackIntoPixiEvents = (args: {
  outcome: Outcome,
  pixiEvents: PixiEvent[],
  target: Fighter | Obstacle | Creation | undefined,
  outcomeDelayBeforeDamaged: number,
  outcomeDelay: number,
  isLunge: boolean | undefined
}) => {
  const { outcome, pixiEvents, target, outcomeDelayBeforeDamaged, outcomeDelay, isLunge } = args;

  // Change target state to damaged depending on defense + damage
  if (
    outcome.affectedId && (outcome.sufferedDamage ?? 0) > 1 && target?.occupantKind === 'fighter'
  ) pixiEvents.push({
    id: genId(),
    functionName: 'changeFighterState',
    delay: outcomeDelayBeforeDamaged,
    args: { targetsId: outcome.affectedId, fighterState: LAS.DAMAGED }
  });

  // Add target animation depending on defense + damage
  if (outcome.affectedId && (outcome.sufferedDamage ?? 0) > 0) pixiEvents.push({
    id: genId(),
    functionName: 'applyAnimation',
    delay: outcomeDelayBeforeDamaged,
    args: { targetsId: outcome.affectedId, animationTypeId: ANIMATION_TYPES.WOBBLE }
  });

  // Display damage numbers
  if (outcome.affectedId && outcome.damage !== undefined) pixiEvents.push({
    id: genId(),
    functionName: 'createParticleContainer',
    delay: outcomeDelayBeforeDamaged,
    args: {
      targetsId: outcome.affectedId,
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
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