import * as PIXI from 'pixi.js';

import type BattleState from "@common/models/battleState";
import type Artist from "../artist";
import getSpotLayout from "@client/functions/artist/getSpotLayout";

const drawSpots = (args: {
  artist: Artist,
  battleState: BattleState
}) => {
  const { artist } = args;
  const pixiApp = artist.pixiAppRef.current;
  const pixiContainers = artist.pixiContainersRef.current;
  if (!pixiApp) return;

  const spotLayout = getSpotLayout(args);
  artist.setPixelScale(spotLayout.scale);

  spotLayout.spots.forEach((spot) => {
    const spotId = `spot-${spot.coords[0]}-${spot.coords[1]}`;
    const container = new PIXI.Container();
    container.position = spot.position;
    const sprite = PIXI.Sprite.from('dirt.png');
    sprite.scale = spotLayout.scale;
    container.addChild(sprite);
    pixiContainers[spotId] = container;
    pixiApp.stage.addChild(container);

    artist.spotsBounds.push({
      id: spotId,
      x: (container.x / artist.pixelScale),
      y: (container.y / artist.pixelScale),
      width: (sprite.width / artist.pixelScale),
      height: (sprite.height / artist.pixelScale)
    });
  });
};

export default drawSpots;