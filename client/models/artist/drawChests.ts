import * as PIXI from 'pixi.js';

import type Artist from "./artist";
import { SPRITE_MAP } from './spriteMap';
import getPosition from './getPosition';

const drawChests = (args: {
  artist: Artist,
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
}) => {
  const { artist, pixiAppRef, pixiContainersRef } = args;
  
  artist.chests.forEach((_chest, index) => {
    if (pixiAppRef.current === null) return;
    const container = new PIXI.Container();
    const sprite = PIXI.Sprite.from(SPRITE_MAP.CHEST_BASIC);
    sprite.scale = 2;
    console.log(`getPosition({ sprite, artist, gravity: 'center' })`, getPosition({ sprite, artist, gravity: 'center' }));
    container.position = getPosition({ sprite, artist, gravity: 'center' });
    container.addChild(sprite);
    pixiContainersRef.current[`chest-basic-${index}`] = container;
    pixiAppRef.current.stage.addChild(container);
  });
};

export default drawChests;