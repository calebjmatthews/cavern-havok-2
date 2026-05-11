import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import fighterToLayeredAnimated from '@client/functions/artist/fighterToLayeredAnimated';
import getPosition from '@client/functions/artist/getPosition';

const drawFighters = (args: {
  artist: Artist,
  fighters: { [id: string]: Fighter }
}) => {
  const { artist, fighters } = args;
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;

  const fightersArray = Object.values(fighters);
  fightersArray.forEach((fighter) => {
    const layeredAnimated = fighterToLayeredAnimated(fighter);

    // Init fighter
    if (!pixiContainers[fighter.id]) {
      artist.layeredAnimateds[fighter.id] = layeredAnimated;
      pixiContainers[fighter.id] = layeredAnimated.pixiContainer;
      if (fightersArray.length === 1) layeredAnimated.pixiContainer.scale = artist.pixelScale * 1.5;
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