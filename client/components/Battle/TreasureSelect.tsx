import { useState } from "react";

import type Treasure from "@common/models/treasure";
import foods from "@common/instances/food";
import equipments from "@common/instances/equipments";

export default function TreasureSelect(props: {
  treasures: Treasure[] | null | undefined;
  onTreasureSelect: (treasure: Treasure) => void;
}) {
  const { treasures, onTreasureSelect } = props;
  const [treasureSelected, setTreasureSelected] = useState<Treasure | null>(null);
  
  if (!treasures) return null;
  const treasuresCindersGuaranteed = treasures.filter((t) => t.isGuaranteed && t.kind === 'cinders')?.[0];
  
  return (
    <div id="treasure-select-wrapper">
      <div id="treasure-select-background" />
      <section id="treasure-select">
        <p className="text-large">{`Grab a treasure!`}</p>
        <section id="treasure-options">
          {treasures
          .filter((treasure) => !treasure.isGuaranteed)
          .map((treasure, index) => (
            <button
              key={`treasure-option-${index}`}
              onClick={() => setTreasureSelected(treasure)}
              className={JSON.stringify(treasureSelected) === JSON.stringify(treasure) ? "treasure-option is-selected" : "treasure-option"}
            >
              <TreasureText treasure={treasure} index={index} />
            </button>
          ))}
        </section>
        <button
          type="button"
          className="btn-large"
          onClick={() => { if (treasureSelected) onTreasureSelect(treasureSelected); }}
          disabled={treasureSelected === null}
        >
          {`Grab this one`}
        </button>
      </section>
    </div>
  );
};

function TreasureText(props: { treasure: Treasure, index: number }) {
  const { treasure, index } = props;

  if (treasure.kind === 'cinders') return (
    <>
      <p className="text-large">{`Cinders x${treasure.quantity}`}</p>
      <p>{`Good for making things or feeding to salamanders.`}</p>
    </>
  );

  const food = foods[treasure.id || ''];
  if (treasure.kind === 'food' && food) return (
    <>
      <p className="text-large">{`${food.name}`}</p>
      {food.description.split('. ').map((dp, textIndex) => (
        <p key={`treasure-text-${index}-${textIndex}`}>
          {`${dp}${dp.slice(-1) !== '.' ? '.' : ''}`}
        </p>
      ))}
    </>
  );

  const equip = equipments[treasure.id || ''];
  if (treasure.kind === 'equipment' && equip) return (
    <>
      <p className="text-large">{`${equip.id}`}</p>
      <p className="text-large">{`${equip.description}`}</p>
    </>
  );

  return `${treasure.kind} ${treasure.id} x${treasure.quantity}`;
};