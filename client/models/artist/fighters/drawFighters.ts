import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import fighterToLayeredAnimatedAndPixis, { fighterToCycleLayersAndPixi }
  from '@client/functions/artist/fighterToLayeredAnimatedAndPixi';
import getPosition from '@client/functions/artist/getPosition';
import readyCycleLayers from '@client/functions/artist/readyCycleLayers';

const drawFighters = (args: {
  artist: Artist,
  fighters: { [id: string]: Fighter },
  center?: boolean
}) => {
  const { artist, fighters, center } = args;
  const pixiApp = artist.pixiAppRef.current;
  const pixiChildren = artist.pixiChildrenRef.current;
  if (!pixiApp) return;

  const fightersArray = Object.values(fighters);
  fightersArray.forEach((fighter, index) => {
    if (center && index > 1) return;
    
    if (!pixiChildren[fighter.id] && fighter.coords[0] >= 0 && fighter.coords[1] >= 0) {
      initFighter({ artist, fighter, pixiApp, pixiChildren, center });
    }
    else {
      updateFighter({ artist, fighter, pixiChildren });
    }
  });
};

const initFighter = (args: {
  artist: Artist,
  fighter: Fighter,
  pixiApp: PIXI.Application,
  pixiChildren: { [id: string]: PIXI.ContainerChild },
  center?: boolean
}) => {
  const { artist, fighter, pixiApp, pixiChildren, center } = args;
  const {
    layeredAnimated, pixiContainer, pixiAnimatedSpriteMap
  } = fighterToLayeredAnimatedAndPixis(fighter);

  artist.layeredAnimateds[fighter.id] = layeredAnimated;
  pixiChildren[fighter.id] = pixiContainer;
  const scale = center ? artist.pixelScale * 1.5 : artist.pixelScale;
  pixiContainer.scale = scale;

  Object.entries(pixiAnimatedSpriteMap).forEach(([id, pixiAnimatedSprite]) => {
    pixiChildren[id] = pixiAnimatedSprite;
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
    const spot = pixiChildren[`spot|${fighter.coords[0]}|${fighter.coords[1]}`];
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
  pixiChildren: { [id: string]: PIXI.ContainerChild }
}) => {
  const { artist, fighter, pixiChildren } = args;
  const fighterId = fighter.id;
  const pixiContainer = pixiChildren[fighterId];
  const layeredAnimated = artist.layeredAnimateds[fighterId];
  if (!pixiContainer || !layeredAnimated) return;
  
  const { cycleLayerArray, pixiAnimatedSpriteMap } = fighterToCycleLayersAndPixi(
    { fighter, state: layeredAnimated.state }
  );

  // Create maps of animated sprites to be added and removed
  const pixiAnimatedSpritesToDelete: { [pasId: string]: PIXI.AnimatedSprite } = {};
  const pixiAnimatedSpritesToAdd: { [pasId: string]: PIXI.AnimatedSprite } = {};
  const pixiAnimatedSpritesExisting: { [pasId: string]: PIXI.AnimatedSprite } = {};
  Object.keys(pixiChildren)
  .filter((id) => (id.includes(`${fighterId}|`)))
  .forEach((pasId) => {
    const pixiAnimatedSpriteExisting = pixiChildren[pasId] as PIXI.AnimatedSprite;
    pixiAnimatedSpritesExisting[pasId] = pixiAnimatedSpriteExisting;
    if (!pixiAnimatedSpriteMap[pasId]) {
      pixiAnimatedSpritesToDelete[pasId] = pixiAnimatedSpriteExisting;
    };
  });
  Object.entries(pixiAnimatedSpriteMap).forEach(([pasId, pixiAnimatedSprite]) => {
    if (!pixiAnimatedSpritesExisting[pasId]) {
      pixiAnimatedSpritesToAdd[pasId] = pixiAnimatedSprite;
    };
  });
  if (Object.keys(pixiAnimatedSpritesToDelete).length === 0
    && Object.keys(pixiAnimatedSpritesToAdd).length === 0) return;

  // Set new layered animated state to match existing
  layeredAnimated.state = layeredAnimated.state;
  layeredAnimated.stateDefault = layeredAnimated.stateDefault;
  layeredAnimated.cycleLayers = cycleLayerArray;

  // Add and remove animated sprites
  Object.entries(pixiAnimatedSpritesToDelete).forEach(([pasId, pixiAnimatedSprite]) => {
    pixiContainer.removeChild(pixiAnimatedSprite);
    delete pixiChildren[pasId];
  });
  Object.entries(pixiAnimatedSpritesToAdd).forEach(([pasId, pixiAnimatedSprite]) => {
    pixiContainer.addChild(pixiAnimatedSprite);
    pixiChildren[pasId] = pixiAnimatedSprite;
  });

  readyCycleLayers({ artist, fighterId, layeredAnimated, pixiChildren });
};

export default drawFighters;