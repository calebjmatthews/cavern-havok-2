import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import Animation from '../animation';
import animationTypes from '@client/instances/artist/animations';

const MAX_ATTEMPTS = 500;

const applyFighterAnimations = (args: {
  artist: Artist,
  fighter: Fighter,
  pixiChildren: { [id: string]: PIXI.ContainerChild },
  attempts?: number
}) => {
  const { artist, fighter, pixiChildren, attempts } = args;

  const layeredAnimated = artist.layeredAnimateds[fighter.id];
  if (!layeredAnimated) {
    if ((attempts ?? 0) < MAX_ATTEMPTS) {
      setTimeout(() => (
        applyFighterAnimations({ ...args, attempts: ((attempts ?? 0) + 1) })
      ), 10);
      return;
    }
    return;
  };

  layeredAnimated.cycleLayers.forEach((cycleLayer) => {
    (cycleLayer.animationTypeIds ?? []).map((animationTypeId) => {
      const targets = `${fighter.id}|${cycleLayer.id}`;
      const animationType = animationTypes[animationTypeId];
      const container = pixiChildren[targets];
      if (!animationType || !container) {
        throw Error(`Missing data in applyFighterAnimations, animationType: ${!!animationType}, container: ${!!container}.`);
      };
      if (artist.animations.find((a) => a.targets === targets)) return;
      artist.animations.push(new Animation({
        type: animationTypeId,
        targets,
        ix: container.x,
        iy: container.y,
        infinite: true
      }, animationType));
    });
  });
};

export default applyFighterAnimations;