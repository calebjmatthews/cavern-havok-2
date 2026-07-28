import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from '../animation';
import getSpritePath from '../../../functions/artist/getSpritePath';
import animationTypes from '@client/instances/artist/animations';
import getCinderId from '@client/functions/artist/getCinderId';
import random, { genId } from '@common/functions/utils/random';
import { ANIMATION_TYPES } from '@client/enums';

const ITEM_APPEARANCE_DURATION = 250;
const VY_STARTING = -2200;

export interface OpenChestArgs {
  chestId: string,
  artist?: Artist,
};

const openChest = (args: OpenChestArgs) => {
  const { chestId, artist } = args;
  const pixiChildren = artist?.pixiChildrenRef?.current;
  const container = pixiChildren?.[chestId]
  const chestSprite = container?.children?.[0];
  const chest = (artist?.chests ?? []).filter((chest) => chest.chestKindId === chestId)[0];
  if (!artist || !container || !chestSprite || !("texture" in chestSprite) || !chest) return;

  chestSprite.texture = PIXI.Texture.from(getSpritePath(`${chestId}-open`));

  const animationTypeFadeAway = animationTypes[ANIMATION_TYPES.FADE_AWAY];
  const animationTypeCindersTreasureSpill = animationTypes[ANIMATION_TYPES.CINDERS_TREASURE_SPILL];
  const animationTypeCinderTreasure = animationTypes[ANIMATION_TYPES.CINDER_TREASURE];
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
  };

  chest.options.forEach((option, index) => {
    setTimeout(() => {
      let id = option.piece?.equipmentId ?? option.id ?? 'unknown';
      if (option.kind === 'cinders') id = getCinderId(option.quantity);
      const pixiSprite = PIXI.Sprite.from(getSpritePath(id, { icon: true }));
      pixiSprite.scale = artist.pixelScale;
      container.addChild(pixiSprite);
      const pixiSpriteId = genId();
      pixiChildren[pixiSpriteId] = pixiSprite;

      artist.animations.push(new Animation({
        type: ANIMATION_TYPES.CINDER_TREASURE,
        targets: pixiSpriteId,
        ix: (chestSprite.width / 2),
        iy: 1,
        vx: animationTypeCinderTreasure?.getVxStarting?.(artist.pixelScale) ?? 0,
        vy: (VY_STARTING * 0.85 + (random() * VY_STARTING * 0.3)) * artist.pixelScale,
        duration: 2000
      }, animationTypeCinderTreasure));
    }, ((index+1 / chest.options.length) * ITEM_APPEARANCE_DURATION));
  });

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