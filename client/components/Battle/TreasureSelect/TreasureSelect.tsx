import { useEffect, useState } from "react";

import type Treasure from "@common/models/treasure";
import type Artist from "@client/models/artist/artist";
import RichTextRenderer from "@client/components/RichTextRenderer/RichTextRenderer";
import foods from "@common/instances/food";
import equipments from "@common/instances/equipments";
import glyphs from "@common/instances/glyphs";
import getEquipmentName from "@client/functions/getEquipmentName";
import pixiBoundsToDOMStyle from "@client/models/artist/pixiBoundsToDOMStyle";
import "./treasureSelect.css";

const CHEST_SPRITE_CHECK_MAX = 100;
const CHEST_SPRITE_CHECK_INTERVAL = 10;

export default function TreasureSelect(props: {
  treasures: Treasure[] | null | undefined;
  onTreasureSelect: (treasure: Treasure) => void;
  artistRef: React.RefObject<Artist>
}) {
  const { treasures, onTreasureSelect, artistRef } = props;
  const [state, setState] = useState('clean');
  const [treasureSelected, setTreasureSelected] = useState<Treasure | null>(null);
  const [chestSpriteCheck, setChestSpriteCheck] = useState(0);

  useEffect(() => {
    const initialize = async() => {
      artistRef.current.setChests([treasures ?? []]);
    };

    if (state === 'clean' && artistRef?.current) {
      setState('initialize');
    }
    if (state === 'initialize') {
      setState('initializing');
      initialize();
    }
  }, [state, JSON.stringify(artistRef?.current ?? {})]);

  useEffect(() => {
    if (state === 'initializing' && chestSpriteCheck < CHEST_SPRITE_CHECK_MAX) {
      if (artistRef.current.chestsBounds.length > 0) {
        const chestSelectButtonDiv = document.querySelector('#chest-select-buttons');
        if (!chestSelectButtonDiv) return;
        artistRef.current.chestsBounds.forEach((chestBound) => {
          const chestButton = document.createElement('button');
          chestButton.type = 'button';
          chestButton.style = pixiBoundsToDOMStyle(chestBound);
          chestButton.className = 'chest-select-button';
          chestButton.addEventListener('click', () => chestClick(chestBound.id));
          chestSelectButtonDiv.appendChild(chestButton);
        });
        setState('chestSelect');
      }
      else {
        setTimeout(() => (
          setChestSpriteCheck(chestSpriteCheck+1)
        ), CHEST_SPRITE_CHECK_INTERVAL);
      };
    }
  }, [state, artistRef?.current?.chestsBounds, chestSpriteCheck]);
  
  if (!treasures) return null;

  const chestClick = (id: string) => {
    console.log(`chest ${id} clicked.`);
  };

  if (state === 'initializing' || state === 'chestSelect') return (
    <>
      <div id="treasure-select-wrapper">
        <section id="chest-select">
          <p className="text-large">{`Pick a chest!`}</p>
        </section>
      </div>
      <div id="chest-select-buttons" />
    </>
  );

  return (
    <div id="treasure-select-wrapper">
      <section id="treasure-select">
        <p className="text-large">{`Grab a treasure!`}</p>
        <section id="treasure-options">
          {treasures
          .filter((treasure) => !treasure.isGuaranteed)
          .map((treasure, index) => (
            <div
              className="treasure-option"
              key={`treasure-option-${index}`}
              >
              <TreasureText treasure={treasure} index={index} />
              <button
                onClick={() => setTreasureSelected(treasure)}
                className={JSON.stringify(treasureSelected) === JSON.stringify(treasure)
                  ? "treasure-option-button is-selected"
                  : "treasure-option-button"}
              >
                {`Pick`}
              </button>
            </div>
          ))}
        </section>
        <button
          type="button"
          className="btn-large"
          onClick={() => { if (treasureSelected) onTreasureSelect(treasureSelected); }}
          disabled={treasureSelected === null}
        >
          {`Take this one`}
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
      <p>{`${food.description}`}</p>
      <p>{`${food.flavorText}`}</p>
    </>
  );

  const equip = equipments[treasure.piece?.equipmentId || ''];
  if (treasure.kind === 'equipment' && treasure.piece && equip) return (
    <>
      <div className="text-large">
        <RichTextRenderer richText={getEquipmentName(treasure.piece)} />
      </div>
      <div>
        <RichTextRenderer richText={equip.getDescription({ piece: treasure.piece })} />
      </div>
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