import type Fighter from "@common/models/fighter";
import type Treasure from "@common/models/treasure";
import type Adventure from "@server/models/adventure";
import type { TreasurePoolOption } from "@server/models/treasurePoolOption";
import randomFrom from "@common/functions/utils/randomFrom";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
import { foodsNotReviving, foodsReviving } from "@common/instances/food";

const TREASURE_COUNT_DEFAULT = 4;

const generateTreasureMaker = (getTreasureMakerArgs: {
  treasureGuaranteed: Treasure
  treasurePool: TreasurePoolOption[],
}): (treasureMakerArgs: { adventure: Adventure, fighter: Fighter }) => Treasure[] => {
  const { treasureGuaranteed, treasurePool } = getTreasureMakerArgs;
  
  return (treasureMakerArgs: { adventure: Adventure, fighter: Fighter }) => {
    const { fighter } = treasureMakerArgs;
    const treasures: (Treasure | TreasurePoolOption)[] = [treasureGuaranteed];
    const choiceCount = TREASURE_COUNT_DEFAULT;

    // If downed, return the three reviving foods regardless of choice count
    if (fighter.health <= 0) {
      const treasuresFoodsReviving: Treasure[] = foodsReviving
      .map((foodId) => ({ kind: 'food', id: foodId, quantity: 1 }))
      return [ ...treasures, ...treasuresFoodsReviving ];
    }
    // Otherwise, return at least one food
    else {
      treasures.push(randomFrom(
        foodsNotReviving.map((foodId) => ({ kind: 'food', id: foodId, quantity: 1 }))
      ));
    };

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