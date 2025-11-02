import type { ACTION_PRIORITIES } from "@common/enums";
import type BattleState from "./battleState";

export default interface Alteration {
  id: string;
  getExtent: (args: { battleState: BattleState, fighterId: string }) => number | null;
  extentKind: 'additive' | 'multiplicative';
  appliesDuring: ACTION_PRIORITIES | 'usingAction' | 'targetedAction';
  declinesOnApplication?: boolean;
  expiresOnApplication?: boolean;
  health?: number;
  defense?: number;
  speed?: number;
  modKind?: 'damage' | 'healing' | 'defensePersists' | 'obstructionHealth' | 'areasOfEffect'
    | 'creationHealth' | 'regenAlteration' | 'rodRange' | 'rodChargeCost' | 'curse' | 'blessing'
    | 'move' | 'canTarget' | 'mustTarget' | 'healingDamages' | 'reviveWhenDowned' | 'ignoreCurse';
};