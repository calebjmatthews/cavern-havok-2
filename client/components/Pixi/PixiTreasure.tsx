import { useState, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

import type Treasure from "@common/models/treasure";
import Artist from '@client/models/artist/artist';

const PixiTreasure = (props: {
  pixiAppRef: React.RefObject<PIXI.Application<PIXI.Renderer> | null>,
  pixiContainersRef: React.RefObject<{ [id: string]: PIXI.Container<PIXI.ContainerChild> }>
  chests: Treasure[][],
}) => {
  const { pixiAppRef, pixiContainersRef, chests } = props;

  const [state, setState] = useState('clean');

  const artistRef = useRef(new Artist());

  useEffect(() => {
    if (chests.length > 0) {
      setState('beginRender');
    }
  }, [JSON.stringify(chests)]);

  useEffect(() => {
    if (state === 'beginRender') {
      setState('rendering');
    }
    else if (state === 'rendering') {
      artistRef.current.setChests(chests);
      artistRef.current.drawChests({ pixiAppRef, pixiContainersRef });
    }
  }, [state]);

  return null;
};

export default PixiTreasure;