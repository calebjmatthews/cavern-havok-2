import { v4 as uuid } from "uuid";

import type Treasure from "@common/models/treasure";
import type Outcome from "@common/models/outcome";
import type AlterationActive from "@common/models/alterationActive";
import type Glyph from "@common/models/glyph";
import type Food from "@common/models/food";
import Fighter from "@common/models/fighter";
import alterations from "@common/instances/alterations";
import equipments from "@common/instances/equipments";
import joinWithAnd from "@common/functions/utils/joinWithAnd";
import foods from "@common/instances/food";
import glyphs from "@common/instances/glyphs";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import createEquipmentPiece from "@server/functions/utils/createEquipmentPiece";

const treasureApplyOne = (args: {
  treasure: Treasure,
  outcomeRoot: Outcome,
  fighter: Fighter
}) => {
  const { treasure, outcomeRoot, fighter } = args;

  let fighterNext = new Fighter(fighter);
  const outcomes: Outcome[] = [];
  const alterationsActiveNew: { [id: string] : AlterationActive } = {};
  let text = '';
  let glyphsLearned: string[] = [];

  if (treasure.kind === 'cinders') {
    fighterNext.cinders += treasure.quantity;
    outcomes.push({ ...outcomeRoot, cindersGained: treasure.quantity });
    text = `${fighterNext.name} gained ${treasure.quantity} cinders`;
    if (fighterNext.cinders > treasure.quantity) {
      text = `${text}, for a total of c${fighterNext.cinders}.`
    }
    else {
      text = `${text}.`;
    };      
  };

  if (treasure.kind === 'food' || treasure.kind === 'glyph' || treasure.kind === 'glyphUnknown') {
    const source = foods[treasure.id ?? ''] ?? glyphs[treasure.id ?? ''];
    if (!source || !treasure.id) return;
    let textPieces: string[] = [];
    if (treasure.kind === 'food') {
      textPieces = [`${fighterNext.name} ate some ${source.name}`];
    }
    else if (treasure.kind === 'glyph') {
      textPieces = [`${fighterNext.name} inscribed ${source.name} onto their body`];
    }
    else if (treasure.kind === 'glyphUnknown' && treasure.nameUnknown) {
      textPieces = [
        `${fighterNext.name} inscribed ${treasure.nameUnknown} onto their body`,
        `realized the glyph means "${source.name}"`
      ];
      glyphsLearned.push(treasure.id);
    };

    const results = getFoodOrGlyphEffect({ source, fighterNext, outcomeRoot, outcomes });
    if (results) {
      fighterNext = results.fighterNext;
      results.textPieces.forEach((textPiece) => textPieces.push(textPiece));
      results.outcomes.forEach((outcome) => outcomes.push(outcome));
    };

    if (textPieces.length === 1) textPieces.push(`but nothing much happened`);
    text = `${joinWithAnd(textPieces)}.`;
  };

  if (treasure.kind === 'equipment') {
    const equipment = equipments[treasure.id || ''];
    if (!equipment) return;
    fighterNext.equipped.push(createEquipmentPiece({
      equipmentId: equipment.id,
      belongsTo: fighter.id,
      isEphemeral: true
    }));
    outcomes.push({
      affectedId: fighterNext.id,
      duration: OUTCOME_DURATION_DEFAULT,
      equipmentGained: equipment.id
    });
    text = `${fighterNext.name} picked up a ${equipment.id}.`
  };

  return { fighterNext, outcomes, text, alterationsActiveNew, glyphsLearned };
};

const getFoodOrGlyphEffect = (args: {
  source: Food | Glyph,
  fighterNext: Fighter,
  outcomeRoot: Outcome,
  outcomes: Outcome[]
}) => {
  const { source, fighterNext, outcomeRoot, outcomes } = args;
  const alterationsActiveNew: { [id: string] : AlterationActive } = {};
  const textPieces: string[] = [];

  if (source.healthMax) {
    fighterNext.healthMax += source.healthMax;
    fighterNext.health += source.healthMax;
    textPieces.push(`gained ${source.healthMax} maximum health (new total ${fighterNext.healthMax})`);
    outcomes.push({ ...outcomeRoot, healthMax: source.healthMax });
  };

  if (source.damage) {
    fighterNext.health -= source.damage;
    textPieces.push(`took ${source.damage} damage`);
    outcomes.push({ ...outcomeRoot, damage: source.damage });
  };

  if (source.healing) {
    fighterNext.health += source.healing;
    if (fighterNext.health > fighterNext.healthMax) {
      fighterNext.health = fighterNext.healthMax;
      textPieces.push(`was fully healed`);
    }
    else {
      textPieces.push(`healed ${source.healing}`);
    }
    outcomes.push({ ...outcomeRoot, healing: source.healing });
  };

  if (source.healToPercentage) {
    const healTo = Math.ceil(fighterNext.healthMax * (source.healToPercentage / 100));
    if (healTo > fighterNext.health) {
      const healing = healTo - fighterNext.health;
      if (healTo === fighterNext.healthMax) {
        textPieces.push(`was fully healed`);
      }
      else {
        textPieces.push(`healed ${healing}`);
      }
      fighterNext.health = healTo;
      outcomes.push({ ...outcomeRoot, healing });
    };
  };

  if (source.speed) {
    fighterNext.speed += source.speed;
    textPieces.push(`gained ${source.speed} speed (new total ${fighterNext.speed})`);
    outcomes.push({ ...outcomeRoot, speed: source.speed });
  };

  if (source.blessing) {
    const blessing = alterations[source.blessing.alterationId];
    if (!blessing) return;
    const alterationActive: AlterationActive = {
      id: uuid(),
      alterationId: source.blessing.alterationId,
      ownedBy: fighterNext.id,
      extent: source.blessing.extent
    };
    alterationsActiveNew[alterationActive.id] = alterationActive;
    textPieces.push(blessing.outcomeText ?? `was blessed with ${blessing.id}`);
  };

  return { fighterNext, textPieces, outcomes };
};

export default treasureApplyOne;