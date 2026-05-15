import * as PIXI from 'pixi.js';

import type Artist from "@client/models/artist/artist";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";

const getPositionFromSpot = (args: {
  artist: Artist,
  occupant: Fighter | Obstacle,
  pixiContainer: PIXI.ContainerChild
}) => {
  const { artist, occupant, pixiContainer } = args;
  const pixiChildren = artist.pixiChildrenRef.current;
  const spot = pixiChildren[`spot|${occupant.coords[0]}|${occupant.coords[1]}`];
  if (!spot) return;

  const spotMiddleX = spot.x + (spot.width / 2);
  const bottomPadding = (2 * artist.pixelScale);
  const spotBottomY = (spot.y + spot.height) - bottomPadding;

  return {
    x: Math.round(spotMiddleX - (pixiContainer.width / 2)),
    y: Math.round(spotBottomY - (pixiContainer.height))
  };
};

export default getPositionFromSpot;