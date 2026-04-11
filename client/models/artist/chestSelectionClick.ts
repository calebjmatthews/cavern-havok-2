import * as PIXI from 'pixi.js';

import type Artist from "./artist";
import { SPRITE_MAP } from './spriteMap';
import getPosition from './getPosition';

const chestSelectionClick = (args: {
  chestId: string,
  artist: Artist,
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
}) => {
  const { artist, pixiAppRef, pixiContainersRef } = args;

  
};