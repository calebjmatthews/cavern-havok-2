import * as PIXI from 'pixi.js';

import getSpritePath from "./getSpritePath";

const textureCache: { [spriteNamesJson: string]: PIXI.Texture[] } = {};

const getAnimationTextures = (spriteNames: string[]) => {
  const spriteNamesJson = JSON.stringify(spriteNames);
  const texturesFromCache = textureCache[spriteNamesJson];
  if (texturesFromCache) return texturesFromCache;

  const texturesNew = spriteNames.map((spriteName) => PIXI.Texture.from(getSpritePath(spriteName)));
  textureCache[spriteNamesJson] = texturesNew;
  return texturesNew;
};

export default getAnimationTextures;