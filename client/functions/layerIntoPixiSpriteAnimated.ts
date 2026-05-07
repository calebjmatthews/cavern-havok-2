import * as PIXI from 'pixi.js';

import type CycleLayer from '@client/models/artist/cycleLayer';
import getSpritePath from '@client/functions/artist/getSpritePath';

const layerIntoPixiSpriteAnimated = (cycleLayer?: CycleLayer, initialState?: string) => {
  if (!cycleLayer || !initialState) throw Error('Missing data for layerIntoPixiSpriteAnimated');
  const cycle = cycleLayer?.layers[initialState];
  if (!cycle) throw Error(`Missing cycle for: ${JSON.stringify(this)}`);

  const spriteNames = cycle.spriteNames;
  const textures = spriteNames.map((spriteName) => PIXI.Texture.from(getSpritePath(spriteName)));
  const pixiSpriteAnimated = new PIXI.AnimatedSprite(textures);

  pixiSpriteAnimated.zIndex = cycleLayer.zIndex;
  if (cycleLayer.tint && !cycleLayer.isPrimary) pixiSpriteAnimated.tint = cycleLayer.tint;
  if (cycle.offsets?.[0]) pixiSpriteAnimated.position = cycle.offsets[0];

  return pixiSpriteAnimated;
};

export default layerIntoPixiSpriteAnimated