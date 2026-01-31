import { useState } from "react";

import type Treasure from "@common/models/treasure";
import foods from "@common/instances/food";
import equipments from "@common/instances/equipments";
import glyphs from "@common/instances/glyphs";

export default function TreasureSelect(props: {
  treasures: Treasure[] | null | undefined;
  onTreasureSelect: (treasure: Treasure) => void;
}) {
  const { treasures, onTreasureSelect } = props;
  const [treasureSelected, setTreasureSelected] = useState<Treasure | null>(null);
  
  if (!treasures) return null;

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
  const { treasure } = props;

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
      <p className="text-large">{`${food.description}`}</p>
      <p>{`${food.flavorText}`}</p>
    </>
  );

  const equip = equipments[treasure.id || ''];
  if (treasure.kind === 'equipment' && equip) return (
    <>
      <p className="text-large">{`${equip.id}`}</p>
      <p className="text-large">{`${equip.description}`}</p>
    </>
  );

  const glyph = glyphs[treasure.id || ''];
  if (treasure.kind === 'glyphUnknown' && treasure.nameUnknown) return (
    <>
      <p className="text-large">{`Glyph: ${treasure.nameUnknown}`}</p>
      <p>{`You can't read this yet, but you know inscribing it on yourself will do something good.`}</p>
    </>
  );
  if (treasure.kind === 'glyph' && glyph) return (
    <>
      <p className="text-large">{`Glyph: ${glyph.name}`}</p>
      <p>{glyph.description}</p>
    </>
  );

  return `${treasure.kind} ${treasure.id} x${treasure.quantity}`;
};