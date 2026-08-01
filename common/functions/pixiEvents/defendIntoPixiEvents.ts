import type Outcome from "@common/models/outcome";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type { GetPixiEventsArgs } from "@common/models/equipment";
import type { PixiEvent } from "@common/models/pixiEvent";
import getFighterStateDefault from "./getFighterStateDefault";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import { genId } from "../utils/random";
import { FINISHING_DURATION_DEFAULT, INTERVAL_DURATION_DEFAULT } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const LAS = LAYERED_ANIMATED_STATES;

const defendIntoPixiEvents = (args: {
  outcome: Outcome,
  pixiEvents: PixiEvent[],
  target: Fighter | Obstacle | Creation | undefined,
  delayFromRoot: number
}) => {
  const { outcome, pixiEvents, target, delayFromRoot } = args;
  const defense = outcome?.defense;
  if (!target || !defense) return pixiEvents;
  
  pixiEvents.push({
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: delayFromRoot,
    args: {
      targetsId: target.id,
      spriteNames: ['shield_effect.png'],
      offsets: [{ x: -6, y: 4 }],
      opacities: [1],
      durationOverall: 800,
      animationTypeId: ANIMATION_TYPES.FADE_AWAY,
      animationOptions: {
        duration: 500,
        delay: 200
      }
    }
  });
  pixiEvents.push({
    id: genId(),
    functionName: 'createParticleContainer',
    delay: delayFromRoot,
    args: {
      targetsId: target.id,
      particleContainerName: ANIMATION_TYPES.DEFENSE_NUMBERS,
      ...getHealthNumberProps(defense),
      targetMirrored: target.side === 'A'
    }
  });

  return pixiEvents;
};

const defendIntoPixiEventsOld = (args: GetPixiEventsArgs) => {
  const {
    battleStateNew, actionResolved, delayFromRoot,
    intervalDuration: intervalDurationArg, finishingDuration: finishingDurationArg
  } = args;

  const pixiEvents: PixiEvent[] = [];
  const outcome = actionResolved.outcomes?.[0];
  const targetsId = outcome?.affectedId;
  const targetNew = battleStateNew.fighters[targetsId ?? ''];
  const defense = outcome?.defense;
  const intervalDuration = intervalDurationArg ?? INTERVAL_DURATION_DEFAULT;
  const finishingDuration = finishingDurationArg ?? FINISHING_DURATION_DEFAULT;
  if (!targetsId || !targetNew || !defense) return { duration: 0, pixiEvents };

  const fighterStateDefault = getFighterStateDefault({
    battleState: battleStateNew, fighter: targetNew
  });
  
  pixiEvents.push({
    id: genId(),
    functionName: 'changeFighterState',
    delay: delayFromRoot,
    args: { targetsId, fighterState: LAS.DEFENDING, fighterStateDefault }
  });
  

  const duration = (intervalDuration * actionResolved.outcomes.length) + finishingDuration;
  return { duration, pixiEvents };
};

export default defendIntoPixiEvents;