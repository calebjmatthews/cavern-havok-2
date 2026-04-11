import { useState, useEffect } from 'react';
import * as PIXI from 'pixi.js';

import Artist from '@client/models/artist/artist';

const PixiTreasure = (props: {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
  artistRef: React.RefObject<Artist>
}) => {
  const { pixiAppRef, pixiContainersRef, artistRef } = props;

  const [state, setState] = useState('clean');

  useEffect(() => {
    if (artistRef.current.chests.length > 0) {
      setState('beforeRender');
    }
  }, [JSON.stringify(artistRef.current.chests)]);

  useEffect(() => {
    if (state === 'beforeRender') {
      setState('beginRender');
    }
    else if (state === 'beginRender') {
      setState('rendering');
      // Use a method to more directly change the Artist with drawn chest dimension data?
      artistRef.current.drawChests({ pixiAppRef, pixiContainersRef });
    }
  }, [state, artistRef.current]);

  return null;
};

export default PixiTreasure;