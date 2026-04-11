import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import type Artist from '@client/models/artist/artist';
import PixiTreasure from './PixiTreasure';
import { PIXEL_SCALE, SPRITE_SHEET_PATHS } from '@common/constants';
import './pixiCanvas.css';
import animationTypes from '@client/instances/artist/animations';

const PixiCanvas = (props: {
  artistRef: React.RefObject<Artist>
}) => {
  const { artistRef } = props;

  const [state, setState] = useState('clean');  

  useEffect(() => {
    if (state === 'clean') setState('beginLoad');
    if (state === 'beginLoad') {
      setState('loading');

      const canvasAnchor = document.querySelector('#canvasAnchor');
      if (!canvasAnchor) {
        setState('error');
        return;
      }
      
      initPixiApp({ canvasAnchor, artistRef })
      .then(() => setState('ready'));
    }
  }, [state]);

  return (
    <>
      {state === 'ready' && (
        <PixiTreasure artistRef={artistRef} />
      )}
      <div id="canvasAnchor" />
    </>
  );
};

const initPixiApp = async (args: {
  canvasAnchor: Element;
  artistRef: React.RefObject<Artist>
}) => {
  const { canvasAnchor, artistRef } = args;

  const pixiApp = new PIXI.Application();
  await pixiApp.init({
    width: (window.innerWidth / PIXEL_SCALE),
    height: (window.innerHeight / PIXEL_SCALE),
    resolution: PIXEL_SCALE,
    antialias: true,
    backgroundAlpha: 0
  });
  canvasAnchor.appendChild(pixiApp.canvas);
  artistRef.current.pixiAppRef.current = pixiApp;
  const pixiContainers = artistRef.current.pixiContainersRef.current;

  return Promise.all(SPRITE_SHEET_PATHS.map((path) => PIXI.Assets.load(path)))
  .then((spriteSheets) => {
    spriteSheets.forEach((spriteSheet: PIXI.Spritesheet) => {
      Object.values(spriteSheet.textures).forEach((texture) => {
        texture.source.scaleMode = 'nearest';
      });
    });
    pixiApp.ticker.add(() => {
      const now = Date.now();
      const artist = artistRef.current;
      artist.animations.forEach((animation) => {
        const container = pixiContainers[animation.targets];
        const animationType = animationTypes[animation.type];
        if (!container || !animationType) return;
        const elapsed = now - animation.startedAt;
        if (animationType.getPosition) {
          const positionNext = animationType.getPosition(animation.positionInitial, elapsed);
          container.position = positionNext;
        }
      });
    });
  });
};

export default PixiCanvas;