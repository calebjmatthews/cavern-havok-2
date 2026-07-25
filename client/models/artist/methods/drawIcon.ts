import * as PIXI from 'pixi.js';

import type Artist from "../artist"
import getSpritePath from "@client/functions/artist/getSpritePath";
import { ARTIST_Z_INDECES } from '@common/enums';

const drawIcon = (args: {
  artist: Artist,
  id: string,
  left: number,
  top: number
}) => {
  const { artist, id, left, top } = args;
  const pixiTopChildren = artist.pixiTopChildrenRef.current;
  const containerTopMain = pixiTopChildren['main'];
  if (!containerTopMain) throw Error('Missing main Pixi container in drawIcon');

  const container = new PIXI.Container();
  container.zIndex = ARTIST_Z_INDECES.UI;
  
  const sprite = PIXI.Sprite.from(getSpritePath(id, { icon: true }));
  sprite.scale = artist.pixelScale;
  // ToDo: Center based on sprite size
  container.position = { x: left, y: top };
  container.addChild(sprite);

  pixiTopChildren[id] = container;
  containerTopMain.addChild(container);
};

export default drawIcon;