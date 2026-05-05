import * as PIXI from 'pixi.js';

import type LayerAnimated from "./layerAnimated";
import getSpritePath from '@client/functions/artist/getSpritePath';

export default class LayeredAnimated implements LayeredAnimatedInterface {
  id: string = '';
  intialState: string = '';
  layersAnimated: { [state: string]: LayerAnimated } = {};
  pixiSpriteAnimated: PIXI.AnimatedSprite;

  constructor(layeredAnimated: LayeredAnimatedInterface) {
    Object.assign(this, layeredAnimated);
    if (layeredAnimated.pixiSpriteAnimated) {
      this.pixiSpriteAnimated = layeredAnimated.pixiSpriteAnimated;
    }
    else {
      const layerAnimated = this.layersAnimated[this.intialState];
      if (!layerAnimated) throw Error(`Missing layerAnimated for: ${JSON.stringify(this)}`);
      const spriteNames = layerAnimated.spriteNames;
      console.log(`spriteNames:`, spriteNames);
      const textures = spriteNames.map((spriteName) => PIXI.Texture.from(getSpritePath(spriteName)));
      spriteNames.forEach((spriteName) => console.log(`getSpritePath(spriteName)`, getSpritePath(spriteName)));
      console.log(`textures`, textures);
      this.pixiSpriteAnimated = new PIXI.AnimatedSprite(textures);
    };
  }
};

interface LayeredAnimatedInterface {
  id: string;
  intialState: string;
  layersAnimated: { [state: string]: LayerAnimated };
  pixiSpriteAnimated?: PIXI.AnimatedSprite;
};