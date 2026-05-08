import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import getAnimationTextures from '@client/functions/artist/getAnimationTextures';
import applyCycleLayerProps from '@client/functions/artist/applyCycleProps';
import randomFrom from '@common/functions/utils/randomFrom';

const changeFighterState = (args: {
  artist: Artist,
  fighterId: string,
  nextState: string
}) => {
  const { artist, fighterId, nextState } = args;
  const pixiContainers = artist.pixiContainersRef.current;

  const container = pixiContainers[fighterId];
  const layeredAnimated = artist.layeredAnimateds[fighterId];
  if (!container || !layeredAnimated) return;

  layeredAnimated.cycleLayers.forEach((cycleLayer, index) => {
    const cycleOrCycles = cycleLayer.layers[nextState];
    const cycle = Array.isArray(cycleOrCycles) ? randomFrom(cycleOrCycles) : cycleOrCycles;
    let pixiAnimatedSprite = container.children[index] as PIXI.AnimatedSprite;
    if (!cycle || !pixiAnimatedSprite) return;
    const textures = getAnimationTextures(cycle);
    pixiAnimatedSprite.stop();
    pixiAnimatedSprite.currentFrame = 0;

    pixiAnimatedSprite.textures = textures;
    pixiAnimatedSprite = applyCycleLayerProps(pixiAnimatedSprite, cycleLayer, cycle);

    pixiAnimatedSprite.play();

    if (Array.isArray(cycleOrCycles)) {
      pixiAnimatedSprite.onLoop = () => {
        const cycle = randomFrom(cycleOrCycles);
        const textures = getAnimationTextures(cycle);
        pixiAnimatedSprite.stop();
        pixiAnimatedSprite.currentFrame = 0;

        pixiAnimatedSprite.textures = textures;
        pixiAnimatedSprite = applyCycleLayerProps(pixiAnimatedSprite, cycleLayer, cycle);

        pixiAnimatedSprite.play();
      };
    }
    else {
      pixiAnimatedSprite.onLoop = undefined;
    };
  });
};

export default changeFighterState;