import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import Animation from '../animation';
import animationTypes from '@client/instances/artist/animations';

const applyFighterAnimations = (args: {
  artist: Artist,
  fighter: Fighter,
  pixiChildren: { [id: string]: PIXI.ContainerChild },
}) => {
  const { artist, fighter, pixiChildren } = args;

  const layeredAnimated = artist.layeredAnimateds[fighter.id];
  if (!layeredAnimated) throw Error('layeredAnimated missing in applyFighterAnimations');

  layeredAnimated.cycleLayers.forEach((cycleLayer) => {
    (cycleLayer.animationTypeIds ?? []).map((animationTypeId) => {
      const targets = `${fighter.id}|${cycleLayer.id}`;
      const animationType = animationTypes[animationTypeId];
      const container = pixiChildren[targets];
      if (!animationType || !container) {
        throw Error(`Missing data in applyFighterAnimations, animationType: ${!!animationType}, container: ${!!container}.`);
      };
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