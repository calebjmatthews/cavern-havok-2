// import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type Chest from "@common/models/chest";
import TreasureSelect from "../Battle/TreasureSelect/TreasureSelect";
import { CHEST_KINDS } from "@common/enums";

const chests: Chest[] = [{
  chestKindId: CHEST_KINDS.WEAPONRY_CHEST,
  guaranteed: [{ kind: 'cinders', quantity: 10 }],
  options: [{ kind: 'cinders', quantity: 25 }]
}];

export default function Debug() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

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