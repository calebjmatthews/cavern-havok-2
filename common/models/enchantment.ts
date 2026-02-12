import type RichText from "./richText";

export default interface Enchantment {
  id: string;
  name: string;
  description: RichText | string;
  mods: ({
    kind: 'healAfterDamage' | 'damage' | 'healingCurseBlessing' | 'slow' | 'fast' | 'defense' | 'giveBlessing' | 'giveCurse' | 'chargeLess',
    appliesTo?: 'user' | 'target',
    extent?: number,
    extentKind?: 'additive' | 'multiplicative'
    alterationId?: string,
  })[];
};