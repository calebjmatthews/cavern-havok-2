import { useState, useEffect, useMemo } from "react";
import * as PIXI from 'pixi.js';

import type Artist from "@client/models/artist/artist";
import getSpritePath from "@client/functions/artist/getSpritePath";
import { ICON_SIZE } from "@common/constants";
import pixiSpriteToDataURL from "@client/functions/artist/pixiSpriteToDataUrl";
import getCinderId from "@client/functions/artist/getCinderId";

export default function ExtractedIcon(props: {
  artist: Artist,
  id: string,
  tagId: string,
  options?: { quantity?: number }
}) {
  const { artist, id, tagId, options } = props;

  const [state, setState] = useState('clean');
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state === 'clean') {
      setState('begin');
    }
    else if (state === 'begin') {
      setState('initializing');
      let itemId = id;
      if (id === 'cinders') itemId = getCinderId(options?.quantity);
      const pixiSprite = PIXI.Sprite.from(getSpritePath(itemId, { icon: true }));
      pixiSprite.scale = artist.pixelScale;
      const nextDataUrl = pixiSpriteToDataURL({
        pixiApp: artist.pixiAppRef.current,
        pixiSprite
      });
      if (nextDataUrl) {
        setDataUrl(nextDataUrl);
        setState('done');
      }
    }
  }, [state]);

  const style = useMemo(() => ({
    width: artist.pixelScale * ICON_SIZE,
    height: artist.pixelScale * ICON_SIZE
  }), [artist.pixelScale]);

  return (
    <div id={`extracted-icon-${tagId}`} className='extracted-icon' style={style}>
      {dataUrl && (
        <img src={dataUrl} />
      )}
    </div>
  );
};