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
  const chest = (artist?.chests ?? []).filter((chest) => chest.chestKindId === chestId)[0];
  if (!artist || !container || !chestSprite || !("texture" in chestSprite) || !chest) return;

  chestSprite.texture = PIXI.Texture.from(getSpritePath(`${chestId}-open`));

  const animationTypeFadeAway = animationTypes[ANIMATION_TYPES.FADE_AWAY];
  const animationTypeCindersTreasureSpill = animationTypes[ANIMATION_TYPES.CINDERS_TREASURE_SPILL];
  if (!animationTypeFadeAway || !animationTypeCindersTreasureSpill) return;

  const particleCountFinal = chest.guaranteed
    .filter((treasure) => treasure.kind === 'cinders')[0]?.quantity;
  if ((particleCountFinal ?? 0) > 0) {
    artist.animations.push(new Animation({
      type: ANIMATION_TYPES.CINDERS_TREASURE_SPILL,
      targets: chestId,
      ix: (container.x + (chestSprite.width / 2)),
      iy: (container.y + (chestSprite.height / 3)),
      particleCountFinal
    }, animationTypeCindersTreasureSpill));
  }

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