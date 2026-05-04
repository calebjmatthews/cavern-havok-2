import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import { ADVENTURE_KINDS, CHARACTER_CLASSES } from "@common/enums";
import { characterClasses } from "@common/instances/character_classes";

const PIXI_CHECK_MAX_ATTEMPTS = 1000;
const PIXI_CHECK_INTERVAL = 10;

export default function DebugCharacter() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

  const [state, setState] = useState('clean');

  useEffect(() => {
    if ((state === 'clean' || state.includes('re-clean')) && artistRef.current.pixiInitialized) {
      setState('ready');
      artistRef.current.drawBackground(ADVENTURE_KINDS.PRISMATIC_FALLS);
      const raiderClass = characterClasses[CHARACTER_CLASSES.RAIDER];
      if (!raiderClass) return;
      artistRef.current.setFighters({
        ['test']: raiderClass.toFighter({
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

  if (state !== 'ready') return null;

  return (
    <section>
      
    </section>
  );
}