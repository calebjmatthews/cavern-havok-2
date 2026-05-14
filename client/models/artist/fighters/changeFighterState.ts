import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import type LayeredAnimated from '../layeredAnimated';
import randomFrom from '@common/functions/utils/randomFrom';
import readyAnimatedSprite from '@client/functions/artist/readyAnimatedSprite';

export interface ChangeFighterStateArgs {
  artist?: Artist,
  fighterId: string,
  nextState: string,
  changeDefault?: boolean
};

const changeFighterState = (args: ChangeFighterStateArgs) => {
  const { artist, fighterId, nextState, changeDefault } = args;
  if (!artist) return;
  const pixiContainers = artist.pixiContainersRef.current;

  const container = pixiContainers[fighterId];
  const layeredAnimated = artist.layeredAnimateds[fighterId];
  if (!container || !layeredAnimated) return;

  layeredAnimated.state = nextState;
  if (changeDefault) layeredAnimated.stateDefault = nextState;
  layeredAnimated.cycleLayers.forEach((cycleLayer) => {
    const cycleOrCycles = cycleLayer.layers[nextState];
    const cycle = Array.isArray(cycleOrCycles) ? randomFrom(cycleOrCycles) : cycleOrCycles;

    const pixiAnimatedSprite = pixiContainers[`${fighterId}|${cycleLayer.id}`] as PIXI.AnimatedSprite;
    // let pixiAnimatedSprite = container.children[index] as PIXI.AnimatedSprite;
    if (!pixiAnimatedSprite) return;

    if (!cycle) {
      pixiAnimatedSprite.alpha = 0;
      return;
    }
    else {
      pixiAnimatedSprite.alpha = 1;
    }
    
    readyAnimatedSprite(pixiAnimatedSprite, cycleLayer, cycle);

    if (cycleLayer.isPrimary && !cycle.loop && cycle.spriteNames.length > 1) {
      pixiAnimatedSprite.onComplete = () => {
        changeFighterState({ artist, fighterId, nextState: layeredAnimated.stateDefault });
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