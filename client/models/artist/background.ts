import * as PIXI from 'pixi.js';

import type Artist from "./artist";
import getPosition from '@client/functions/artist/getPosition';
import getSpritePath from '../../functions/artist/getSpritePath';
import scaleToFill from '@client/functions/artist/scaleToFill';

const drawBackground = (artist: Artist, area: string) => {
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;

  const container = new PIXI.Container();
  container.zIndex = 0;

  const sprite = PIXI.Sprite.from(getSpritePath(area));
  sprite.scale = scaleToFill([sprite.width, sprite.height], artist.windowSize);
  container.position = getPosition({ sprite, artist, gravity: 'center' });
  container.addChild(sprite);

  if (pixiContainers.background) {
    // ToDo: Switch existing background to new
  }
  else {
    pixiContainers.background = container;
    pixiApp.stage.addChild(container);
  };
};

export default drawBackground;