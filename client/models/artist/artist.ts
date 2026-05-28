import * as PIXI from 'pixi.js';

import type Animation from './animation';
import type Chest from '@common/models/chest';
import type Bounds from './bounds';
import type Fighter from '@common/models/fighter';
import type LayeredAnimated from './layeredAnimated';
import type BattleState from '@common/models/battleState';
import type Obstacle from '@common/models/obstacle';
import type { OpenChestArgs } from './chests/openChest';
import type { EquipToFrontArgs } from './fighters/equipToFront';
import damageChest, { type DamageChestArgs } from './chests/damageChest';
import changeFighterState, { type ChangeFighterStateArgs } from './fighters/changeFighterState';
import drawChests from './chests/drawChests';
import openChest from './chests/openChest';
import drawBackground from './background';
import drawFighters from './fighters/drawFighters';
import drawSpots from './spots/drawSpots';
import addSelectBorder from './spots/addSelectBorder';
import removeSelectBorders from './spots/removeSelectBorders';
import drawObstacles from './drawObstacles';
import equipToFront from './fighters/equipToFront';
import { PIXEL_SCALE_DEFAULT } from '@common/constants';

export default class Artist implements ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiChildrenRef: React.RefObject<{ [id: string]: PIXI.ContainerChild }>;
  pixiParticleContainersRef: React.RefObject<{ [id: string]: PIXI.ParticleContainer<PIXI.Particle> }>;
  pixiParticlesRef: React.RefObject<{ [id: string]: PIXI.Particle }>;
  pixiInitialized: boolean = false;
  windowSize: [number, number] = [100, 100];
  pixelScale: number = PIXEL_SCALE_DEFAULT;
  animations: Animation[] = [];
  particleAnimations: Animation[] = [];
  layeredAnimateds: { [id: string]: LayeredAnimated } = {};

  spotsBounds: Bounds[] = [];

  fighterEquips: { [id: string]: string[] } = {};
  
  chests: Chest[] = [];
  chestsBounds: Bounds[] = [];

  constructor(artist: ArtistInterface) {
    Object.assign(this, artist);
    this.pixiAppRef = artist.pixiAppRef;
    this.pixiChildrenRef = artist.pixiChildrenRef;
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

  drawSpots(battleState: BattleState) { drawSpots({ artist: this, battleState }); };
  addSelectBorder(coords: [number, number]) { addSelectBorder({ artist: this, coords }); };
  removeSelectBorders() { removeSelectBorders(this); };

  drawFighters(fighters: { [id: string]: Fighter }, center?: boolean) {
    drawFighters({ artist: this, fighters, center });
  }
  changeFighterState(args: ChangeFighterStateArgs) { changeFighterState({ ...args, artist: this }); };
  equipToFront(args: EquipToFrontArgs) { equipToFront({ ...args, artist: this }); };

  drawObstacles(obstacles: { [id: string]: Obstacle }) { drawObstacles({ artist: this, obstacles }); };

  drawChests() { drawChests(this); };
  damageChest(args: DamageChestArgs) { damageChest({ ...args, artist: this }); };
  openChest(args: OpenChestArgs) { openChest({ ...args, artist: this }); };
};

interface ArtistInterface {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>;
  pixiChildrenRef: React.RefObject<{ [id: string]: PIXI.ContainerChild }>;
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