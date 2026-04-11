import * as PIXI from 'pixi.js';

import type Animation from './animation';
import type Treasure from "@common/models/treasure";
import type Bounds from './bounds';
import drawChests from './chests/drawChests';
import damageChest, { type DamageChestArgs } from './chests/damageChest';

export default class Artist implements ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  windowSize: [number, number] = [100, 100];
  animations: Animation[] = [];
  chests: Treasure[][] = [];
  chestsBounds: Bounds[] = [];

  constructor(artist: ArtistInterface) {
    Object.assign(this, artist);
    this.pixiAppRef = artist.pixiAppRef;
    this.pixiContainersRef = artist.pixiContainersRef;
    if (!this.animations) this.animations = [];
    if (!this.chestsBounds) this.chestsBounds = [];
  };

  setChests(nextChests: Treasure[][]) {
    this.chests = nextChests;
  };

  drawChests() { drawChests(this); };
  damageChest(args: DamageChestArgs) { damageChest({ ...args, artist: this }); };
};

interface ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  windowSize: [number, number];
  animations?: Animation[];
  chests?: Treasure[][];
  chestsBounds?: { id: string, x: number, y: number, width: number, height: number }[];
};