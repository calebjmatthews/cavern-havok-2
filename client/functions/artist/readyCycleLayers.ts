import * as PIXI from 'pixi.js';

import type Artist from "@client/models/artist/artist";
import type LayeredAnimated from "@client/models/artist/layeredAnimated";
import randomFrom from '@common/functions/utils/randomFrom';
import readyAnimatedSprite from '@client/functions/artist/readyAnimatedSprite';
import changeFighterState from '@client/models/artist/occupants/changeFighterState';

const readyCycleLayers = (args: {
  artist: Artist,
  fighterId: string,
  layeredAnimated: LayeredAnimated,
  pixiChildren: { [id: string]: PIXI.ContainerChild; },
  nextState?: string
}) => {
  const { artist, fighterId, layeredAnimated, pixiChildren, nextState } = args;

  layeredAnimated.cycleLayers.forEach((cycleLayer) => {
    const cycleOrCycles = cycleLayer.layers[nextState ?? layeredAnimated.state];
    const cycle = Array.isArray(cycleOrCycles) ? randomFrom(cycleOrCycles) : cycleOrCycles;

    const pixiAnimatedSprite = pixiChildren[`${fighterId}|${cycleLayer.id}`] as PIXI.AnimatedSprite;
    if (!pixiAnimatedSprite) return;

    if (!cycle) {
      pixiAnimatedSprite.alpha = 0;
      return;
    }
    else {
      pixiAnimatedSprite.alpha = 1;
    }
    
    readyAnimatedSprite(pixiAnimatedSprite, cycle, cycleLayer);

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
        readyAnimatedSprite(pixiAnimatedSprite, cycle, cycleLayer);
      };
    }
    else {
      pixiAnimatedSprite.onLoop = undefined;
    };
  });
};

export default readyCycleLayers;