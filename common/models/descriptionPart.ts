import type RichText from "./richText";

type DescriptionPartAppliesTo = (
  'user' | 'userAndAllies' | 'target' | 'front' | 'column'| 'frontColumn' | 'enemyAll'
  | 'backTwoColumns' | 'enemiesInUsersRow' | 'inFrontOfUser'
);
export type DescriptionPartKind = (
  'damage' | 'healing' | 'curse' | 'blessing' | 'giveCurse' | 'giveBlessing' | 'fast' | 'slow'
  | 'defense' | 'chargeCost' | 'chargeUp' | 'healAfterDamage'
);

export default interface DescriptionPart {
  kind: DescriptionPartKind
  changedBy?: DescriptionPartChangedBy[];
  appliesTo?: DescriptionPartAppliesTo;
  range?: [number, number];
  extent?: number;
  suffix?: RichText | string;
  alterationId?: string;
  levelMult?: number;
  elements?: string[];
};

export interface DescriptionSection {
  subSections: {
    extent?: number;
    kind: DescriptionPartKind;
    alterationId?: string;
    elements?: string[];
  }[];
  appliesTo?: DescriptionPartAppliesTo;
  changedBy?: DescriptionPartChangedBy[];
  range?: [number, number];
  suffix?: RichText | string;
  levelMult?: number;
};

export interface DescriptionPartChangedBy {
  kind: 'enchantment' | 'level';
  id: string;
  amount: number;
  alterationId?: string;
};
