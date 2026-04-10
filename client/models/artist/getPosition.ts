import * as PIXI from 'pixi.js';

import { PIXEL_SCALE } from "@common/constants";
import type Artist from "./artist";

const getPosition = (args: {
  sprite: PIXI.Sprite,
  artist: Artist,
  gravity: 'center'
}) => {
  const { sprite, artist, gravity } = args;

  const spriteSize: [number, number] = [sprite.width, sprite.height];
  const offset: [number, number] = [spriteSize[0] / 2, spriteSize[1] / 2];
  const ws: [number, number] = [artist.windowSize[0] / PIXEL_SCALE, artist.windowSize[1] / PIXEL_SCALE];

  switch(gravity) {
    case 'center':
      return { x: (ws[0] / 2) - offset[0], y: (ws[1] / 2) - offset[1]};
  }
};

export default getPosition;