import * as PIXI from 'pixi.js';

import type CycleLayer from './cycleLayer';
import getSpritePath from '@client/functions/artist/getSpritePath';

const layerIntoPixiSpriteAnimated = (cycleLayer?: CycleLayer, initialState?: string) => {
  if (!cycleLayer || !initialState) throw Error('Missing data for layerIntoPixiSpriteAnimated');
  const cycle = cycleLayer?.layers[initialState];
  if (!cycle) throw Error(`Missing cycle for: ${JSON.stringify(this)}`);
  const spriteNames = cycle.spriteNames;
  const textures = spriteNames.map((spriteName) => PIXI.Texture.from(getSpritePath(spriteName)));
  const pixiSpriteAnimated = new PIXI.AnimatedSprite(textures);
  if (cycleLayer.tint) pixiSpriteAnimated.tint = cycleLayer.tint;
  return pixiSpriteAnimated;
};

export default layerIntoPixiSpriteAnimated