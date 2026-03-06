import type RichText from "./richText";

export default interface Enchantment {
  id: string;
  name: string;
  description: RichText | string;
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