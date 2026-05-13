import * as PIXI from 'pixi.js';

import type Animation from './animation';
import type Chest from '@common/models/chest';
import type Bounds from './bounds';
import type Fighter from '@common/models/fighter';
import type LayeredAnimated from './layeredAnimated';
import type BattleState from '@common/models/battleState';
import type { OpenChestArgs } from './chests/openChest';
import damageChest, { type DamageChestArgs } from './chests/damageChest';
import changeFighterState, { type ChangeFighterStateArgs } from './fighters/changeFighterState';
import drawChests from './chests/drawChests';
import openChest from './chests/openChest';
import drawBackground from './background';
import drawFighters from './fighters/drawFighters';
import drawSpots from './spots/drawSpots';
import { PIXEL_SCALE_DEFAULT } from '@common/constants';

export default class Artist implements ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  pixiParticleContainersRef: React.RefObject<{ [id: string]: PIXI.ParticleContainer<PIXI.Particle> }>;
  pixiParticlesRef: React.RefObject<{ [id: string]: PIXI.Particle }>;
  pixiInitialized: boolean = false;
  windowSize: [number, number] = [100, 100];
  pixelScale: number = PIXEL_SCALE_DEFAULT;
  animations: Animation[] = [];
  particleAnimations: Animation[] = [];
  layeredAnimateds: { [id: string]: LayeredAnimated } = {};

  spotsBounds: Bounds[] = [];
  
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
  setPixelScale(nextPixelScale: number) { this.pixelScale = nextPixelScale; };
  setChests(nextChests: Chest[]) {
    this.chests = nextChests;
    if (nextChests.length > 0) this.drawChests();
  };

  drawBackground(key: string) { drawBackground(this, key); };

  drawSpots(battleState: BattleState) { drawSpots({artist: this, battleState}); };

  drawFighters(fighters: { [id: string]: Fighter }, center?: boolean) {
    drawFighters({ artist: this, fighters, center });
  }
  changeFighterState(args: ChangeFighterStateArgs) { changeFighterState({ artist: this, ...args }); };

  drawChests() { drawChests(this); };
  damageChest(args: DamageChestArgs) { damageChest({ ...args, artist: this }); };
  openChest(args: OpenChestArgs) { openChest({ ...args, artist: this }); };
};

interface ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>;
  pixiParticleContainersRef: React.RefObject<{ [id: string]: PIXI.ParticleContainer<PIXI.Particle> }>;
  pixiParticlesRef: React.RefObject<{ [id: string]: PIXI.Particle }>;
  pixiInitialized?: boolean;
  windowSize: [number, number];
  pixelScale?: number;
  animations?: Animation[];
  particleAnimations?: Animation[];
  layeredAnimateds?: { [id: string]: LayeredAnimated };

  spotsBounds?: Bounds[];

  chests?: Chest[];
  chestsBounds?: Bounds[];
};