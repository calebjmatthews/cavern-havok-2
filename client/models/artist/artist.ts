import * as PIXI from 'pixi.js';

import type Animation from './animation';
import type Chest from '@common/models/chest';
import type Bounds from './bounds';
import drawChests from './chests/drawChests';
import damageChest, { type DamageChestArgs } from './chests/damageChest';
import type { OpenChestArgs } from './chests/openChest';
import openChest from './chests/openChest';

export default class Artist implements ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  pixiInitialized: boolean = false;
  windowSize: [number, number] = [100, 100];
  animations: Animation[] = [];
  chests: Chest[] = [];
  chestsBounds: Bounds[] = [];

  constructor(artist: ArtistInterface) {
    Object.assign(this, artist);
    this.pixiAppRef = artist.pixiAppRef;
    this.pixiContainersRef = artist.pixiContainersRef;
    if (!this.animations) this.animations = [];
    if (!this.chestsBounds) this.chestsBounds = [];
  };

  setPixiInitialized(nextPixiInitialized: boolean) { this.pixiInitialized = nextPixiInitialized; };
  setChests(nextChests: Chest[]) {
    this.chests = nextChests;
    if (nextChests.length > 0) this.drawChests();
  };

  drawChests() { drawChests(this); };
  damageChest(args: DamageChestArgs) { damageChest({ ...args, artist: this }); };
  openChest(args: OpenChestArgs) { openChest({ ...args, artist: this }); };
};

interface ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  pixiInitialized?: boolean;
  windowSize: [number, number];
  animations?: Animation[];
  chests?: Chest[];
  chestsBounds?: { id: string, x: number, y: number, width: number, height: number }[];
};