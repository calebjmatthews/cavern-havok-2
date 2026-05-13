import * as PIXI from 'pixi.js';

import type Artist from "../artist";

const addSelectBorder = (artist: Artist, coords: [number, number]) => {
  const pixiContainers = artist.pixiContainersRef.current;
  const spotId = `spot|${coords[0]}|${coords[1]}`;
  const spotContainer = pixiContainers[spotId];
  if (!spotContainer) return;

  const selectionSprite = PIXI.Sprite.from('terrain-selection.png');
  selectionSprite.scale = artist.pixelScale;
  pixiContainers[`${spotId}-select`] = selectionSprite;
  spotContainer.addChild(selectionSprite);
  return selectionSprite;
};

export default addSelectBorder;