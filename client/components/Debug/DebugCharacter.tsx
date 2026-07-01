import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import type { PixiEvent } from "@common/models/pixiEvent";
import BarsGrid from "../Battle/BarsGrid/BarsGrid";
import Fighter from "@common/models/fighter";
import performEventSet from "@client/functions/artist/performEventSet";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import { characterClasses } from "@common/instances/character_classes";
import { genId } from "@common/functions/utils/random";
import { battleStateEmpty } from "@common/models/battleState";
import { ADVENTURE_KINDS, CHARACTER_CLASSES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { ANIMATION_SPEED, EQUIPMENTS_ALL_SPRITE, LAYERED_ANIMATED_STATES_DEBUG } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";
import './debug.css';

const LAS = LAYERED_ANIMATED_STATES;
const PIXI_CHECK_MAX_ATTEMPTS = 1000;
const PIXI_CHECK_INTERVAL = 10;

const getBattleStateInitial = (): BattleState => {
  const raiderClass = characterClasses[CHARACTER_CLASSES.RAIDER];
  const javalinClass = characterClasses[CHARACTER_CLASSES.JAVALIN];
  const boulderMoleClass = characterClasses[CHARACTER_CLASSES.BOULDER_MOLE];
  if (!raiderClass || !javalinClass || !boulderMoleClass) {
    throw Error('Classes missing in getBattleStateInitial.');
  };

  return {
    ...battleStateEmpty,
    fighters: {
      ['test']: javalinClass.toFighter({
        id: 'test',
        name: 'Test',
        ownedBy: 'testUser',
        controlledBy: 'testUser',
        side: 'A',
        coords: [3, 2]
      }),
      ['foe']: boulderMoleClass.toFighter({
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

const testEventSets: { [id: string]: PixiEvent[] } =  {
  ['Ready Hatchet']: [{
    id: genId(),
    functionName: 'equipToFront',
    delay: 0,
    args: { targetsId: 'test', pieceId: '' }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.CLENCHING, fighterStateDefault: LAS.CLENCHING }
  }],
  ['Attack with swing']: [{
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.SWINGING, fighterStateDefault: LAS.RESTING }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      spriteNames: ['swing_swish.png'],
      offsets: [{ x: -6, y: -5 }],
      opacities: [0.8],
      durationOverall: 300,
      animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: (30 / ANIMATION_SPEED),
    args: { targetsId: 'foe', fighterState: LAS.DAMAGED, fighterStateDefault: LAS.CRITICAL }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (30 / ANIMATION_SPEED),
    args: { targetsId: 'foe', animationTypeId: ANIMATION_TYPES.WOBBLE }
  }, {
    id: genId(),
    functionName: 'createParticleContainer',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      ...getHealthNumberProps(3)
    }
  }, {
    id: genId(),
    functionName: 'changeStat',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      statName: 'health',
      quantity: -3
    }
  }],
  ['Ready Swallow']: [{
    id: genId(),
    functionName: 'equipToFront',
    delay: 0,
    args: { targetsId: 'test', pieceId: '' }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.CLENCHING, fighterStateDefault: LAS.CLENCHING }
  }],
  ['Attack with throw']: [{
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.THROWING, fighterStateDefault: LAS.RESTING }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (40 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      spriteNames: ['throw_swish.png'],
      offsets: [{ x: 4, y: -20 }],
      opacities: [0.8],
      durationOverall: 300,
      animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE,
      animationOptions: { vxStarting: (1200 * 3), vyStarting: (4000 * 3) }
    }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (40 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      spriteNames: [`swallow.png`],
      offsets: [{ x: 8, y: -6 }],
      durationOverall: 1000,
      animationTypeId: ANIMATION_TYPES.MOVE,
      animationOptions: { vxStarting: (-1200 * 3), vyStarting: (-3200 * 3) }
    }
}, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (60 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      spriteNames: [`swallow.png`],
      offsets: [{ x: 10, y: 4 }],
      angles: [180],
      durationOverall: 1000,
      animationTypeId: ANIMATION_TYPES.REGRESS,
      animationOptions: { vxStarting: (-300 * 3), vyStarting: (-800 * 3) }
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: (85 / ANIMATION_SPEED),
    args: { targetsId: 'foe', fighterState: LAS.DAMAGED, fighterStateDefault: LAS.CRITICAL }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (85 / ANIMATION_SPEED),
    args: { targetsId: 'foe', animationTypeId: ANIMATION_TYPES.WOBBLE }
  }, {
    id: genId(),
    functionName: 'createParticleContainer',
    delay: (85 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      ...getHealthNumberProps(2)
    }
  }, {
    id: genId(),
    functionName: 'changeStat',
    delay: (85 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      statName: 'health',
      quantity: -2
    }
  }],
  ['Lunge']: [{
    id: genId(),
    functionName: 'applyAnimation',
    delay: 0,
    args: {
      targetsId: 'foe',
      animationTypeId: ANIMATION_TYPES.LUNGE,
      animationOptions: { cx: -21, cy: -12 }
    },
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (10 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      spriteNames: ['swing_swish.png'],
      offsets: [{ x: -6, y: -5 }],
      opacities: [0.8],
      durationOverall: 250,
      animationTypeId: ANIMATION_TYPES.FADE_AWAY,
      animationOptions: {
        duration: 200
      }
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: (10 / ANIMATION_SPEED),
    args: { targetsId: 'test', fighterState: LAS.DAMAGED, fighterStateDefault: LAS.CRITICAL }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (10 / ANIMATION_SPEED),
    args: { targetsId: 'test', animationTypeId: ANIMATION_TYPES.WOBBLE }
  }, {
    id: genId(),
    functionName: 'createParticleContainer',
    delay: (10 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      targetMirrored: true,
      ...getHealthNumberProps(2)
    }
  }, {
    id: genId(),
    functionName: 'changeStat',
    delay: (10 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      statName: 'health',
      quantity: -2
    }
  }],
};

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
      performEventSet({ artist, eventSet, fighters: battleState.fighters });
      setPixiEventsUI(eventSet.filter((pixiEvent) => pixiEvent.functionName === 'changeStat'));
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