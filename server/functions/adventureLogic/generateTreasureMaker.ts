import type Fighter from "@common/models/fighter";
import type Treasure from "@common/models/treasure";
import type Adventure from "@server/models/adventure";
import randomFrom from "@common/functions/utils/randomFrom";
import range from "@common/functions/utils/range";
import { foodsNotReviving, foodsReviving } from "@common/instances/food";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";

const TREASURE_COUNT_DEFAULT = 4;

const generateTreasureMaker = (getTreasureMakerArgs: {
  treasureGuaranteed: Treasure
  treasurePool: TreasurePoolOption[],
}): (treasureMakerArgs: { adventure: Adventure, fighter: Fighter }) => Treasure[] => {
  const { treasureGuaranteed, treasurePool } = getTreasureMakerArgs;
  
  return (treasureMakerArgs: { adventure: Adventure, fighter: Fighter }) => {
    const { fighter } = treasureMakerArgs;
    const treasures: (Treasure | TreasurePoolOption)[] = [treasureGuaranteed];

    if (fighter.health <= 0) {
      treasures.push(randomFrom(
        foodsReviving.map((foodId) => ({ kind: 'food', id: foodId, quantity: 1 }))
      ));
    }
    else {
      treasures.push(randomFrom(
        foodsNotReviving.map((foodId) => ({ kind: 'food', id: foodId, quantity: 1 }))
      ));
    }

    range(2, (TREASURE_COUNT_DEFAULT - 1)).forEach(() => {
      const treasureKindsPresent = treasures.map((treasure) => treasure.kind);
      let treasure = treasurePool[0];

      const treasuresNotPresent = treasurePool.filter((t) => !treasureKindsPresent.includes(t.kind));
      if (treasuresNotPresent.length > 0) {
        const treasureIndex = randomFromWeighted(treasuresNotPresent);
        if (treasureIndex) treasure = treasuresNotPresent[treasureIndex];
      }
      else {
        const treasureIndex = randomFromWeighted(treasurePool);
        if (treasureIndex) treasure = treasurePool[treasureIndex];
      }

      if (!treasure) return;
      treasures.push(treasure);
    });

    return treasures.map((t) => { if ("weight" in t) delete t.weight; return t; });
  };
};

interface TreasurePoolOption extends Treasure {
  weight?: number;
};

export default generateTreasureMaker;