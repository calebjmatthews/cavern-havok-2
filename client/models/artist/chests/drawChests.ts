import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import getPosition from '@client/functions/artist/getPosition';
import { SPRITE_MAP } from '../spriteMap';

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
  });
};

export default drawChests;