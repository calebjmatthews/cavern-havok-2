import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type Treasure from "@common/models/treasure";
import TreasureSelect from "../Battle/TreasureSelect/TreasureSelect";

const chests: Treasure[][] = [[{ kind: 'cinders', quantity: 25 }]];

export default function Debug() {
  const outletContext: OutletContext = useOutletContext();
  const { artistRef } = outletContext;

  return (
    <section>
      <TreasureSelect
        treasures={chests[0]}
        onTreasureSelect={() => {}}
        artistRef={artistRef}
      />
    </section>
  );
}