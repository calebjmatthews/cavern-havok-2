import type RichText from "./richText";

export default interface DescriptionSection {
  kind: 'damage' | 'healing' | 'curse' | 'blessing' | 'giveCurse' | 'giveBlessing' | 'fast' | 'slow'
    | 'defense' | 'chargeCost' | 'chargeUp' | 'healAfterDamage';
  changedBy?: DescriptionSectionChangedBy[];
  appliesTo?: (
    'user' | 'userAndAllies' | 'target' | 'front' | 'column'| 'frontColumn' | 'enemyAll'
    | 'backTwoColumns' | 'enemiesInUsersRow' 
  );
  range?: [number, number];
  extent?: number;
  suffix?: RichText | string;
  alterationId?: string;
  levelMult?: number;
};

export interface DescriptionSectionChangedBy {
  kind: 'enchantment' | 'level';
  id: string;
  amount: number;
  alterationId?: string;
};
