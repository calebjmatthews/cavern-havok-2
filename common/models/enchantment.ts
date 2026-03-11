import type RichText from "./richText";
import type { ENCHANTMENT_GROUPS, ENCHANTMENTS } from "@common/enums";

export default interface Enchantment {
  id: ENCHANTMENTS;
  name: string;
  description: RichText | string;
  groups: ENCHANTMENT_GROUPS[];
  weight: number;
  mods: EnchantmentMod[];
};

export interface EnchantmentMod {
  kind: ModKind;
  appliesTo?: 'user' | 'target';
  extent?: number;
  extentKind?: 'additive' | 'multiplicative';
  alterationId?: string;
};

export type ModKind = 'damage' | 'healingCurseBlessing' | 'slow' | 'fast' | 'defense' | 'giveBlessing'
  | 'giveCurse' | 'chargeLess' | 'healAfterDamage';