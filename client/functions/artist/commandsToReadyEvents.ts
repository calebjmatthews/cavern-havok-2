import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type { PixiEvent } from "@common/models/pixiEvent";
import random, { genId } from "@common/functions/utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const LAS = LAYERED_ANIMATED_STATES;
const READY_EVENT_DELAY_BASE = 200;
const READY_EVENT_DELAY_VARIANCE = 0.4;

const equipToFrontName: 'equipToFront' = 'equipToFront';
const createAnimatedSpriteName: 'createAnimatedSprite' = 'createAnimatedSprite';
const changeFighterStateName: 'changeFighterState' = 'changeFighterState';

const commandsToReadyEvents = (args: {
  commands: Command[],
  battleState: BattleState
}) => {
  const { commands, battleState } = args;
  const pixiEvents: PixiEvent[] = [];

  commands.sort((a, b) => {
    const fighterA = battleState.fighters[a.fromId];
    const fighterB = battleState.fighters[b.fromId];
    if (!fighterA) throw Error(`sortCommands fighter ID${a.fromId} not found.`);
    if (!fighterB) throw Error(`sortCommands fighter ID${b.fromId} not found.`);

    if (fighterA.speed > fighterB.speed) return -1;
    if (fighterB.speed > fighterA.speed) return 1;
    return fighterA.id > fighterB.id ? -1 : 1;
  }).forEach((command, index) => {
    const delay = (
      ((READY_EVENT_DELAY_BASE * index) - (READY_EVENT_DELAY_VARIANCE / 2))
      + (random() * READY_EVENT_DELAY_VARIANCE)
    );
    const targetsId = command.fromId;
    pixiEvents.push(...[{
      id: genId(),
      functionName: equipToFrontName,
      delay,
      args: { targetsId, pieceId: command.pieceId }
    }, {
      id: genId(),
      functionName: createAnimatedSpriteName,
      delay: 0,
      args: {
        targetsId: command.fromId,
        spriteNames: ['ready_glint0.png', 'ready_glint1.png', 'ready_glint2.png'],
        offsets: [{ x: -9, y: 0 }],
        durations: [10, 6, 6],
        opacities: [0.8],
        durationOverall: 300,
        loop: false
      }
    }, {
      id: genId(),
      functionName: changeFighterStateName,
      delay,
      args: { targetsId, fighterState: LAS.CLENCHING, fighterStateDefault: LAS.CLENCHING }
    }]);
  });

  return pixiEvents;
};

export default commandsToReadyEvents;