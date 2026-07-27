import { useEffect, useMemo, useState } from "react";

import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import type Equipment from "@common/models/equipment";
import type { Modal } from "@client/models/modal";
import upsertSpotButtons from "./upsertSpotButtons";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import { genId } from "@common/functions/utils/random";
import { battleStateEmpty } from "@common/models/battleState";
import { ADVENTURE_KINDS } from "@common/enums";
import { BATTLE_UI_STATES, MODAL_KINDS } from "@client/enums";
import "./spot.css";

const BUS = BATTLE_UI_STATES;

const SPRITE_CHECK_MAX = 100;
const SPRITE_CHECK_INTERVAL = 10;

export default function SpotGrid(props: {
  uiState: BATTLE_UI_STATES,
  toCommand: string | null,
  battleState: BattleState,
  battleStateFuture: BattleState | null,
  equip: Equipment | undefined,
  targetSelected: [number, number] | null,
  setTargetSelected: (nextTargetSelected: [number, number]) => void,
  setModalToAdd: (modal: Modal) => void,
  artistRef: React.RefObject<Artist>
}) {
  const {
    uiState, toCommand, battleState, battleStateFuture, equip, targetSelected, setTargetSelected, setModalToAdd, artistRef
  } = props;

  const [state, setState] = useState('clean');
  const [spriteCheck, setSpriteCheck] = useState(0);
  const [targetingChanged, setTargetingChanged] = useState(false);
  const [spotClicked, setSpotClicked] = useState<string | null>(null);
  const [roundCurrent, setRoundCurrent] = useState(-1);

  const targetOptionsFighterPlacement = useMemo(() => {
    if (uiState === BUS.INTRO_TEXT_READING) return [];
    let targetOptionsFighterPlacement: [number, number][] = [];
    const fighter = battleState?.fighters?.[toCommand || ''];
    if (fighter) {
      const toCommandNeedsPlacement = fighter.coords[1] === -1;
      if (toCommandNeedsPlacement) {
        targetOptionsFighterPlacement = getCoordsOnSide(
          { battleState, side: fighter.side, onlyOpenSpaces: true }
        );
        return targetOptionsFighterPlacement;
      }
    }
    return targetOptionsFighterPlacement;
  }, [JSON.stringify(battleState), toCommand, uiState]);
  const targetOptionsEquipment = useMemo(() => (
    equip?.getAllowedTargets?.({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) ?? []
  ), [equip]);
  const targetsStaticallySelected = useMemo(() => (
    equip?.getStaticTargets?.({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) ?? []
  ), [equip]);
  const areaStaticallySelected = useMemo(() => (
    equip?.getStaticArea?.({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) ?? []
  ), [equip]);
  const targetOptions = useMemo(() => {
    if (targetOptionsFighterPlacement.length > 0) return targetOptionsFighterPlacement;
    if (targetOptionsEquipment && uiState === BUS.CONFIRM) return targetOptionsEquipment;
    return [];
  }, [targetOptionsFighterPlacement, targetOptionsEquipment, uiState]);
  const targetOptionsEmphasized = useMemo(() => (
    equip?.getEmphasizedTargets?.({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) ?? []
  ), [equip]);

  useEffect(() => {
    const artist = artistRef.current;
    
    const initialize = async() => {
      artist.drawSpots(battleState);
      artist.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
      artist.drawObstacles(battleState.obstacles);
      artist.drawFighters(battleState.fighters);
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
      setTargetingChanged(true);
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
    setTargetingChanged(true);
  }, [targetOptions, targetOptionsEmphasized, targetSelected])

  useEffect(() => {
    if (state === 'ready' && targetingChanged) {
      setTargetingChanged(false);
      setState('setTargetOptions');
    }
    else if (state === 'setTargetOptions') {
      setState('settingTargetOptions');

      if (targetsStaticallySelected.length === 0) {
        const anyEmphasized = targetOptionsEmphasized.length > 0;
        const emphasized = targetOptionsEmphasized.map((c) => (`spot|${c[0]}|${c[1]}`));
        targetOptions.forEach((coords) => {
          const spotId = `spot|${coords[0]}|${coords[1]}`;
          const spotButton = document.getElementById(spotId);
          if (spotButton && 'disabled' in spotButton) spotButton.disabled = false;
          const dim = anyEmphasized && !emphasized.includes(spotId);
          const selected = coords[0] === targetSelected?.[0] && coords[1] === targetSelected?.[1];
          artistRef.current.addSelectBorder({ coords, dim, selected });
        });

        if (targetOptions.length === 0) {
          disableUnoccupied(artistRef.current);
          artistRef.current.removeSelectBorders();
        };
      }

      else {
        const targetIds = targetsStaticallySelected.map((t) => `spot|${t[0]}|${t[1]}`);
        targetsStaticallySelected.forEach((coords) => {
          const spotId = `spot|${coords[0]}|${coords[1]}`;
          const spotButton = document.getElementById(spotId);
          if (spotButton && 'disabled' in spotButton) spotButton.disabled = false;
          artistRef.current.addSelectBorder({ coords, selected: true });
        });
        areaStaticallySelected.forEach((coords) => {
          const spotId = `spot|${coords[0]}|${coords[1]}`;
          if (targetIds.includes(spotId)) return;
          artistRef.current.addSelectBorder({ coords, dim: true, selected: true });
        });
        
      };

      setState('ready');
    };
    
  }, [state, targetOptions, targetOptionsEmphasized, targetSelected, artistRef.current]);

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

  useEffect(() => {
    if (!targetSelected) artistRef.current.occupantsUnhighlightAny();
    const selectedSpotId = targetSelected ? `spot|${targetSelected[0]}|${targetSelected[1]}` : null;
    [
      ...Object.values(battleState.fighters),
      ...Object.values(battleState.obstacles),
      ...Object.values(battleState.creations),
    ].forEach((occupant) => {
      const spotId = `spot|${occupant.coords[0]}|${occupant.coords[1]}`;
      if (selectedSpotId === spotId) artistRef.current.occupantHighlight(occupant.id);
    })
  }, [targetSelected, artistRef.current]);

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