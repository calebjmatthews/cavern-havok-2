import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import getPosition from '@client/functions/artist/getPosition';
import animationTypes from '@client/instances/artist/animations';
import { genId } from '@common/functions/utils/random';
import { SPRITE_MAP } from '../spriteMap';
import { ANIMATION_TYPES } from '@client/enums';

const drawChests = (artist: Artist) => {
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;
  
  artist.chests.forEach((_chest, index) => {
    const chestId = `chest-basic-${index}`;
    const container = new PIXI.Container();
    const sprite = PIXI.Sprite.from(SPRITE_MAP.CHEST_BASIC);
    sprite.scale = 2;
    container.position = getPosition({ sprite, artist, gravity: 'center' });
    container.addChild(sprite);
    pixiContainers[chestId] = container;
    pixiApp.stage.addChild(container);
    artist.chestsBounds.push({
      id: chestId,
      x: container.x,
      y: container.y,
      width: sprite.width,
      height: sprite.height
    });

    const animationType = animationTypes[ANIMATION_TYPES.DROP_FROM_ABOVE];
    if (!animationType?.getVyStarting) return;
    artist.animations.push({
      id: genId(),
      type: ANIMATION_TYPES.DROP_FROM_ABOVE,
      startedAt: Date.now(),
      expiresAt: Date.now() + animationType.duration,
      lastTickAt: 0,
      targets: chestId,
      ix: container.x,
      iy: container.y,
      px: container.x,
      py: (container.y - 200),
      vy: animationType.getVyStarting()
    });
  });
};

export default drawChests;