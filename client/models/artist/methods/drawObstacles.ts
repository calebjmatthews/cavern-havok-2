import * as PIXI from 'pixi.js';

import type Artist from "../artist";
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
  const containerMain = pixiChildren['main'];
  if (!containerMain) throw Error('Missing main Pixi container in drawObstacles');

  const obstacleArray = Object.values(obstacles);
  obstacleArray.forEach((obstacle) => {
    const pixiContainer = new PIXI.Container();
    pixiContainer.zIndex = ARTIST_Z_INDECES.BODY;
    pixiContainer.scale = artist.pixelScale;
    const pixiSprite = PIXI.Sprite.from(getSpritePath(obstacle.kind));
    pixiContainer.addChild(pixiSprite);
    const position = getPositionFromSpot({ artist, occupant: obstacle, size: pixiContainer });
    if (position) pixiContainer.position = position;

    pixiChildren[obstacle.id] = pixiContainer;
    
    containerMain.addChild(pixiContainer);
  });
};

export default drawObstacles;