import { ALTERATIONS, FOODS } from '../enums';
import type Food from '@common/models/food';

/**
 * Ideas:
 * - food that gives charge at beginning of battle
 * - food that gives talisman at beginning of battle
 */

const foods: { [id: string] : Food } = {
  [FOODS.CAYENNE_POT_PIE]: {
    id: FOODS.CAYENNE_POT_PIE,
    name: `Cayenne Pot Pie`,
    description: `A distressingly spicy mix of vegetables under a layer of piping crust. Hot enough to revive a knocked out fighter to 50% of maximum health.`,
    healToPercentage: 50
  },
  [FOODS.SPICY_LAYER_CAKE]: {
    id: FOODS.SPICY_LAYER_CAKE,
    name: `Spicy Layer Cake`,
    description: `A wonderfully warming confectionary made of alternating layers of spicy and sweet sponge cake. Fiery enough to revive a knocked out fighter to 25% of maximum health and increase maximum health by 2 for the rest of the adventure.`,
    healToPercentage: 25,
    healthMax: 2
  },
  [FOODS.RED_PEPPER_TRUFFLES]: {
    id: FOODS.RED_PEPPER_TRUFFLES,
    name: `Red Pepper Truffles`,
    description: `A magnificently rich set of chocolates filled with mouth-burning red pepper cream. Spicy enough to revive a knocked out fighter to 25% and begin battles Blessed with Shell 2 for the rest of the adventure.`,
    healToPercentage: 25,
    blessing: { alterationId: ALTERATIONS.RED_PEPPER_TRUFFLES, extent: 1 }
  },
  [FOODS.HEART_SHAPED_BUN]: {
    id: FOODS.HEART_SHAPED_BUN,
    name: `Heart-Shaped Bun`,
    description: `A deliciously sweet and hearty roll made with honey and root flour. Both heals and increases maximum health by 5 for the rest of the adventure.`,
    healing: 5,
    healthMax: 5
  },
  [FOODS.LEMON_MERINGUE_TART]: {
    id: FOODS.LEMON_MERINGUE_TART,
    name: `Lemon Meringue Tart`,
    description: `A fantastically airy citrus filling inside a thin tart crust. Both heals and increases speed by 3 for the rest of the adventure.`,
    healing: 3,
    speed: 3
  },
  [FOODS.GINGERSNAP_COOKIES]: {
    id: FOODS.GINGERSNAP_COOKIES,
    name: `Gingersnap Cookies`,
    description: `Powerfully spiced cookies that give a satisfying snap when you bite them. Heal 3 and begin battles Blessed with Power 2 for the rest of the adventure.`,
    healing: 3,
    blessing: { alterationId: ALTERATIONS.GINGERSNAP_COOKIES, extent: 1 }
  }
};

export const foodsReviving: string[] = [
  FOODS.CAYENNE_POT_PIE, FOODS.SPICY_LAYER_CAKE, FOODS.RED_PEPPER_TRUFFLES
];

export const foodsNotReviving: string[] = Object.keys(foods)
.filter((foodId) => !foodsReviving.includes(foodId));

export default foods;