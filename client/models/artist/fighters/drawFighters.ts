import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import fighterToLayeredAnimated from '@client/functions/artist/fighterToLayeredAnimated';
import getPosition from '@client/functions/artist/getPosition';

const drawFighters = (args: {
  artist: Artist,
  fighters: { [id: string]: Fighter },
  center?: boolean
}) => {
  const { artist, fighters, center } = args;
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;

  const fightersArray = Object.values(fighters);
  fightersArray.forEach((fighter, index) => {
    if (center && index > 1) return;
    const layeredAnimated = fighterToLayeredAnimated(fighter);

    // Init fighter
    if (!pixiContainers[fighter.id]) {
      artist.layeredAnimateds[fighter.id] = layeredAnimated;
      pixiContainers[fighter.id] = layeredAnimated.pixiContainer;
      const scale = center ? artist.pixelScale * 1.5 : artist.pixelScale;
      layeredAnimated.pixiContainer.scale = scale;

      const firstChild = layeredAnimated.pixiContainer.children[0];
      if (!firstChild) throw Error('Missing first child in drawFighters');

      let position = { x: -1000, y: -1000 };

      if (center) {
        position = getPosition({
          sprite: firstChild,
          artist,
          gravity: 'center'
        });
      }
      else {
        const spot = pixiContainers[`spot-${fighter.coords[0]}-${fighter.coords[1]}`];
        if (!spot) return;

        const spotMiddleX = spot.x + (spot.width / 2);
        const bottomPadding = (2 * artist.pixelScale);
        const spotBottomY = (spot.y + spot.height) - bottomPadding;

        position = {
          x: Math.round(spotMiddleX - (layeredAnimated.pixiContainer.width / 2)),
          y: Math.round(spotBottomY - (layeredAnimated.pixiContainer.height))
        };
      }
      
      layeredAnimated.pixiContainer.position = position;
      pixiApp.stage.addChild(layeredAnimated.pixiContainer);
    };
  });
};

export default drawFighters;