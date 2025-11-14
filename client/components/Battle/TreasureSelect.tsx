import { useState } from "react";

import type Treasure from "@common/models/treasure";

export default function Treasure(props: {
  treasures: Treasure[] | null | undefined;
  readyForChamberNew: () => void;
}) {
  const { treasures, readyForChamberNew } = props;
  const [treasureSelected, setTreasureSelected] = useState<Treasure | null>(null);

  if (!treasures) return null;

  return (
    <section id="treasure-select">
      <p className="text-large">{`Grab a treasure!`}</p>
      <section id="treasure-options">
        {treasures.map((treasure) => (
          <button
            key={JSON.stringify(treasure)}
            onClick={() => setTreasureSelected(treasure)}
            className={JSON.stringify(treasureSelected) === JSON.stringify(treasure) ? "is-selected" : ""}
          >
            {`${treasure.kind} x${treasure.quantity}`}
          </button>
        ))}
      </section>
      <button
        type="button"
        className="btn-large"
        onClick={readyForChamberNew}
        disabled={treasureSelected === null}
      >
        {`Keep pressing onward!`}
      </button>
    </section>
  )
};