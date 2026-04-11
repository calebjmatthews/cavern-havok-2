import * as PIXI from 'pixi.js';

import type Artist from "./artist";
import animationTypes from '@client/instances/artist/animations';
import { genId } from '../../../common/functions/utils/random';
import { ANIMATION_TYPES } from '@client/enums';

export interface ChestDamageArgs {
  chestId: string,
  artist?: Artist,
}

const chestDamage = (args: ChestDamageArgs) => {
  const { chestId, artist } = args;
  const pixiContainers = artist?.pixiContainersRef?.current;
  const container = pixiContainers?.[chestId];
  if (!artist || !container) return;
  
  const animationType = animationTypes[ANIMATION_TYPES.WOBBLE];
  artist.animations.push({
    id: genId(),
    type: ANIMATION_TYPES.WOBBLE,
    startedAt: Date.now(),
    expiresAs: Date.now() + (animationType?.duration ?? 1000),
    targets: chestId,
    positionInitial: { x: container.x, y: container.y }
  });
};

export default chestDamage;