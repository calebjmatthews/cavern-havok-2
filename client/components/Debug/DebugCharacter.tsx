import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type { PixiEvent } from "@common/models/pixiEvent";
import BarsGrid from "../Battle/BarsGrid/BarsGrid";
import Fighter from "@common/models/fighter";
import performEventSet from "@client/functions/artist/performEventSet";
import getBattleStateInitial from "./getBattleStateInitial";
import testEventSets from "./testEventSets";
import { genId } from "@common/functions/utils/random";
import { ADVENTURE_KINDS, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { EQUIPMENTS_ALL_SPRITE, LAYERED_ANIMATED_STATES_DEBUG } from "@common/constants";
import './debug.css';

const LAS = LAYERED_ANIMATED_STATES;
const PIXI_CHECK_MAX_ATTEMPTS = 1000;
const PIXI_CHECK_INTERVAL = 10;

export default function DebugCharacter() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

  const [state, setState] = useState('clean');
  const [lasState, setLasState] = useState<string>(LAS.RESTING);
  const [battleState, setBattleState] = useState(getBattleStateInitial());
  const [showColumns, setShowColumns] = useState({ 'state': true, 'eventSet': true, 'equipment': true });
  const [pixiEventsUI, setPixiEventsUI] = useState<PixiEvent[]>([]);

  useEffect(() => {
    const artist = artistRef.current;
    if ((state === 'clean' || state.includes('re-clean')) && artistRef.current.pixiInitialized) {
      setState('ready');
    }
    else if (state === 'ready') {
      artist.drawSpots(battleState);
      artistRef.current.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
      // artistRef.current.drawBackground(`white.png`);
      artist.drawFighters(battleState.fighters);
      artist.drawObstacles(battleState.obstacles);
    }
    else if (state === 'clean' || state.includes('re-clean')) {
      let attempts = parseInt(state.replace('re-clean', ''));
      if (isNaN(attempts)) attempts = 0;
      if (attempts < PIXI_CHECK_MAX_ATTEMPTS) {
        setTimeout(() => setState(`re-clean${attempts + 1}`), PIXI_CHECK_INTERVAL);
      };
    }
  }, [state]);

  const lasStateClick = (tLasState: string) => {
    const changeDefault = (
      tLasState === LAS.CASTING || tLasState === LAS.CLENCHING || tLasState === LAS.CRITICAL
      || tLasState === LAS.DOWN || tLasState === LAS.RESTING || tLasState === LAS.WALKING
    );
    artistRef.current.changeFighterState({
      artist: artistRef.current,
      fighterId: 'test',
      nextState: tLasState,
      nextStateDefault: changeDefault ? tLasState : undefined
    });
    setLasState(tLasState);
  };

  const equipClick = (args: { fighter?: Fighter, equipId: string, artist: Artist }) => {
    const { fighter, equipId, artist } = args;
    if (!fighter) return;
    const nextFighter = new Fighter(fighter);
    const equipNotPresent = (fighter.equipped.filter((e) => e.equipmentId === equipId).length === 0);
    const pieceId = genId();
    if (equipNotPresent) {
      nextFighter.equipped.push({
        id: pieceId, equipmentId: equipId, belongsTo: 'test', acquiredAt: Date.now()
      });
    }
    else {
      nextFighter.equipped = fighter.equipped.filter((e) => e.equipmentId !== equipId);
    };

    artist.equipToFront({ fighterId: fighter.id, pieceId });
    setBattleState((battleStateLast) => ({
      ...battleStateLast,
      fighters: {
        ...battleStateLast.fighters,
        ['test']: nextFighter
      }
    }));
    artist.drawFighters({ 'test': nextFighter });
  };

  const eventSetClick = (args: {
    battleState: BattleState,
    artist: Artist,
    eventSetName: string
  }) => {
    const { battleState, artist, eventSetName } = args;

    const eventSet = testEventSets[eventSetName];
    if (eventSet) {
      eventSet.forEach((event) => event.id = genId());
      if (eventSetName === 'Ready Hatchet' && eventSet[0] && "pieceId" in eventSet[0].args) {
        eventSet[0].args.pieceId = (battleState.fighters['test']?.equipped ?? [])
        .filter((piece) => piece.equipmentId === EQUIPMENTS.HATCHET)[0]?.id ?? '';
      };
      if (eventSetName === 'Ready Swallow' && eventSet[0] && "pieceId" in eventSet[0].args) {
        eventSet[0].args.pieceId = (battleState.fighters['test']?.equipped ?? [])
        .filter((piece) => piece.equipmentId === EQUIPMENTS.SWALLOW)[0]?.id ?? '';
      };
      const occupants: { [occupantId: string]: Fighter | Obstacle | Creation} = {};
      Object.values(battleState.fighters).forEach((f) => occupants[f.id] = f);
      Object.values(battleState.obstacles).forEach((o) => occupants[o.id] = o);
      performEventSet({ artist, eventSet, occupants });
      setPixiEventsUI(eventSet.filter((pixiEvent) => (
        pixiEvent.functionName === 'changeStat' || pixiEvent.functionName === 'moveSpot'
      )));
    }
  };

  const columnToggleClick = (column: 'state' | 'eventSet' | 'equipment') => {
    setShowColumns((showColumnsLast) => ({ ...showColumnsLast, [column] : !showColumnsLast[column] }));
  };

  if (state !== 'ready') return null;

  return (
    <section id="debug-character">
      <section className="debug-buttons">
        <section className="debug-buttons-column">
          <div>
            <span className="text-white">
              <button onClick={() => columnToggleClick('state')}>
                {showColumns['state'] && `v`}
                {!showColumns['state'] && `<`}
              </button>
              State
            </span>
            {showColumns['state'] && LAYERED_ANIMATED_STATES_DEBUG.map((tLasState) => (
              <button
                key={tLasState}
                className={tLasState === lasState ? 'is-selected' : ''}
                onClick={() => lasStateClick(tLasState)}
              >
                {tLasState}
              </button>
            ))}
          </div>
          <div>
            <span className="text-white">
              <button onClick={() => columnToggleClick('eventSet')}>
                {showColumns['eventSet'] && `v`}
                {!showColumns['eventSet'] && `<`}
              </button>
              Event Set
            </span>
            {showColumns['eventSet'] && Object.keys(testEventSets).map((eventSetName) => (
              <button
                key={eventSetName}
                onClick={() => eventSetClick({ battleState, artist: artistRef.current, eventSetName })}
              >
                {eventSetName}
              </button>
            ))}
          </div>
        </section>
        <section className="debug-buttons-column">
          <div>
            <span className="text-white">
              <button onClick={() => columnToggleClick('equipment')}>
                {showColumns['equipment'] && `v`}
                {!showColumns['equipment'] && `<`}
              </button>
              Equipment
            </span>
            {showColumns['equipment'] && EQUIPMENTS_ALL_SPRITE.map((equipId) => (
              <button
                key={equipId}
                onClick={() => equipClick({
                  fighter: battleState.fighters['test'],
                  equipId,
                  artist: artistRef.current
                })}
              >
                {equipId}
              </button>
            ))}
          </div>
        </section>
      </section>
      <BarsGrid
        battleState={battleState}
        battleStateFuture={null}
        artistRef={artistRef}
        pixiEventsUI={pixiEventsUI}
      />
    </section>
  );
}