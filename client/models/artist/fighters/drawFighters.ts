import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import type Fighter from "@common/models/fighter";
import type CycleLayer from '../cycleLayer';
import fighterToLayeredAnimatedAndPixis, { createCycleLayerArray }
  from '@client/functions/artist/fighterToLayeredAnimatedAndPixi';
import getPosition from '@client/functions/artist/getPosition';
import readyCycleLayers from '@client/functions/artist/readyCycleLayers';
import cycleLayersToSpriteMap from '@client/functions/artist/cycleLayersToSpriteMap';
import getPositionFromSpot from '@client/functions/artist/getPositionFromSpot';
import { ARTIST_Z_INDECES } from '@common/enums';

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
    if (center && index > 1) throw Error('Invalid attempt to center more than one fighter.');
    
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
  pixiContainer.zIndex = ARTIST_Z_INDECES.BODY;

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
    const positionFromSpot = getPositionFromSpot({ artist, occupant: fighter, size: pixiContainer });
    if(positionFromSpot) position = positionFromSpot;
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

  // Create arrays of cycle layers to be added and removed
  const cycleLayerArray = createCycleLayerArray(fighter);
  const cycleLayersToRemove: CycleLayer[] = [];
  const cycleLayersToAdd: CycleLayer[] = [];
  const cycleLayerIdsLast: { [clId: string] : boolean } = {};
  layeredAnimated.cycleLayers.forEach((cl) => cycleLayerIdsLast[cl.id] = true);
  const cycleLayersIdsStillPresent: { [clId: string] : boolean } = {};
  cycleLayerArray.forEach((cycleLayer) => {
    if (cycleLayerIdsLast[cycleLayer.id]) {
      cycleLayersIdsStillPresent[cycleLayer.id] = true;
    }
    else {
      cycleLayersToAdd.push(cycleLayer);
    };
  });
  layeredAnimated.cycleLayers.forEach((cycleLayer) => {
    if (!cycleLayersIdsStillPresent[cycleLayer.id]) cycleLayersToRemove.push(cycleLayer);
  });
  if (cycleLayersToAdd.length === 0 && cycleLayersToRemove.length === 0) return;

  // Set new layered animated state to match existing
  layeredAnimated.state = layeredAnimated.state;
  layeredAnimated.stateDefault = layeredAnimated.stateDefault;
  layeredAnimated.cycleLayers = cycleLayerArray;

  // Add and remove animated sprites
  cycleLayersToRemove.forEach((cycleLayer) => {
    const pasId = `${fighter.id}|${cycleLayer.id}`;
    const pixiAnimatedSprite = pixiChildren[pasId];
    if (pixiAnimatedSprite) pixiContainer.removeChild(pixiAnimatedSprite);
    delete pixiChildren[pasId];
  });
  const pixiAnimatedSpritesToAdd = cycleLayersToSpriteMap(
    { cycleLayerArray: cycleLayersToAdd, containerId: fighter.id, state: layeredAnimated.state }
  );
  Object.entries(pixiAnimatedSpritesToAdd).forEach(([pasId, pixiAnimatedSprite]) => {
    pixiContainer.addChild(pixiAnimatedSprite);
    pixiChildren[pasId] = pixiAnimatedSprite;
  });

  readyCycleLayers({ artist, fighterId, layeredAnimated, pixiChildren });
};

export default drawFighters;