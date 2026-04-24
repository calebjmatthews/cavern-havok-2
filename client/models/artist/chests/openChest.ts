import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import getSpritePath from '../../../functions/artist/getSpritePath';
import animationTypes from '@client/instances/artist/animations';
import { genId } from '@common/functions/utils/random';
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

  const animationType = animationTypes[ANIMATION_TYPES.FADE_AWAY];
  if (!animationType) return;
  artist.chests.forEach((chest) => {
    if (chest.chestKindId !== chestId) {
      artist.animations.push({
        id: genId(),
        type: ANIMATION_TYPES.FADE_AWAY,
        startedAt: Date.now(),
        expiresAt: Date.now() + animationType.duration,
        targets: chest.chestKindId
      });
    };
  });
};

export default openChest;