import type Food from '@common/models/food';
import { ALTERATIONS, FOODS } from '../enums';

/**
 * Ideas:
 * - food that gives charge at beginning of battle
 * - food that gives talisman at beginning of battle
 */

const foods: { [id: string] : Food } = {
  [FOODS.CAYENNE_POT_PIE]: {
    id: FOODS.CAYENNE_POT_PIE,
    name: `Cayenne Pot Pie`,
    description: `Revive to 50% of maximum health.`,
    flavorText: `A distressingly spicy mix of vegetables under a layer of piping crust.`,
    healToPercentage: 50
  },
  [FOODS.SPICY_LAYER_CAKE]: {
    id: FOODS.SPICY_LAYER_CAKE,
    name: `Spicy Layer Cake`,
    description: `Revive to 25% of maximum health and Bless with 3 Power.`,
    flavorText: `A wonderfully warming confectionary made of alternating layers of spicy and sweet sponge cake.`,
    healToPercentage: 25,
    blessing: { alterationId: ALTERATIONS.POWER, extent: 3 }
  },
  [FOODS.RED_PEPPER_TRUFFLES]: {
    id: FOODS.RED_PEPPER_TRUFFLES,
    name: `Red Pepper Truffles`,
    description: `Revive to 25% of maximum health and Bless with 3 Shell.`,
    flavorText: `A magnificently rich set of chocolates filled with mouth-burning red pepper cream.`,
    healToPercentage: 25,
    blessing: { alterationId: ALTERATIONS.SHELL, extent: 3 }
  },
  [FOODS.HEART_SHAPED_BUN]: {
    id: FOODS.HEART_SHAPED_BUN,
    name: `Heart-Shaped Bun`,
    description: `Heal 6.`,
    flavorText: `A deliciously sweet and hearty roll made with honey and root flour.`,
    healing: 6
  },
  [FOODS.LEMON_MERINGUE_TART]: {
    id: FOODS.LEMON_MERINGUE_TART,
    name: `Lemon Meringue Tart`,
    description: `Heal 3 and Bless with 3 Quick.`,
    flavorText: `A fantastically airy citrus filling inside a thin tart crust.`,
    healing: 3,
    blessing: { alterationId: ALTERATIONS.QUICK, extent: 3 }
  },
  [FOODS.GINGERSNAP_COOKIES]: {
    id: FOODS.GINGERSNAP_COOKIES,
    name: `Gingersnap Cookies`,
    description: `Heal 3 and Bless with 3 Power.`,
    flavorText: `Strongly spiced cookies that give a satisfying snap when you bite them.`,
    healing: 3,
    blessing: { alterationId: ALTERATIONS.POWER, extent: 3 }
  }
};

export const foodsReviving: string[] = [
  FOODS.CAYENNE_POT_PIE, FOODS.SPICY_LAYER_CAKE, FOODS.RED_PEPPER_TRUFFLES
];

export const foodsNotReviving: string[] = Object.keys(foods)
.filter((foodId) => !foodsReviving.includes(foodId));

export default foods;