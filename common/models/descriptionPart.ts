import type RichText from "./richText";

export default interface DescriptionPart {
  kind: 'damage' | 'healing' | 'curse' | 'blessing' | 'giveCurse' | 'giveBlessing' | 'fast' | 'slow'
    | 'defense' | 'chargeCost' | 'healAfterDamage';
  changedBy?: DescriptionPartChangedBy[];
  appliesTo?: 'user' | 'target' | 'front';
  extent?: number;
  suffix?: RichText | string;
  alterationId?: string;
  levelMult?: number;
};

export interface DescriptionPartChangedBy {
  kind: 'enchantment' | 'level';
  id: string;
  amount: number;
  alterationId?: string;
};
