import { useEffect, useState } from "react";

import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import type ActionResolved from "@common/models/actionResolved";
import type { Modal } from "@client/models/modal";
import upsertSpotButtons from "./upsertSpotButtons";
import { genId } from "@common/functions/utils/random";
import { ADVENTURE_KINDS } from "@common/enums";
import { MODAL_KINDS } from "@client/enums";
import "./spot.css";

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
  const {
    battleState, battleStateFuture, targetOptions, setTargetSelected, setModalToAdd, artistRef
  } = props;

  const [state, setState] = useState('clean');
  const [spriteCheck, setSpriteCheck] = useState(0);
  const [spotClicked, setSpotClicked] = useState<string | null>(null);
  const [roundCurrent, setRoundCurrent] = useState(-1);

  useEffect(() => {
    const artist = artistRef.current;
    
    const initialize = async() => {
      artist.drawSpots(battleState);
      artist.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
      artist.drawFighters(battleState.fighters);
      artist.drawObstacles(battleState.obstacles);
      setRoundCurrent(battleState.round);
    };

    if (state === 'clean' && artistRef?.current) {
      setState('initialize');
    }
    else if (state === 'initialize') {
      setState('initializing');
      initialize();
    }
    else if (state === 'ready') {
      artist.drawFighters(battleState.fighters);
      if (roundCurrent !== battleState.round) {
        setRoundCurrent(battleState.round);
        upsertSpotButtons({ battleState, artist, spotClick });
      }
    };
  }, [state, artistRef?.current, JSON.stringify(battleState)]);

  useEffect(() => {
    if (state === 'initializing' && spriteCheck < SPRITE_CHECK_MAX) {
      const artist = artistRef.current;
      if (artist.spotsBounds.length > 0) {
        upsertSpotButtons({ battleState, artist, spotClick });
        setState('ready');
      }
      else {
        setTimeout(() => (
          setSpriteCheck(spriteCheck+1)
        ), SPRITE_CHECK_INTERVAL);
      };
    }
  }, [state, artistRef?.current?.spotsBounds, spriteCheck]);

  useEffect(() => {
    targetOptions.forEach((coords) => {
      const spotId = `spot|${coords[0]}|${coords[1]}`;
      const spotButton = document.getElementById(spotId);
      if (spotButton && 'disabled' in spotButton) spotButton.disabled = false;
      artistRef.current.addSelectBorder(coords);
    });
    if (targetOptions.length === 0) {
      disableUnoccupied(artistRef.current);
      artistRef.current.removeSelectBorders();
    }
  }, [targetOptions, artistRef.current]);

  useEffect(() => {
    const spotId = spotClicked;
    if (!spotId) return;

    setSpotClicked(null);
    const spotIdSplit = spotId.split('|').map((n) => parseInt(n ?? ''));
    const coords: [number, number] = [(spotIdSplit[1] ?? -1), (spotIdSplit[2] ?? -1)];
    const occupant = Object.values(battleState.fighters ?? {}).filter((fighter) => (
      fighter.coords[0] === coords[0] && fighter.coords[1] === coords[1]
    ))?.[0];

    const canTarget = targetOptions.filter((to) => coords[0] === to[0] && coords[1] === to[1]).length > 0;
    if (canTarget) {
      setTargetSelected(coords);
      artistRef.current.removeSelectBorders();
    }
    else if (occupant) {
      setModalToAdd({
        id: genId(),
        kind: MODAL_KINDS.OCCUPANT_DETAIL,
        battleState,
        battleStateFuture: battleStateFuture ?? undefined,
        occupant
      });
    };
  }, [spotClicked, battleState, artistRef.current]);

  const disableUnoccupied = (artist: Artist) => {
    artist.spotsBounds.forEach((spotBound) => {
      const spotButton = document.getElementById(spotBound.id);

      const spotIdSplit = spotBound.id.split('|').map((n) => parseInt(n ?? ''));
      const coords = [spotIdSplit[1], spotIdSplit[2]];
      const fighter = Object.values(battleState.fighters ?? {}).filter((fighter) => (
        fighter.coords[0] === coords[0] && fighter.coords[1] === coords[1]
      ))?.[0];
      if (!fighter && spotButton && 'disabled' in spotButton) spotButton.disabled = true;
    });
  };

  const spotClick = (spotId: string) => {
    setSpotClicked(spotId);
  };

  return (
    <section id="spot-select-buttons"></section>
  );
};