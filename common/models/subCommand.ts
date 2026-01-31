import type BattleState from "./battleState";
import type { GetSubCommandsArgs } from "./equipment";
import type Outcome from "./outcome";
import type { ACTION_PRIORITIES } from "@common/enums";
import { v4 as uuid } from 'uuid';

export default class SubCommand {
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
    this.id = uuid();
    this.userId = command.fromId;
    this.fromCommand = command.id;
    this.pieceId = pieceId;
    this.targetId = targetId;
    this.targetCoords = targetCoords;
    this.getOutcomes = getOutcomes;
  };
};

type SCConstructorArgs = GetSubCommandsArgs & {
  priority?: ACTION_PRIORITIES;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[];
};

export interface GetOutcomesArgs {
  battleState: BattleState;
  userId: string;
  target?: [number, number];
}