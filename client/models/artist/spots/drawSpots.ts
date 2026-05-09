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
  console.log(`spotLayout`, spotLayout);
  artist.setPixelScale(spotLayout.scale);

  spotLayout.spots.forEach((spot) => {
    const container = new PIXI.Container();
    container.position = spot.position;
    const sprite = PIXI.Sprite.from('dirt.png');
    container.addChild(sprite);
    pixiContainers[`spot-${spot.coords[0]}-${spot.coords[1]}`] = container;
    pixiApp.stage.addChild(container);
  });
};

export default drawSpots;