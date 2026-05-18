import * as PIXI from 'pixi.js';

import type BattleState from "@common/models/battleState";
import type Artist from "../artist";
import getSpotLayoutAndPixelScale from "@client/functions/artist/getSpotLayoutAndPixelScale";
import { ARTIST_Z_INDECES } from '@common/enums';

const drawSpots = (args: {
  artist: Artist,
  battleState: BattleState
}) => {
  const { artist } = args;
  const pixiApp = artist.pixiAppRef.current;
  const pixiChildren = artist.pixiChildrenRef.current;
  if (!pixiApp) return;

  const spotLayout = getSpotLayoutAndPixelScale(args);
  artist.setPixelScale(spotLayout.scale);
  if (spotLayout.zoomOut) {
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.className = 'zoom-out';
    artist.windowSize = [artist.windowSize[0] * (1 / 0.9), artist.windowSize[1] * (1 / 0.9)];
    pixiApp.renderer.resize(artist.windowSize[0], artist.windowSize[1]);
    const spotLayoutRepeated = getSpotLayoutAndPixelScale(args);
    spotLayout.spots = spotLayoutRepeated.spots;
  }

  spotLayout.spots.forEach((spot) => {
    const spotId = `spot|${spot.coords[0]}|${spot.coords[1]}`;
    const container = new PIXI.Container();
    container.position = spot.position;
    container.zIndex = ARTIST_Z_INDECES.BATTLE_SPOTS;
    const sprite = PIXI.Sprite.from('dirt.png');
    sprite.scale = spotLayout.scale;
    container.addChild(sprite);
    pixiChildren[spotId] = container;
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