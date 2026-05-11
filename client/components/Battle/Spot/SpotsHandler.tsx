import { useEffect, useMemo, useState, useRef } from "react";

import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import { ADVENTURE_KINDS } from "@common/enums";
import "./spot.css";
import pixiBoundsToDOMStyle from "@client/functions/artist/pixiBoundsToDOMStyle";

const SPRITE_CHECK_MAX = 100;
const SPRITE_CHECK_INTERVAL = 10;

export default function SpotsHandler(props: {
  battleState: BattleState
  artistRef: React.RefObject<Artist>
}) {
  const { battleState, artistRef } = props;

  const [state, setState] = useState('clean');
  const [spriteCheck, setSpriteCheck] = useState(0);

  useEffect(() => {
    const initialize = async() => {
      setTimeout(() => {
        artistRef.current.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
        artistRef.current.drawSpots(battleState);
        artistRef.current.drawFighters(battleState.fighters);
      }, 500);
    };

    if (state === 'clean' && artistRef?.current) {
      setState('initialize');
    }
    if (state === 'initialize') {
      setState('initializing');
      initialize();
    }
  }, [state, artistRef?.current]);

  useEffect(() => {
    if (state === 'initializing' && spriteCheck < SPRITE_CHECK_MAX) {
      const artist = artistRef.current;
      if (artist.spotsBounds.length > 0) {
        const spotSelectButtonDiv = document.querySelector('#spot-select-buttons');
        if (!spotSelectButtonDiv) return;
        artist.spotsBounds.forEach((spotBound) => {
          const spotButton = document.createElement('button');
          spotButton.type = 'button';
          spotButton.style = pixiBoundsToDOMStyle(spotBound, artist);
          spotButton.className = 'spot-select-button';
          spotButton.addEventListener('click', () => spotClick(spotBound.id));
          spotSelectButtonDiv.appendChild(spotButton);
        });
        setState('spotSelect');
      }
      else {
        setTimeout(() => (
          setSpriteCheck(spriteCheck+1)
        ), SPRITE_CHECK_INTERVAL);
      };
    }
  }, [state, artistRef?.current?.spotsBounds, spriteCheck]);

  const spotClick = (spotId: string) => {
    console.log(`Spot clicked: ${spotId}`);
  };

  return (
    <section id="spot-select-buttons"></section>
  );
};