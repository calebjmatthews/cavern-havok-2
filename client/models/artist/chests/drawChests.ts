import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '../animation';
import animationTypes from '@client/instances/artist/animations';
import getSpritePath from '../../../functions/artist/getSpritePath';
import getPositions from '@client/functions/artist/getPositions';
import { ANIMATION_TYPES } from '@client/enums';
import { ARTIST_Z_INDECES } from '@common/enums';

const DROP_HEIGHT = 200;

const drawChests = (artist: Artist) => {
  const pixiApp = artist.pixiAppRef.current;
  const pixiChildren = artist.pixiChildrenRef.current;
  if (!pixiApp) return;

  const sprites = artist.chests.map((chest) => PIXI.Sprite.from(getSpritePath(chest.chestKindId)));
  const positions = getPositions({ sprites, artist });
  
  artist.chests.forEach((chest, index) => {
    const chestId = chest.chestKindId;
    const container = new PIXI.Container();
    const sprite = sprites[index];
    const position = positions[index];
    const mainContainer = pixiChildren['main'];
    if (!sprite || !position || !mainContainer) throw Error('Missing data in drawChests.');
    mainContainer.alpha = 1;
    sprite.scale = (artist.pixelScale * 2);
    container.position = position;
    container.zIndex = ARTIST_Z_INDECES.MAIN;
    container.addChild(sprite);
    pixiChildren[chestId] = container;
    mainContainer.addChild(container);
    artist.chestsBounds.push({
      id: chestId,
      x: (container.x / artist.pixelScale),
      y: (container.y / artist.pixelScale),
      width: (sprite.width / artist.pixelScale),
      height: (sprite.height / artist.pixelScale)
    });
    const iy = container.y;
    container.y = iy - (DROP_HEIGHT * artist.pixelScale);

    const animationType = animationTypes[ANIMATION_TYPES.DROP_FROM_ABOVE];
    if (!animationType?.getVyStarting) return;
    artist.animations.push(new Animation({
      type: ANIMATION_TYPES.DROP_FROM_ABOVE,
      targets: chestId,
      delayUntil: (Date.now() + (150 * index)),
      ix: container.x,
      iy,
      px: container.x,
      py: container.y,
      vy: animationType.getVyStarting(artist.pixelScale)
    }, animationType));
  });
};

export default drawChests;