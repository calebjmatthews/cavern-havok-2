import * as PIXI from 'pixi.js';

import type Cycle from '@client/models/artist/cycle';
import getSpritePath from "./getSpritePath";

const textureCache: { [cycleJson: string]: (PIXI.Texture[] | PIXI.FrameObject[]) } = {};

const getAnimationTextures = (cycle: Cycle) => {
  const cycleJson = JSON.stringify(cycle);
  const texturesFromCache = textureCache[cycleJson];
  if (texturesFromCache) return texturesFromCache;
  
  const textures = cycle.spriteNames.map((spriteName) => (
    PIXI.Texture.from(getSpritePath(spriteName)
  )));
  let result: (PIXI.Texture[] | PIXI.FrameObject[]) = textures;
  if (cycle.durations) {
    result = textures.map((texture, index) => {
      const time = cycle.durations?.[index];
      if (!time) throw Error(`time missing in ${JSON.stringify(cycle)}.`);
      return { texture, time };
    });
  };
  
  textureCache[cycleJson] = result;
  return result;
};

export default getAnimationTextures;