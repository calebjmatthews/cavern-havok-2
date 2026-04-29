import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '../animation';
import animationTypes from '@client/instances/artist/animations';
import getSpritePath from '../../../functions/artist/getSpritePath';
import getPositions from '@client/functions/artist/getPositions';
import { ANIMATION_TYPES } from '@client/enums';

const DROP_HEIGHT = 200;

const drawChests = (artist: Artist) => {
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;

  const sprites = artist.chests.map((chest) => PIXI.Sprite.from(getSpritePath(chest.chestKindId)));
  const positions = getPositions({ sprites, artist });
  
  artist.chests.forEach((chest, index) => {
    const chestId = chest.chestKindId;
    const container = new PIXI.Container();
    const sprite = sprites[index];
    const position = positions[index];
    if (!sprite || !position) throw Error('Unexpected missing sprite or position in drawChests.');
    sprite.scale = 2;
    container.position = position;
    container.zIndex = 1;
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
    container.y -= DROP_HEIGHT;

    const animationType = animationTypes[ANIMATION_TYPES.DROP_FROM_ABOVE];
    if (!animationType?.getVyStarting) return;
    artist.animations.push(new Animation({
      type: ANIMATION_TYPES.DROP_FROM_ABOVE,
      targets: chestId,
      delayUntil: (Date.now() + (150 * index)),
      ix: container.x,
      iy: (container.y + DROP_HEIGHT),
      px: container.x,
      py: container.y,
      vy: animationType.getVyStarting()
    }, animationType));
  });
};

export default drawChests;