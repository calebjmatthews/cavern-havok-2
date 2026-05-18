import * as PIXI from 'pixi.js';

import type Artist from "./artist";
import type Obstacle from '@common/models/obstacle';
import getSpritePath from '@client/functions/artist/getSpritePath';
import getPositionFromSpot from '@client/functions/artist/getPositionFromSpot';
import { ARTIST_Z_INDECES } from '@common/enums';

const drawObstacles = (args: {
  artist: Artist,
  obstacles: { [id: string]: Obstacle }
}) => {
  const { artist, obstacles } = args;
  const pixiApp = artist.pixiAppRef.current;
  const pixiChildren = artist.pixiChildrenRef.current;
  if (!pixiApp) return;

  const obstacleArray = Object.values(obstacles);
  obstacleArray.forEach((obstacle) => {
    const pixiSprite = PIXI.Sprite.from(getSpritePath(obstacle.kind));
    pixiSprite.zIndex = ARTIST_Z_INDECES.BODY;
    pixiSprite.scale = artist.pixelScale;
    const position = getPositionFromSpot({ artist, occupant: obstacle, size: pixiSprite });
    if (position) pixiSprite.position = position;

    pixiChildren[obstacle.id] = pixiSprite;
    pixiApp.stage.addChild(pixiSprite);
  });
};

export default drawObstacles;