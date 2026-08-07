import type BattleState from "./battleState";
import type Outcome from "./outcome";
import type EquipmentPiece from "./equipmentPiece";

export default interface StatChange {
  stat: 'health' | 'speed' | 'charm' | 'chestChoices' | 'treasureChoices' | 'rarityMult';
  getExtent: (args: {
    piece: EquipmentPiece,
    battleState?: BattleState,
    userId?: string | undefined,
    affectedId?: string | undefined,
    outcome?: Outcome,
  }) => number | null;
  extentKind: 'additive' | 'multiplicative' | 'subtractive' | 'divisive';
  getExtentDuring: (
    'usingAction' | 'targetedByAction' | 'roundStart' | 'roundEnd' | 'battleStart' | 'battleEnd' | 'equip'
  );
};