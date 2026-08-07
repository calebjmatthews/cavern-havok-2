import type BattleState from "./battleState";
import type AlterationActive from "./alterationActive";
import type RichText from "./richText";
import type Outcome from "./outcome";

export default interface Alteration {
  id: string;
  kind: 'blessing' | 'curse';
  getDescription: (extent?: number) => (RichText | string)[];
  outcomeText?: string;
  getExtent: (args: {
    battleState: BattleState,
    alterationActive: AlterationActive,
    userId?: string | undefined,
    affectedId?: string | undefined,
    outcome?: Outcome
  }) => number | null;
  extentKind?: 'additive' | 'multiplicative' | 'subtractive' | 'divisive';
  appliesDuring: 'usingAction' | 'targetedByAction' | 'roundStart' | 'roundEnd' | 'battleStart';
  declinesOnApplication?: boolean;
  expiresOnApplication?: boolean;
  declinesAtEndOfRound?: boolean;
  irremovable?: boolean;
  isHealing?: boolean;
  isDamage?: boolean;
  speedAffected?: boolean;
  modKind?: 'damage' | 'healing' | 'damageOrHealing' | 'defense' | 'defenseOrHealing' | 'defensePersists'
    | 'obstructionHealth' | 'areasOfEffect' | 'creationHealth' | 'regenAlteration' | 'rodRange'
    | 'rodChargeCost' | 'curse' | 'blessing' | 'move' | 'canTarget' | 'mustTarget' | 'healingDamages'
    | 'reviveWhenDowned' | 'ignoreCurse';
  blessing?: string;
  curse?: string;
};