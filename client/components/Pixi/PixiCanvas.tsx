import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

import type Treasure from '@common/models/treasure';
import PixiTreasure from './PixiTreasure';
import { PIXEL_SCALE, SPRITE_SHEET_PATHS } from '@common/constants';

const PixiCanvas = (props: {
  chests: Treasure[][]
}) => {
  const { chests } = props;

  const [state, setState] = useState('clean');
  const [chestsFakeState, setChestsFakeState] = useState<Treasure[][]>([]);

  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const pixiContainersRef = useRef<{ [id: string] : PIXI.Container }>({});

  useEffect(() => {
    if (state === 'clean') setState('beginLoad');
    if (state === 'beginLoad') {
      setState('loading');

      const canvasAnchor = document.querySelector('#canvasAnchor');
      if (!canvasAnchor) {
        setState('error');
        return;
      }
      
      initPixiApp({ canvasAnchor, pixiAppRef })
      .then(() => setState('ready'));
    }
    if (state === 'ready') {
      setChestsFakeState(chests);
    }
  }, [state, chests]);

  return (
    <>
      <PixiTreasure pixiAppRef={pixiAppRef} pixiContainersRef={pixiContainersRef} chests={chestsFakeState} />
      <div id="canvasAnchor" />
    </>
  );
};

const initPixiApp = async (args: {
  canvasAnchor: Element;
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>
}) => {
  const { canvasAnchor, pixiAppRef } = args;

  const pixiApp = new PIXI.Application();
  await pixiApp.init({
    width: (window.innerWidth / PIXEL_SCALE),
    height: (window.innerHeight / PIXEL_SCALE),
    resolution: PIXEL_SCALE,
    antialias: true,
    backgroundAlpha: 0
  });
  canvasAnchor.appendChild(pixiApp.canvas);
  pixiAppRef.current = pixiApp;

  return Promise.all(SPRITE_SHEET_PATHS.map((path) => PIXI.Assets.load(path)))
  .then((spriteSheets) => {
    spriteSheets.forEach((spriteSheet: PIXI.Spritesheet) => {
      console.log(`spritesheet`, spriteSheet);
      Object.values(spriteSheet.textures).forEach((texture) => {
        texture.source.scaleMode = 'nearest';
      });
    });
    return true;
  });
};

export default PixiCanvas;