import type Enchantment from '@common/models/enchantment';
import { ENCHANTMENT_GROUPS } from '@common/enums';
import enchantments from '../../../common/instances/enchantments';
import equipments from '@common/instances/equipments';

const enchantmentsForEquipment = (equipmentId: string): Enchantment[] => {
  const equipment = equipments[equipmentId];
  if (!equipment) return [];
  if ((equipment.enchantmentsAllowed ?? []).length === 0) return [];
  const allowed = equipment.enchantmentsAllowed
    ? [ENCHANTMENT_GROUPS.GLOBAL, ...equipment.enchantmentsAllowed]
    : [ENCHANTMENT_GROUPS.GLOBAL];

  const enchantmentsAllowed = Object.entries(enchantments).filter(([ _id, enchantment ]) => (
    (enchantment.groups.filter((group) => allowed.includes(group))).length >= 1
    || allowed.includes(enchantment.id)
  )).map(([ id ]) => enchantments[id])
  .filter((e) => e !== undefined);

  return enchantmentsAllowed;
};

export default enchantmentsForEquipment;