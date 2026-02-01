import type BattleState from "./battleState";
import type Outcome from "./outcome";
import type { GetActionsArgs } from "./equipment";
import type { ACTION_PRIORITIES } from "@common/enums";
import { genId } from "@common/functions/utils/random";

export default class Action {
  id: string = '';
  priority?: ACTION_PRIORITIES;
  userId: string = '';
  fromCommand: string = '';
  pieceId: string = '';
  targetId?: string;
  targetCoords?: [number, number];
  getOutcomes: (args: {
    battleState: BattleState;
    userId: string;
    target?: [number, number];
  }) => Outcome[] = () => [];

  constructor(args: SCConstructorArgs) {
    const { command, priority, getOutcomes } = args;
    const { pieceId, targetId, targetCoords } = command;
    this.priority = priority;
    this.id = genId();
    this.userId = command.fromId;
    this.fromCommand = command.id;
    this.pieceId = pieceId;
    this.targetId = targetId;
    this.targetCoords = targetCoords;
    this.getOutcomes = getOutcomes;
  };
};

type SCConstructorArgs = GetActionsArgs & {
  priority?: ACTION_PRIORITIES;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[];
};

export interface GetOutcomesArgs {
  battleState: BattleState;
  userId: string;
  target?: [number, number];
}