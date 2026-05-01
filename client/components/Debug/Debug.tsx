import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type Chest from "@common/models/chest";
import TreasureSelect from "../TreasureSelect/TreasureSelect";
import { CHEST_KINDS, EQUIPMENTS } from "@common/enums";
import { genId } from "@common/functions/utils/random";

const PIXI_CHECK_MAX_ATTEMPTS = 1000;
const PIXI_CHECK_INTERVAL = 10;

const chests: Chest[] = [{
  chestKindId: CHEST_KINDS.WEAPONRY_CHEST,
  guaranteed: [{ kind: 'cinders', quantity: 25 }],
  options: [
    { kind: 'cinders', quantity: 100 },
    { kind: 'equipment', quantity: 1, piece: {
      id: genId(), equipmentId: EQUIPMENTS.SWEEP_AX, belongsTo: '', acquiredAt: Date.now()
    } },
    { kind: 'equipment', quantity: 1, piece: {
      id: genId(), equipmentId: EQUIPMENTS.CLEAVING_AX, belongsTo: '', acquiredAt: Date.now()
    } }
  ]
}, {
  chestKindId: CHEST_KINDS.ARMORERS_CHEST,
  guaranteed: [{ kind: 'cinders', quantity: 25 }],
  options: [
    { kind: 'cinders', quantity: 100 },
    { kind: 'equipment', quantity: 1, piece: {
      id: genId(), equipmentId: EQUIPMENTS.FLINT_SHOULDERGUARDS, belongsTo: '', acquiredAt: Date.now()
    } },
    { kind: 'equipment', quantity: 1, piece: {
      id: genId(), equipmentId: EQUIPMENTS.DOWN_VEST, belongsTo: '', acquiredAt: Date.now()
    } }
  ]
}, {
  chestKindId: CHEST_KINDS.COBBLERS_CHEST,
  guaranteed: [{ kind: 'cinders', quantity: 25 }],
  options: [{
     kind: 'cinders', quantity: 100 },
    { kind: 'equipment', quantity: 1, piece: {
      id: genId(), equipmentId: EQUIPMENTS.FLINT_BOOTS, belongsTo: '', acquiredAt: Date.now()
    } },
    { kind: 'equipment', quantity: 1, piece: {
      id: genId(), equipmentId: EQUIPMENTS.TUFTED_SANDALS, belongsTo: '', acquiredAt: Date.now()
    } }
    ]
}];

export default function Debug() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

  const [state, setState] = useState('clean');

  useEffect(() => {
    if ((state === 'clean' || state.includes('re-clean')) && artistRef.current.pixiInitialized) {
      setState('ready');
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
      <TreasureSelect
        chests={chests}
        onTreasureSelect={() => {}}
        artistRef={artistRef}
      />
    </section>
  );
}