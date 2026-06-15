import type BattleState from "./battleState";
import type Outcome from "./outcome";
import type ActionResolved from "./actionResolved";
import type { GetActionsArgs } from "./equipment";
import type { PixiEvent } from "@common/models/pixiEvent";
import type { ACTION_PRIORITIES } from "@common/enums";
import { genId } from "@common/functions/utils/random";

export default class Action {
  id: string = '';
  index: number = 0;
  priority?: ACTION_PRIORITIES;
  userId: string = '';
  fromCommand: string = '';
  pieceId: string = '';
  targetId?: string;
  targetCoords?: [number, number];
  givesDefenseOutcome?: boolean;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[] = () => [];
  getPixiEvents?: (actionResolved: ActionResolved) => { pixiEvents: PixiEvent[]; duration: number; };

  constructor(args: ActionConstructorArgs) {
    const { command, priority, index, getOutcomes } = args;
    const { pieceId, targetId, targetCoords } = command;
    this.priority = priority;
    this.id = genId();
    this.index = index ?? 0;
    this.userId = command.fromId;
    this.fromCommand = command.id;
    this.pieceId = pieceId;
    this.targetId = targetId;
    this.targetCoords = targetCoords;
    this.getOutcomes = getOutcomes;
  };
};

type ActionConstructorArgs = GetActionsArgs & {
  priority?: ACTION_PRIORITIES;
  index?: number;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[];
};

export interface GetOutcomesArgs {
  battleState: BattleState;
  userId: string;
  pieceId: string;
  target?: [number, number];
};