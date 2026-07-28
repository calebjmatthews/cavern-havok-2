import type Fighter from "@common/models/fighter";
import type Adventure from "@server/models/adventure/adventure";
import { CHEST_KINDS } from "@common/enums";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
const CHK = CHEST_KINDS;

const CHEST_COUNT_DEFAULT = 3;

const generateChestMaker = (generateChestMakerArgs: {
  chestFinal: string
  chestPool: { id: string, weight: number }[],
}): (chestMakerArgs: { adventure: Adventure, fighter: Fighter }) => string[] => {
  const { chestFinal, chestPool } = generateChestMakerArgs;

  return (chestMakerArgs: { adventure: Adventure, fighter: Fighter }) => {
    const { fighter, adventure } = chestMakerArgs;

    // If at end of the adventure, either get final chest or consolation chest
    if (adventure.chamberIdsFinished.length >= adventure.chamberCount) {
      const anyNotDowned = Object.values(adventure.fighters).some((fighter) => (
        Math.round(fighter.health) > 0)
      );
      if (anyNotDowned) return [chestFinal];
      return [CHK.CONSOLATION_CHEST];
    }

    // If downed, return the three reviving foods regardless of choice count
    if (fighter.health <= 0) return [CHK.EMERGENCY_CARE_PACKAGE];

    const chestKindIds: string[] = [];

    // Pseudowhile loop: reject duplicate chest kinds
    for (let loop = 0; loop < 10000; loop++) {
      if (chestKindIds.length >= CHEST_COUNT_DEFAULT) return chestKindIds;

      const index = randomFromWeighted(chestPool);
      console.log(`index`, index);
      const chestOption = chestPool[randomFromWeighted(chestPool) ?? 0];
      if (index !== null && chestOption && !chestKindIds.includes(chestOption.id)) {
        chestKindIds.push(chestOption.id);
      };
    };

    console.log(`chestKindIds`, chestKindIds);

    return chestKindIds;
  };
};

export default generateChestMaker;