import * as PIXI from 'pixi.js';

import type CycleLayer from './cycleLayer';
import layerIntoPixiSpriteAnimated from './layerIntoPixiSpriteAnimated';

export default class LayeredAnimated implements LayeredAnimatedInterface {
  id: string = '';
  intialState: string = '';
  cycleLayers: CycleLayer[] = [];
  pixiSpriteAnimated: PIXI.AnimatedSprite;

  constructor(layeredAnimated: LayeredAnimatedInterface) {
    Object.assign(this, layeredAnimated);
    let pixiSpriteAnimated: PIXI.AnimatedSprite | null = null;
    if (layeredAnimated.pixiSpriteAnimated) {
      pixiSpriteAnimated = layeredAnimated.pixiSpriteAnimated;
    }
    else {
      const layerPrimary = this.cycleLayers.find((cycleLayer) => cycleLayer.isPrimary);
      pixiSpriteAnimated = layerIntoPixiSpriteAnimated(layerPrimary, this.intialState);

      const layersSecondary = this.cycleLayers.filter((cycleLayer) => !cycleLayer.isPrimary);
      layersSecondary.forEach((layerSecondary) => {
        if (!pixiSpriteAnimated) throw Error('Missing pixiSpriteAnimated in LayeredAnimated constructor');
        pixiSpriteAnimated.addChild(
          layerIntoPixiSpriteAnimated(layerSecondary, this.intialState)
        );
      });
    };

    if (!pixiSpriteAnimated) {
      throw Error('pixiSpriteAnimated unexpectely null in LayeredAnimated constructor.');
    }
    this.pixiSpriteAnimated = pixiSpriteAnimated;
  }
};

interface LayeredAnimatedInterface {
  id: string;
  intialState: string;
  cycleLayers: CycleLayer[];
  pixiSpriteAnimated?: PIXI.AnimatedSprite;
};