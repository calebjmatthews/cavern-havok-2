import { useState, useEffect, useMemo } from "react";
import * as PIXI from 'pixi.js';

import type Artist from "@client/models/artist/artist";
import getSpritePath from "@client/functions/artist/getSpritePath";
import { ICON_SIZE } from "@common/constants";
import pixiSpriteToDataURL from "@client/functions/artist/pixiSpriteToDataUrl";

export default function ExtractedIcon(props: {
  artistRef: React.RefObject<Artist>,
  id: string,
  tagId: string
}) {
  const { artistRef, id, tagId } = props;

  const [state, setState] = useState('clean');
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state === 'clean') {
      setState('begin');
    }
    else if (state === 'begin') {
      setState('initializing');
      const pixiSprite = PIXI.Sprite.from(getSpritePath(id, { icon: true }));
      pixiSprite.scale = artistRef.current.pixelScale;
      const nextDataUrl = pixiSpriteToDataURL({
        pixiApp: artistRef.current.pixiAppRef.current,
        pixiSprite
      });
      if (nextDataUrl) {
        setDataUrl(nextDataUrl);
        setState('done');
      }
    }
  }, [state]);

  const style = useMemo(() => ({
    width: artistRef.current.pixelScale * ICON_SIZE,
    height: artistRef.current.pixelScale * ICON_SIZE
  }), [artistRef.current.pixelScale]);

  return (
    <div id={`extracted-icon-${tagId}`} className='extracted-icon' style={style}>
      {dataUrl && (
        <img src={dataUrl} />
      )}
    </div>
  );
};