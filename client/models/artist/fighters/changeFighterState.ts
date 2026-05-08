import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import randomFrom from '@common/functions/utils/randomFrom';
import readyAnimatedSprite from '@client/functions/artist/readyAnimatedSprite';
import { LAYERED_ANIMATED_STATE_DEFAULT } from '@common/constants';

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
    
    readyAnimatedSprite(pixiAnimatedSprite, cycleLayer, cycle);

    if (index === 0 && !cycle.loop && cycle.spriteNames.length > 1) {
      pixiAnimatedSprite.onComplete = () => {
        changeFighterState({ artist, fighterId, nextState: LAYERED_ANIMATED_STATE_DEFAULT });
      };
    }
    else {
      pixiAnimatedSprite.onComplete = undefined;
    };

    if (Array.isArray(cycleOrCycles)) {
      pixiAnimatedSprite.onLoop = () => {
        const cycle = randomFrom(cycleOrCycles);
        readyAnimatedSprite(pixiAnimatedSprite, cycleLayer, cycle);
      };
    }
    else {
      pixiAnimatedSprite.onLoop = undefined;
    };
  });
};

export default changeFighterState;