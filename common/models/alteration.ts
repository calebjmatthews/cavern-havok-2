import type { ACTION_PRIORITIES } from "@common/enums";
import type BattleState from "./battleState";
import type AlterationActive from "./alterationActive";

export default interface Alteration {
  id: string;
  kind: 'blessing' | 'curse';
  getExtent: (args: {
    battleState: BattleState,
    alterationActive: AlterationActive,
    userId?: string | undefined,
    affectedId?: string | undefined
  }) => number | null;
  extentKind?: 'additive' | 'multiplicative';
  appliesDuring: ACTION_PRIORITIES | 'usingAction' | 'targetedByAction' | 'roundBeginning' | 'roundEnd';
  declinesOnApplication?: boolean;
  expiresOnApplication?: boolean;
  isHealing?: boolean;
  isDamage?: boolean;
  defenseAffected?: boolean;
  speedAffected?: boolean;
  modKind?: 'damage' | 'healing' | 'defensePersists' | 'obstructionHealth' | 'areasOfEffect'
    | 'creationHealth' | 'regenAlteration' | 'rodRange' | 'rodChargeCost' | 'curse' | 'blessing'
    | 'move' | 'canTarget' | 'mustTarget' | 'healingDamages' | 'reviveWhenDowned' | 'ignoreCurse';
};