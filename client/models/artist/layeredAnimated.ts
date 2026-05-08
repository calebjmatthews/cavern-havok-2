import * as PIXI from 'pixi.js';

import type CycleLayer from './cycleLayer';
import layerIntoPixiSpriteAnimated from '@client/functions/artist/layerIntoPixiSpriteAnimated';

export default class LayeredAnimated implements LayeredAnimatedInterface {
  id: string = '';
  state: string = '';
  // ToDo: Create a changeable stateDefault, so temporary states like being damaged can return to something like clenched or critical.
  cycleLayers: CycleLayer[] = [];
  pixiContainer: PIXI.Container;

  constructor(layeredAnimated: LayeredAnimatedInterface) {
    Object.assign(this, layeredAnimated);
    this.cycleLayers = layeredAnimated.cycleLayers.sort((a, b) => {
      if (a.isPrimary || b.isPrimary) return (a.isPrimary ? -10000 : 10000);
      return a.zIndex - b.zIndex
    });

    if (layeredAnimated.pixiContainer) {
      this.pixiContainer = layeredAnimated.pixiContainer;
      return;
    }
    
    this.pixiContainer = new PIXI.Container();
    this.cycleLayers.forEach((cycleLayer) => {
      this.pixiContainer.addChild(
        layerIntoPixiSpriteAnimated(cycleLayer, this.state)
      )
    });
  }
};

interface LayeredAnimatedInterface {
  id: string;
  state: string;
  cycleLayers: CycleLayer[];
  pixiContainer?: PIXI.Container;
};