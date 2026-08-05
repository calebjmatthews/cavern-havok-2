import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment"
import { genId } from "../utils/random";
import { ANIMATION_TYPES } from "@client/enums";

const getMagicPixiEvents = (args: GetPixiEventsArgs): PixiEvent[] => {
  const { 
    battleState, actionResolved, delayFromRoot, index, particleSpriteNames
  } = args;
  const outcomes = actionResolved.outcomes;
  const pixiEvents: PixiEvent[] = [];
  
  const outcome = index !== undefined ? outcomes[index] : null;
  const target = battleState.fighters[outcome?.userId ?? ''];
  if (!outcome || index === undefined || !particleSpriteNames || !target) return pixiEvents;

  if (outcome.userId) pixiEvents.push({
    id: genId(),
    functionName: 'createParticleContainer',
    delay: delayFromRoot,
    args: {
      targetsId: outcome.userId,
      particleSpriteNames,
      particleContainerName: ANIMATION_TYPES.MAGIC_CIRCLING,
      particleCountFinal: 8,
      targetMirrored: (target?.side ?? 'B') === 'A'
    }
  });
  
  return pixiEvents;
};

export default getMagicPixiEvents;