import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '@client/models/artist/animation';
import { ANIMATION_TYPES } from '@client/enums';

const addSelectBorder = (args: { artist: Artist, coords: [number, number], dim?: boolean }) => {
  const { artist, coords, dim } = args;
  const pixiChildren = artist.pixiChildrenRef.current;
  const spotId = `spot|${coords[0]}|${coords[1]}`;
  const spotContainer = pixiChildren[spotId];
  if (!spotContainer) return;

  const spotSelectId = `${spotId}-spot-select`;
  const selectionSprite = (
    dim ? PIXI.Sprite.from('terrain-selection-dim.png') : PIXI.Sprite.from('terrain-selection.png')
  );
  if (dim) selectionSprite.alpha = 0;
  selectionSprite.scale = artist.pixelScale;
  pixiChildren[spotSelectId] = selectionSprite;
  spotContainer.addChild(selectionSprite);
  setTimeout(() => {
    artist.animations.push(new Animation({
      type: ANIMATION_TYPES.PULSE_OPACITY,
      targets: spotSelectId,
      infinite: true
    }));
  }, (dim ? 400 : 0));

  return selectionSprite;
};

export default addSelectBorder;