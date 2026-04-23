import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import getSpritePath from '../../../functions/artist/getSpritePath';

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
};

export default openChest;