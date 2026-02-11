import type BattleState from "./battleState";
import type AlterationActive from "./alterationActive";
import type RichText from "./richText";

export default interface Alteration {
  id: string;
  kind: 'blessing' | 'curse';
  getDescription: (extent?: number) => (RichText | string)[];
  outcomeText?: string;
  getExtent: (args: {
    battleState: BattleState,
    alterationActive: AlterationActive,
    userId?: string | undefined,
    affectedId?: string | undefined
  }) => number | null;
  extentKind?: 'additive' | 'multiplicative' | 'subtractive' | 'divisive';
  appliesDuring: 'usingAction' | 'targetedByAction' | 'roundStart' | 'roundEnd' | 'battleStart';
  declinesOnApplication?: boolean;
  expiresOnApplication?: boolean;
  declinesAtEndOfRound?: boolean;
  irremovable?: boolean;
  isHealing?: boolean;
  isDamage?: boolean;
  defenseAffected?: boolean;
  speedAffected?: boolean;
  modKind?: 'damage' | 'healing' | 'damageOrHealing' | 'defensePersists' | 'obstructionHealth'
    | 'areasOfEffect' | 'creationHealth' | 'regenAlteration' | 'rodRange' | 'rodChargeCost' | 'curse'
    | 'blessing' | 'move' | 'canTarget' | 'mustTarget' | 'healingDamages' | 'reviveWhenDowned'
    | 'ignoreCurse';
  blessing?: string;
  curse?: string;
};