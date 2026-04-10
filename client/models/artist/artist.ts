import * as PIXI from 'pixi.js';

import type Treasure from "@common/models/treasure";
import { SPRITE_MAP } from './spriteMap';

export default class Artist {
  chests: Treasure[][] = [];

  constructor(artist?: Artist) {
    if (artist) Object.assign(this, artist);
  };

  setChests(nextChests: Treasure[][]) {
    this.chests = nextChests;
  };

  drawChests(args: {
    pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
    pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
  }) {
    const { pixiAppRef, pixiContainersRef } = args;
    
    this.chests.forEach((_chest, index) => {
      if (pixiAppRef.current === null) return;
      const container = new PIXI.Container();
      container.position = { x: 100, y: 100 };
      container.addChild(PIXI.Sprite.from(SPRITE_MAP.CHEST_BASIC));
      pixiContainersRef.current[`chest-basic-${index}`] = container;
      pixiAppRef.current.stage.addChild(container);
    });
  };
};