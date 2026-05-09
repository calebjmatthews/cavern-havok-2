import { useEffect, useMemo, useState, useRef } from "react";

import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import "./spot.css";

const SPRITE_CHECK_MAX = 100;
const SPRITE_CHECK_INTERVAL = 10;

export default function SpotsHandler(props: {
  battleState: BattleState
  artistRef: React.RefObject<Artist>
}) {
  const { battleState, artistRef } = props;

  const [state, setState] = useState('clean');

  useEffect(() => {
    const initialize = async() => {
      setTimeout(() => {
        artistRef.current.drawSpots(battleState);
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

  return null;
};