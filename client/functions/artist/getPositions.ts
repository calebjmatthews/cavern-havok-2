import * as PIXI from 'pixi.js';

import { PIXEL_SCALE } from "@common/constants";
import type Artist from "@client/models/artist/artist";

const getPositionsAfterFallbacks = (args: {
  sprites: PIXI.Sprite[],
  artist: Artist,
  direction: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center'
}) => {
  const { sprites, artist, direction, justifyContent, alignItems } = args;
  const ws: [number, number] = [artist.windowSize[0] / PIXEL_SCALE, artist.windowSize[1] / PIXEL_SCALE];

  return sprites.map((sprite, index) => {
    const spriteSize: [number, number] = [sprite.width, sprite.height];
    const offset: [number, number] = [spriteSize[0] / 2, spriteSize[1] / 2];
    let x = 0;
    let y = 0;

    if (direction === 'row' && alignItems === 'center') { // Or 'column' + 'center', for x
      y = (ws[1] / 2) - offset[1];
    };

    if (direction === 'row' && justifyContent === 'space-evenly') {
      x = (ws[0] / (sprites.length + 1)) + (index * (ws[0] / (sprites.length + 1))) - (offset[0] * 2);
    };

    return { x, y };
  })
};

const getPositions = (args: {
  sprites: PIXI.Sprite[],
  artist: Artist,
  direction?: 'row',
  justifyContent?: 'space-evenly',
  alignItems?: 'center'
}) => (
  getPositionsAfterFallbacks({
    ...args,
    direction: args.direction ?? 'row',
    justifyContent: args.justifyContent ?? 'space-evenly',
    alignItems: args.alignItems ?? 'center'
  })
);

export default getPositions;