import type Fighter from "@common/models/fighter";
import type Treasure from "@common/models/treasure";
import type Adventure from "@server/models/adventure/adventure";
import type { TreasurePoolOption } from "@server/models/treasurePoolOption";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
import shuffleArray from "@common/functions/utils/shuffleArray";
import equipments from "@common/instances/equipments";
import foods from "@common/instances/food";
import { CHEST_KINDS, EQUIPMENT_SLOTS, TREASURE_KINDS } from "@common/enums";
const CHK = CHEST_KINDS;
const TRK = TREASURE_KINDS;
const EQS = EQUIPMENT_SLOTS;

const TREASURE_COUNT_DEFAULT = 4;

const generateTreasureMaker = (generateTreasureMakerArgs: {
  treasureGuaranteed: Treasure
  treasurePool: TreasurePoolOption[],
}): (treasureMakerArgs: { adventure: Adventure, fighter: Fighter, chestKindId: string }) =>
  Treasure[] => {
  const { treasureGuaranteed, treasurePool } = generateTreasureMakerArgs;

  const treasureGroups: { [treasureKind: string]: TreasurePoolOption[] } = {
    [TRK.HAT]: treasurePool.filter((tpo) => isEquipmentType(tpo, EQS.HEAD)),
    [TRK.WEAPON]: treasurePool.filter((tpo) => isEquipmentType(tpo, EQS.MAIN)),
    [TRK.ARMOR]: treasurePool.filter((tpo) => isEquipmentType(tpo, EQS.TOP)),
    [TRK.SHOES]: treasurePool.filter((tpo) => isEquipmentType(tpo, EQS.BOTTOM)),
    [TRK.FOOD]: treasurePool.filter((tpo) => {
      const food = foods[tpo.id ?? ''];
      if (!food) return false;
      return !(food.healToPercentage);
    }),
    [TRK.FOOD_REVIVING]: treasurePool.filter((tpo) => {
      const food = foods[tpo.id ?? ''];
      if (!food) return false;
      return !!(food.healToPercentage);
    }),
    [TRK.ENCHANTED]: treasurePool.filter((tpo) => ( (tpo.piece?.enchantments ?? []).length > 0 )),
    [TRK.CINDERS]: treasurePool.filter((tpo) => !!(tpo.kind === 'cinders'))
  };
  
  return (treasureMakerArgs: { adventure: Adventure, fighter: Fighter, chestKindId: string }) => {
    const { chestKindId } = treasureMakerArgs;
    // ToDo: treasureGuaranteed should only be added if the battle was won
    const treasures: (Treasure | TreasurePoolOption)[] = [treasureGuaranteed];
    const choiceCount = TREASURE_COUNT_DEFAULT;

    if (chestKindId === CHK.EMERGENCY_CARE_PACKAGE) {
      const foodReviving = [...treasureGroups[TRK.FOOD_REVIVING] ?? []];
      treasures.push(
        ...shuffleArray(foodReviving).slice(0, (TREASURE_COUNT_DEFAULT-1))
      )
      return treasures.map((t) => removeWeight(t));
    }
    else if (chestKindId === CHK.FLOTSAM_PILE) {
      // ToDo: Handle final chest
    }

    if (chestKindId === CHK.WEAPONRY_CHEST) addToTreasures(treasures, treasureGroups[TRK.WEAPON]);
    if (chestKindId === CHK.HATTERS_CHEST) addToTreasures(treasures, treasureGroups[TRK.HAT]);
    if (chestKindId === CHK.ARMORERS_CHEST) addToTreasures(treasures, treasureGroups[TRK.ARMOR]);
    if (chestKindId === CHK.COBBLERS_CHEST) addToTreasures(treasures, treasureGroups[TRK.SHOES]);
    if (chestKindId === CHK.PICNIC_BASKET) addToTreasures(treasures, treasureGroups[TRK.FOOD]);

    // Pseudowhile loop: return treasures of dissimilar kinds, then reject duplicate kind and id
    for (let loop = 0; loop < 10000; loop++) {
      const treasureKindsPresent = treasures.map((treasure) => treasure.kind);
      let treasure = treasurePool[0];

      const treasuresNotPresent = treasurePool.filter((t) => !treasureKindsPresent.includes(t.kind));
      if (treasuresNotPresent.length > 0) {
        const treasureIndex = randomFromWeighted(treasuresNotPresent);
        if (treasureIndex !== null) treasure = treasuresNotPresent[treasureIndex];
      }
      else {
        const treasureIndex = randomFromWeighted(treasurePool);
        if (treasureIndex !== null) treasure = treasurePool[treasureIndex];
      };

      if (treasure && !(treasures.find((t) => areTreasuresSame(t, treasure)))) treasures.push(treasure);

      if (treasures.length >= choiceCount) {
        return treasures.map((t) => removeWeight(t));
      }
    };

    // This would only happen if pseudowhile loop is exceeded
    return treasures.map((t) => removeWeight(t));
  };
};

const addToTreasures = (treasures: TreasurePoolOption[], group: TreasurePoolOption[] | undefined) => {
  if (!group) return treasures;
  const index = randomFromWeighted(group);
  if (!index) return treasures;
  const option = group[index];
  if (option) treasures.push(option);
  return treasures;
};

const isEquipmentType = (tpo: TreasurePoolOption, equipmentSlot: string) => {
  const equipment = equipments[tpo.piece?.equipmentId ?? ''];
  if (!equipment) return false;
  return (equipment.slot === equipmentSlot);
};

const areTreasuresSame = (a: TreasurePoolOption, b: TreasurePoolOption) => {
  if (a.kind === 'cinders' && b.kind === 'cinders' && a.quantity !== b.quantity) return false;
  if (a.kind === 'cinders' && b.kind === 'cinders' && a.quantity === b.quantity) return true;
  if (a.kind === b.kind && a.id === b.id) return true;
  return false;
};

const removeWeight = (treasurePoolOption: TreasurePoolOption) => {
  const treasure = Object.assign({}, treasurePoolOption);
  if ("weight" in treasure) delete treasure.weight;
  return treasure;
};

export default generateTreasureMaker;