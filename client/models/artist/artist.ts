import * as PIXI from 'pixi.js';

import type Animation from './animation';
import type Chest from '@common/models/chest';
import type Bounds from './bounds';
import type Fighter from '@common/models/fighter';
import type LayeredAnimated from './layeredAnimated';
import type { OpenChestArgs } from './chests/openChest';
import drawChests from './chests/drawChests';
import damageChest, { type DamageChestArgs } from './chests/damageChest';
import openChest from './chests/openChest';
import drawBackground from './background';
import drawFighters from './fighters';

export default class Artist implements ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  pixiParticleContainersRef: React.RefObject<{ [id: string]: PIXI.ParticleContainer<PIXI.IParticle> }>;
  pixiParticlesRef: React.RefObject<{ [id: string]: PIXI.IParticle }>;
  pixiInitialized: boolean = false;
  windowSize: [number, number] = [100, 100];
  animations: Animation[] = [];
  particleAnimations: Animation[] = [];
  layeredAnimateds: { [id: string]: LayeredAnimated } = {};

  fighters: { [id: string]: Fighter } = {};
  
  chests: Chest[] = [];
  chestsBounds: Bounds[] = [];

  constructor(artist: ArtistInterface) {
    Object.assign(this, artist);
    this.pixiAppRef = artist.pixiAppRef;
    this.pixiContainersRef = artist.pixiContainersRef;
    this.pixiParticleContainersRef = artist.pixiParticleContainersRef;
    this.pixiParticlesRef = artist.pixiParticlesRef;
    if (!this.animations) this.animations = [];
    if (!this.particleAnimations) this.particleAnimations = [];
    if (!this.chestsBounds) this.chestsBounds = [];
  };

  setPixiInitialized(nextPixiInitialized: boolean) { this.pixiInitialized = nextPixiInitialized; };
  setFighters(nextFighters: { [id: string]: Fighter } ) {
    this.fighters = nextFighters;
    this.drawFighters();
  };
  setChests(nextChests: Chest[]) {
    this.chests = nextChests;
    if (nextChests.length > 0) this.drawChests();
  };

  drawBackground(key: string) { drawBackground(this, key); };

  drawFighters() { drawFighters(this); }

  drawChests() { drawChests(this); };
  damageChest(args: DamageChestArgs) { damageChest({ ...args, artist: this }); };
  openChest(args: OpenChestArgs) { openChest({ ...args, artist: this }); };
};

interface ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  pixiParticleContainersRef: React.RefObject<{ [id: string]: PIXI.ParticleContainer<PIXI.IParticle> }>;
  pixiParticlesRef: React.RefObject<{ [id: string]: PIXI.IParticle }>;
  pixiInitialized?: boolean;
  windowSize: [number, number];
  animations?: Animation[];
  particleAnimations?: Animation[];
  layeredAnimateds?: { [id: string]: LayeredAnimated };

  fighters?: { [id: string]: Fighter };

  chests?: Chest[];
  chestsBounds?: { id: string, x: number, y: number, width: number, height: number }[];
};