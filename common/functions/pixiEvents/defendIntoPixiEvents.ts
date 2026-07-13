import type { GetPixiEventsArgs } from "@common/models/equipment";
import type { PixiEvent } from "@common/models/pixiEvent";
import getFighterDefaultState from "./getFighterDefaultState";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import { genId } from "../utils/random";
import { ANIMATION_SPEED } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";

const defendIntoPixiEvents = (args: GetPixiEventsArgs): PixiEvent[] => {
  const { battleStateNew, actionResolved, delayFromRoot } = args;

  const pixiEvents: PixiEvent[] = [];
  const outcome = actionResolved.outcomes?.[0];
  const targetsId = outcome?.userId;
  const targetNew = battleStateNew.fighters[targetsId ?? ''];
  const defense = outcome?.defense;
  if (!targetsId || !targetNew || !defense) return pixiEvents;
  
  pixiEvents.push({
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: delayFromRoot,
    args: {
      targetsId: 'test',
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
      targetsId: outcome.affectedId,
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      ...getHealthNumberProps(defense)
    }
  });

  const changedFighterDefaultState = getFighterDefaultState({
    battleState: battleStateNew, fighter: targetNew
  });
  if (changedFighterDefaultState) pixiEvents.push({
    id: genId(),
    functionName: 'changeFighterState',
    delay: delayFromRoot + (40 / ANIMATION_SPEED),
    args: { targetsId, fighterState: changedFighterDefaultState }
  });

  return pixiEvents;
};

export default defendIntoPixiEvents;