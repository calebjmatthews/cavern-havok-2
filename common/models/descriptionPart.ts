import type RichText from "./richText";

export default interface DescriptionPart {
  kind: 'damage' | 'healing' | 'curse' | 'blessing' | 'giveCurse' | 'giveBlessing' | 'fast' | 'slow'
    | 'defense' | 'chargeCost' | 'chargeUp' | 'healAfterDamage';
  changedBy?: DescriptionPartChangedBy[];
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

export interface DescriptionPartChangedBy {
  kind: 'enchantment' | 'level';
  id: string;
  amount: number;
  alterationId?: string;
};
