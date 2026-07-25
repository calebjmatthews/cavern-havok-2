import { useState, useEffect, useMemo } from "react";

import type Artist from "@client/models/artist/artist";
import { ICON_SIZE } from "@common/constants";

export default function PixiIcon(props: {
  artistRef: React.RefObject<Artist>,
  id: string,
  tagId: string
}) {
  const { artistRef, id, tagId } = props;

  const [state, setState] = useState('clean');

  useEffect(() => {
    if (state === 'clean') {
      setState('begin');
    }
    else if (state === 'begin') {
      setState('initializing');
      const artist = artistRef.current;
      const iconDiv = document.getElementById(`pixi-icon-${tagId}`);
      if (iconDiv) {
        const rect = iconDiv.getBoundingClientRect();
        const left = Math.round(rect.left / (artist.zoomedOut ? 0.9 : 1));
        const top = Math.round(rect.top / (artist.zoomedOut ? 0.9 : 1));
        artist.drawIcon({ id, left, top });
        setState('done');
      };
    };

    return () => onClose(state);
  }, [state]);

  const onClose = (state: string) => {
    if (state === 'done') {
      console.log(`Perform artist.removeIcon()`);
    };
  };

  const style = useMemo(() => ({
    width: artistRef.current.pixelScale * ICON_SIZE,
    height: artistRef.current.pixelScale * ICON_SIZE
  }), [artistRef.current.pixelScale]);

  return (
    <div id={`pixi-icon-${tagId}`} style={style} />
  );
};