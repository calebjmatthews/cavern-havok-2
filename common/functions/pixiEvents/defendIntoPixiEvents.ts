import type Outcome from "@common/models/outcome";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type { PixiEvent } from "@common/models/pixiEvent";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import { genId } from "../utils/random";
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

export default defendIntoPixiEvents;