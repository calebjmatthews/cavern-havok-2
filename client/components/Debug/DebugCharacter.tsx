import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import { battleStateEmpty } from "@common/models/battleState";
import Fighter from "@common/models/fighter";
import { characterClasses } from "@common/instances/character_classes";
import { genId } from "@common/functions/utils/random";
import { ADVENTURE_KINDS, CHARACTER_CLASSES, LAYERED_ANIMATED_STATES } from "@common/enums";
import { EQUIPMENTS_ALL_SPRITE, LAYERED_ANIMATED_STATES_DEBUG } from "@common/constants";
import './debug.css';

const LAS = LAYERED_ANIMATED_STATES;
const PIXI_CHECK_MAX_ATTEMPTS = 1000;
const PIXI_CHECK_INTERVAL = 10;

const getBattleStateInitial = (): BattleState => {
  const raiderClass = characterClasses[CHARACTER_CLASSES.RAIDER];
  const javalinClass = characterClasses[CHARACTER_CLASSES.JAVALIN];
  if (!raiderClass || !javalinClass) throw Error('Classes missing in getBattleStateInitial.');

  return {
    ...battleStateEmpty,
    fighters: {
      ['test']: raiderClass.toFighter({
        id: 'test',
        name: 'Test',
        ownedBy: 'testUser',
        controlledBy: 'testUser',
        side: 'A',
        coords: [3, 2]
      }),
      ['foe']: javalinClass.toFighter({
        id: 'foe',
        name: 'Test',
        ownedBy: 'testUser',
        controlledBy: 'testUser',
        side: 'B',
        coords: [6, 2]
      }),
    }
  };
};

export default function DebugCharacter() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

  const [state, setState] = useState('clean');
  const [lasState, setLasState] = useState<string>(LAS.RESTING);
  const [battleState, setBattleState] = useState(getBattleStateInitial());
  const [showColumns, setShowColumns] = useState({ 'state': true, 'events': true, 'equipment': true });

  useEffect(() => {
    const artist = artistRef.current;
    if ((state === 'clean' || state.includes('re-clean')) && artistRef.current.pixiInitialized) {
      setState('ready');
      artist.drawSpots(battleState);
      artistRef.current.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
      // artistRef.current.drawBackground(`white.png`);
      artist.drawFighters(battleState.fighters);
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
      artist: artistRef.current, fighterId: 'test', nextState: tLasState, changeDefault
    });
    setLasState(tLasState);
  };

  const equipClick = (args: { fighter?: Fighter, equipId: string, artist: Artist }) => {
    const { fighter, equipId, artist } = args;
    if (!fighter) return;
    const nextFighter = new Fighter(fighter);
    const equipNotPresent = (fighter.equipped.filter((e) => e.equipmentId === equipId).length === 0);
    if (equipNotPresent) {
      nextFighter.equipped.push({
        id: genId(), equipmentId: equipId, belongsTo: 'test', acquiredAt: Date.now()
      });
    }
    else {
      nextFighter.equipped = fighter.equipped.filter((e) => e.equipmentId !== equipId);
    };

    setBattleState((battleStateLast) => ({
      ...battleStateLast,
      fighters: {
        ...battleStateLast.fighters,
        ['test']: nextFighter
      }
    }));
    artist.drawFighters({ 'test': nextFighter });
  };

  const columnToggleClick = (column: 'state' | 'events' | 'equipment') => {
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
              <button onClick={() => columnToggleClick('events')}>
                {showColumns['events'] && `v`}
                {!showColumns['events'] && `<`}
              </button>
              Events
            </span>
            {showColumns['events'] && ['test0', 'test1', 'test2'].map((tLasState) => (
              <button
                key={tLasState}
                className={tLasState === lasState ? 'is-selected' : ''}
                onClick={() => lasStateClick(tLasState)}
              >
                {tLasState}
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
    </section>
  );
}