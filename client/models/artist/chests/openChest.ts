import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '../animation';
import getSpritePath from '../../../functions/artist/getSpritePath';
import animationTypes from '@client/instances/artist/animations';
import { ANIMATION_TYPES } from '@client/enums';

export interface OpenChestArgs {
  chestId: string,
  artist?: Artist,
};

const openChest = (args: OpenChestArgs) => {
  const { chestId, artist } = args;
  const pixiContainers = artist?.pixiContainersRef?.current;
  const container = pixiContainers?.[chestId]
  const chestSprite = container?.children?.[0];
  if (!artist || !container || !chestSprite || !("texture" in chestSprite)) return;

  chestSprite.texture = PIXI.Texture.from(getSpritePath(`${chestId}-open`));

  const animationTypeFadeAway = animationTypes[ANIMATION_TYPES.FADE_AWAY];
  const animationTypeCindersTreasureSpill = animationTypes[ANIMATION_TYPES.CINDERS_TREASURE_SPILL];
  if (!animationTypeFadeAway || !animationTypeCindersTreasureSpill) return;

  artist.animations.push(new Animation({
    type: ANIMATION_TYPES.CINDERS_TREASURE_SPILL,
    targets: chestId,
    ix: (container.x + (chestSprite.width / 2)),
    iy: (container.y + (chestSprite.height / 3)),
    particleCountFinal: 25
  }, animationTypeCindersTreasureSpill));

  artist.chests.forEach((chest) => {
    if (chest.chestKindId !== chestId) {
      artist.animations.push(new Animation({
        type: ANIMATION_TYPES.FADE_AWAY,
        targets: chest.chestKindId
      }, animationTypeFadeAway));
    };
  });
};

export default openChest;