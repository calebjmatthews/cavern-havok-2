import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type { PixiEvent } from "@common/models/pixiEvent";
import random, { genId } from "@common/functions/utils/random";
import { EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import equipments from "@common/instances/equipments";

const LAS = LAYERED_ANIMATED_STATES;
const READY_EVENT_DELAY_BASE = 400;
const READY_EVENT_DELAY_VARIANCE = 0.4;

const equipToFrontName: 'equipToFront' = 'equipToFront';
const createAnimatedSpriteName: 'createAnimatedSprite' = 'createAnimatedSprite';
const changeFighterStateName: 'changeFighterState' = 'changeFighterState';

const commandsToReadyEvents = (args: {
  commands: Command[],
  battleState: BattleState,
  delayFromRoot?: number
}) => {
  const { commands, battleState, delayFromRoot: delayFromRootArgs } = args;
  const pixiEvents: PixiEvent[] = [];
  const delayFromRoot = delayFromRootArgs ?? 0;

  commands.sort((a, b) => {
    const fighterA = battleState.fighters[a.fromId];
    const fighterB = battleState.fighters[b.fromId];
    if (!fighterA) throw Error(`sortCommands fighter ID${a.fromId} not found.`);
    if (!fighterB) throw Error(`sortCommands fighter ID${b.fromId} not found.`);

    if (fighterA.speed > fighterB.speed) return -1;
    if (fighterB.speed > fighterA.speed) return 1;
    return fighterA.id > fighterB.id ? -1 : 1;
  }).forEach((command, index) => {
    const b = READY_EVENT_DELAY_BASE;
    const v = READY_EVENT_DELAY_VARIANCE;
    const delay = (
      delayFromRoot + 
      ((b * (index+1)) - (b * v / 2))
      + (random() * b * v)
    );
    const targetsId = command.fromId;
    const fighter = battleState.fighters[command.fromId];
    const equipmentId = [...(fighter?.inventory ?? []), ...(fighter?.equipped ?? [])]
    .filter((p) => p.id === command.pieceId)?.[0]?.equipmentId;
    const equipment = equipments[equipmentId ?? ''];
    const fighterState = equipment?.commandReadyState ?? LAS.CLENCHING;
    // ToDo: nothing.png for defending equipment
    pixiEvents.push(...[{
      id: genId(),
      functionName: equipToFrontName,
      delay,
      args: { targetsId, pieceId: command.pieceId }
    }, {
      id: genId(),
      functionName: createAnimatedSpriteName,
      delay,
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
      args: { targetsId, fighterState, fighterStateDefault: fighterState }
    }]);

    // I.e. So that weapons are not displayed while defending
    if (equipment?.hideMainLayer) {
      const pieceId = [...(fighter?.inventory ?? []), ...(fighter?.equipped ?? [])]
      .filter((piece) => piece.equipmentId === EQUIPMENTS.NOTHING)?.[0]?.id;
      if (pieceId) pixiEvents.push({
        id: genId(),
        functionName: equipToFrontName,
        delay,
        args: { targetsId, pieceId }
      });
    }
  });

  return pixiEvents;
};

export default commandsToReadyEvents;