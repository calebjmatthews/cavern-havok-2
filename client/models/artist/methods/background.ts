import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import getPosition from '@client/functions/artist/getPosition';
import getSpritePath from '../../../functions/artist/getSpritePath';
import scaleToFill from '@client/functions/artist/scaleToFill';
import { ARTIST_Z_INDECES } from '@common/enums';

const drawBackground = (artist: Artist, area: string) => {
  const pixiApp = artist.pixiAppRef.current;
  const pixiChildren = artist.pixiChildrenRef.current;
  if (!pixiApp) return;

  const container = new PIXI.Container();
  container.zIndex = ARTIST_Z_INDECES.BACKGROUND;

  const sprite = PIXI.Sprite.from(getSpritePath(area));
  sprite.scale = scaleToFill([sprite.width, sprite.height], artist.windowSize);
  container.position = getPosition({ sprite, artist, gravity: 'center' });
  container.addChild(sprite);

  if (pixiChildren.background) {
    // ToDo: Switch existing background to new
  }
  else {
    pixiChildren.background = container;
    pixiApp.stage.addChild(container);
  };
};

export default drawBackground;