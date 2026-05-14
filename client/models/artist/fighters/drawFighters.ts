import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import fighterToLayeredAnimated from '@client/functions/artist/fighterToLayeredAnimatedAndPixi';
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
    
    if (!pixiContainers[fighter.id] && fighter.coords[0] >= 0 && fighter.coords[1] >= 0) {
      initFighter({ artist, fighter, pixiApp, pixiContainers, center });
    }
    else {
      updateFighter({ artist, fighter, pixiApp, pixiContainers });
    }
  });
};

const initFighter = (args: {
  artist: Artist,
  fighter: Fighter,
  pixiApp: PIXI.Application,
  pixiContainers: { [id: string]: PIXI.Container<PIXI.ContainerChild> },
  center?: boolean
}) => {
  const { artist, fighter, pixiApp, pixiContainers, center } = args;
  const { layeredAnimated, pixiContainer, pixiAnimatedSpriteMap } = fighterToLayeredAnimated(fighter);

  artist.layeredAnimateds[fighter.id] = layeredAnimated;
  pixiContainers[fighter.id] = pixiContainer;
  const scale = center ? artist.pixelScale * 1.5 : artist.pixelScale;
  pixiContainer.scale = scale;

  Object.entries(pixiAnimatedSpriteMap).forEach(([id, pixiAnimatedSprite]) => {
    pixiContainers[id] = pixiAnimatedSprite;
  });

  const firstChild = pixiContainer.children[0];
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
    const spot = pixiContainers[`spot|${fighter.coords[0]}|${fighter.coords[1]}`];
    if (!spot) return;

    const spotMiddleX = spot.x + (spot.width / 2);
    const bottomPadding = (2 * artist.pixelScale);
    const spotBottomY = (spot.y + spot.height) - bottomPadding;

    position = {
      x: Math.round(spotMiddleX - (pixiContainer.width / 2)),
      y: Math.round(spotBottomY - (pixiContainer.height))
    };
  };
  
  pixiContainer.position = position;

  if (fighter.side === 'A') {
    pixiContainer.x += pixiContainer.width;
    pixiContainer.scale.x *= -1;
  };

  pixiApp.stage.addChild(pixiContainer);
};

const updateFighter = (args: {
  artist: Artist,
  fighter: Fighter,
  pixiApp: PIXI.Application,
  pixiContainers: { [id: string]: PIXI.Container<PIXI.ContainerChild> }
}) => {
  const { artist, fighter, pixiApp, pixiContainers } = args;
  const layeredAnimated = fighterToLayeredAnimated(fighter);
};

export default drawFighters;