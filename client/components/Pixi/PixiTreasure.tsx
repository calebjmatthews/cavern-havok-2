import { useState, useEffect } from 'react';

import Artist from '@client/models/artist/artist';

const PixiTreasure = (props: {
  artistRef: React.RefObject<Artist>
}) => {
  const { artistRef } = props;

  const [state, setState] = useState('clean');

  useEffect(() => {
    console.log(`artistRef.current.chests`, artistRef.current.chests);
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
      artistRef.current.drawChests();
    }
  }, [state, artistRef.current]);

  return null;
};

export default PixiTreasure;