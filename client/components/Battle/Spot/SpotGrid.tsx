import { useEffect, useMemo, useState, useRef } from "react";

import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import type ActionResolved from "@common/models/actionResolved";
import type { Modal } from "@client/models/modal";
import pixiBoundsToDOMStyle from "@client/functions/artist/pixiBoundsToDOMStyle";
import { ADVENTURE_KINDS } from "@common/enums";
import "./spot.css";
import { genId } from "@common/functions/utils/random";
import { MODAL_KINDS } from "@client/enums";

const SPRITE_CHECK_MAX = 100;
const SPRITE_CHECK_INTERVAL = 10;

export default function SpotGrid(props: {
  battleState: BattleState,
  battleStateFuture: BattleState | null,
  actionsResolvedFuture: ActionResolved[] | null,
  targetOptions: [number, number][],
  targetSelected: [number, number] | null,
  setTargetSelected: (nextTargetSelected: [number, number]) => void,
  targetsStaticallySelected: [number, number][],
  setModalToAdd: (modal: Modal) => void,
  artistRef: React.RefObject<Artist>
}) {
  const { battleState, battleStateFuture, setModalToAdd, artistRef } = props;

  const [state, setState] = useState('clean');
  const [spriteCheck, setSpriteCheck] = useState(0);
  const [spotClicked, setSpotClicked] = useState<string | null>(null);

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
          spotButton.id = spotBound.id
          spotButton.type = 'button';
          spotButton.style = pixiBoundsToDOMStyle(spotBound, artist);
          spotButton.className = 'spot-select-button';
          spotButton.addEventListener('click', () => spotClick(spotBound.id));

          const spotIdSplit = spotBound.id.split('|').map((n) => parseInt(n ?? ''));
          const coords = [spotIdSplit[1], spotIdSplit[2]];
          const fighter = Object.values(battleState.fighters ?? {}).filter((fighter) => (
            fighter.coords[0] === coords[0] && fighter.coords[1] === coords[1]
          ))?.[0];
          if (!fighter) spotButton.disabled = true;
          
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

  useEffect(() => {
    const spotId = spotClicked;
    if (!spotId) return;

    setSpotClicked(null);
    const spotIdSplit = spotId.split('|').map((n) => parseInt(n ?? ''));
    const coords = [spotIdSplit[1], spotIdSplit[2]];
    const occupant = Object.values(battleState.fighters ?? {}).filter((fighter) => (
      fighter.coords[0] === coords[0] && fighter.coords[1] === coords[1]
    ))?.[0];

    if (occupant) {
      setModalToAdd({
        id: genId(),
        kind: MODAL_KINDS.OCCUPANT_DETAIL,
        battleState,
        battleStateFuture: battleStateFuture ?? undefined,
        occupant
      });
    };
  }, [spotClicked, battleState]);

  const spotClick = (spotId: string) => {
    setSpotClicked(spotId);
  };

  return (
    <section id="spot-select-buttons"></section>
  );
};