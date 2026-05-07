import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import fighterToLayeredAnimated from '@client/functions/artist/fighterToLayeredAnimated';
import getPosition from '@client/functions/artist/getPosition';

const drawFighters = (artist: Artist) => {
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;

  const fighters = Object.values(artist.fighters);
  fighters.forEach((fighter) => {
    const layeredAnimated = fighterToLayeredAnimated(fighter);

    // Init fighter
    if (!pixiContainers[fighter.id]) {
      artist.layeredAnimateds[fighter.id] = layeredAnimated;
      pixiContainers[fighter.id] = layeredAnimated.pixiContainer;
      if (fighters.length === 1) layeredAnimated.pixiContainer.scale = 1.5;
      const firstChild = layeredAnimated.pixiContainer.children[0];
      if (!firstChild) throw Error('Missing first child in drawFighters');

      const position = getPosition({
        sprite: firstChild,
        artist,
        gravity: 'center'
      });
      layeredAnimated.pixiContainer.position = position;
      pixiApp.stage.addChild(layeredAnimated.pixiContainer);
    };
  });
};

export default drawFighters;