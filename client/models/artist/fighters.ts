import * as PIXI from 'pixi.js';

import type Artist from "./artist";
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
      const container = new PIXI.Container();
      pixiContainers[fighter.id] = container;
      if (fighters.length === 1) layeredAnimated.pixiSpriteAnimated.scale = 1.5;
      const position = getPosition({
        sprite: layeredAnimated.pixiSpriteAnimated,
        artist,
        gravity: 'center'
      });
      container.position = position;
      container.zIndex = 1;
      container.addChild(layeredAnimated.pixiSpriteAnimated);
      pixiApp.stage.addChild(container)
    };
  });
};

export default drawFighters;