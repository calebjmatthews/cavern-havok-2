import * as PIXI from 'pixi.js';

import type Animation from './animation';
import type Treasure from "@common/models/treasure";
import type Bounds from './bounds';
import drawChests from './drawChests';

export default class Artist implements ArtistInterface {
  windowSize: [number, number] = [100, 100];
  animations: Animation[] = [];
  chests: Treasure[][] = [];
  chestsBounds: Bounds[] = [];

  constructor(artist?: ArtistInterface) {
    if (artist) Object.assign(this, artist);
    if (!this.animations) this.animations = [];
  };

  setChests(nextChests: Treasure[][]) {
    this.chests = nextChests;
  };

  drawChests(args: {
    pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
    pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
  }) {
    drawChests({ ...args, artist: this });
  }
};

interface ArtistInterface {
  windowSize: [number, number];
  animations?: Animation[];
  chests?: Treasure[][];
  chestsBounds: { id: string, x: number, y: number, width: number, height: number }[];
};