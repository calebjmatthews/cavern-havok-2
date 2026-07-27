import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '@client/models/artist/animation';
import { ANIMATION_TYPES } from '@client/enums';

const addSelectBorder = (args: {
  artist: Artist,
  coords: [number, number],
  dim?: boolean,
  selected?: boolean
}) => {
  const { artist, coords, dim, selected } = args;
  const pixiChildren = artist.pixiChildrenRef.current;
  const spotId = `spot|${coords[0]}|${coords[1]}`;
  const spotContainer = pixiChildren[spotId];
  if (!spotContainer) return;

  const spotSelectId = `${spotId}-spot-select`;
  const spriteAlreadyExists = !!pixiChildren[spotSelectId];
  const selectionSprite = pixiChildren[spotSelectId] ?? (
    dim ? PIXI.Sprite.from('terrain-selection-dim.png') : PIXI.Sprite.from('terrain-selection.png')
  );
  if (dim) selectionSprite.alpha = 0;
  selectionSprite.scale = artist.pixelScale;
  pixiChildren[spotSelectId] = selectionSprite;
  spotContainer.addChild(selectionSprite);
  if (!selected) {
    artist.animations.push(new Animation({
      type: ANIMATION_TYPES.PULSE_OPACITY,
      targets: spotSelectId,
      infinite: true,
      delayUntil: (dim ? 400 : 0)
    }));
  }
  else if (spriteAlreadyExists && selected) {
    artist.animations = artist.animations.filter((animation) => animation.targets !== spotSelectId);
    selectionSprite.alpha = 1;
  }

  return selectionSprite;
};

export default addSelectBorder;