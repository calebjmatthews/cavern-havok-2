import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import { ADVENTURE_KINDS, CHARACTER_CLASSES, LAYERED_ANIMATED_STATES } from "@common/enums";
import { characterClasses } from "@common/instances/character_classes";
import { LAYERED_ANIMATED_STATES_DEBUG } from "@common/constants";
import './debug.css';
import changeFighterState from "@client/models/artist/fighters/changeFighterState";

const PIXI_CHECK_MAX_ATTEMPTS = 1000;
const PIXI_CHECK_INTERVAL = 10;

export default function DebugCharacter() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

  const [state, setState] = useState('clean');
  const [lasState, setLasState] = useState<string>(LAYERED_ANIMATED_STATES.RESTING);

  useEffect(() => {
    if ((state === 'clean' || state.includes('re-clean')) && artistRef.current.pixiInitialized) {
      setState('ready');
      artistRef.current.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
      const javalinClass = characterClasses[CHARACTER_CLASSES.JAVALIN];
      if (!javalinClass) return;
      artistRef.current.setFighters({
        ['test']: javalinClass.toFighter({
          id: 'test',
          name: 'Test',
          ownedBy: 'testUser',
          controlledBy: 'testUser',
          side: 'A',
          coords: [2, 2]
        })
      });
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
    changeFighterState({ artist: artistRef.current, fighterId: 'test', nextState: tLasState });
    setLasState(tLasState);
  };

  if (state !== 'ready') return null;

  return (
    <section id="debug-character">
      <section className="debug-buttons">
        <span className="text-white">State</span>
        {LAYERED_ANIMATED_STATES_DEBUG.map((tLasState) => (
          <button
            key={tLasState}
            className={tLasState === lasState ? 'is-selected' : ''}
            onClick={() => lasStateClick(tLasState)}
          >
            {tLasState}
          </button>
        ))}
      </section>
    </section>
  );
}