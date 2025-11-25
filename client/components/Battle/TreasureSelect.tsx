import { useState } from "react";

import type Treasure from "@common/models/treasure";
import foods from "@common/instances/food";

export default function TreasureSelect(props: {
  treasures: Treasure[] | null | undefined;
  readyForChamberNew: (treasure: Treasure) => void;
}) {
  const { treasures, readyForChamberNew } = props;
  const [treasureSelected, setTreasureSelected] = useState<Treasure | null>(null);

  if (!treasures) return null;

  return (
    <div id="treasure-select-wrapper">
      <div id="treasure-select-background" />
      <section id="treasure-select">
        <p className="text-large">{`Grab a treasure!`}</p>
        <section id="treasure-options">
          {treasures.map((treasure, index) => (
            <button
              key={`treasure-option-${index}`}
              onClick={() => setTreasureSelected(treasure)}
              className={JSON.stringify(treasureSelected) === JSON.stringify(treasure) ? "treasure-option is-selected" : "treasure-option"}
            >
              <TreasureText treasure={treasure} />
            </button>
          ))}
        </section>
        <button
          type="button"
          className="btn-large"
          onClick={() => { if (treasureSelected) readyForChamberNew(treasureSelected); }}
          disabled={treasureSelected === null}
        >
          {`Keep pressing onward!`}
        </button>
      </section>
    </div>
  );
};

function TreasureText(props: { treasure: Treasure }) {
  const { treasure } = props;

  if (treasure.kind === 'cinders') return (
    <div>
      <p className="text-large">{`Cinders x${treasure.quantity}`}</p>
      <p>{`Good for making things or feeding to salamanders.`}</p>
    </div>
  );
  const food = foods[treasure.id || ''];
  if (food) return (
    <div>
      <p className="text-large">{`${food.name}`}</p>
      {food.description.split('. ').map((dp) => (
        <p>{`${dp}${dp.slice(-1) !== '.' ? '.' : ''}`}</p>
      ))}
    </div>
  );

  return `${treasure.kind} ${treasure.id} x${treasure.quantity}`;
};