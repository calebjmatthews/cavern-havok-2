import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '@client/models/artist/animation';
import { ANIMATION_TYPES } from '@client/enums';

const addSelectBorder = (artist: Artist, coords: [number, number]) => {
  const pixiContainers = artist.pixiContainersRef.current;
  const spotId = `spot|${coords[0]}|${coords[1]}`;
  const spotContainer = pixiContainers[spotId];
  if (!spotContainer) return;

  const spotSelectId = `${spotId}-select`;
  const selectionSprite = PIXI.Sprite.from('terrain-selection.png');
  selectionSprite.scale = artist.pixelScale;
  pixiContainers[spotSelectId] = selectionSprite;
  spotContainer.addChild(selectionSprite);
  artist.animations.push(new Animation({
    type: ANIMATION_TYPES.PULSE_OPACITY,
    targets: spotSelectId,
    infinite: true
  }));
  return selectionSprite;
};

export default addSelectBorder;