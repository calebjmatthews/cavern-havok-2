import { CHEST_KINDS } from "@common/enums";
import type ChestKind from "@common/models/chestKind";

const chestKinds: { [id: string] : ChestKind } = {
  [CHEST_KINDS.WEAPONRY_CHEST] : {
    id: CHEST_KINDS.WEAPONRY_CHEST,
    description: `Contains three choices of weapons.`
  },
  [CHEST_KINDS.ARMORERS_CHEST] : {
    id: CHEST_KINDS.ARMORERS_CHEST,
    description: `Includes at least one armor.`
  },
  [CHEST_KINDS.COBBLERS_CHEST] : {
    id: CHEST_KINDS.COBBLERS_CHEST,
    description: `Includes at least one pair of shoes.`
  },
  [CHEST_KINDS.HATTERS_CHEST] : {
    id: CHEST_KINDS.HATTERS_CHEST,
    description: `Includes at least one hat.`
  },
  [CHEST_KINDS.CURIO_CHEST] : {
    id: CHEST_KINDS.CURIO_CHEST,
    description: `Includes at least one artifact.`
  },
  [CHEST_KINDS.HUGE_CHEST] : {
    id: CHEST_KINDS.HUGE_CHEST,
    description: `Choose two of four different equipments, artifacts, cinders, or foods.`
  },
  [CHEST_KINDS.PICNIC_BASKET] : {
    id: CHEST_KINDS.PICNIC_BASKET,
    description: `Three choices of food, with the possibility of rare dishes.`
  },
  [CHEST_KINDS.ENCHANTED_CHEST] : {
    id: CHEST_KINDS.ENCHANTED_CHEST,
    description: `Three choices of equipment, with at least one being enchanted.`
  },
  [CHEST_KINDS.SUPPLY_CACHE] : {
    id: CHEST_KINDS.SUPPLY_CACHE,
    description: `More commonplace rewards than other chests, but three of the five options can be chosen.`
  },
  [CHEST_KINDS.EMERGENCY_CARE_PACKAGE] : {
    id: CHEST_KINDS.EMERGENCY_CARE_PACKAGE,
    description: `Three choices of food that revive a downed fighter.`
  },
};

export default chestKinds;