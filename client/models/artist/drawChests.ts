import * as PIXI from 'pixi.js';

import type Artist from "./artist";
import { SPRITE_MAP } from './spriteMap';
import getPosition from '@client/functions/artist/getPosition';

const drawChests = (args: {
  artist: Artist,
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
}) => {
  const { artist, pixiAppRef, pixiContainersRef } = args;
  
  artist.chests.forEach((_chest, index) => {
    if (pixiAppRef.current === null) return;

    const chestId = `chest-basic-${index}`;
    const container = new PIXI.Container();
    const sprite = PIXI.Sprite.from(SPRITE_MAP.CHEST_BASIC);
    sprite.scale = 2;
    container.position = getPosition({ sprite, artist, gravity: 'center' });
    container.addChild(sprite);
    pixiContainersRef.current[chestId] = container;
    pixiAppRef.current.stage.addChild(container);
    artist.chestsBounds.push({
      id: chestId,
      x: container.x,
      y: container.y,
      width: sprite.width,
      height: sprite.height
    })
  });
};

export default drawChests;