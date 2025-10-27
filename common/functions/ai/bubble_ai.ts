import { v4 as uuid } from 'uuid';

import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import equipments from "@common/instances/equipments";
import randomFrom from "../utils/randomFrom";
import getFighterIdsInCoordsSet from "../positioning/getFighterIdsInCoordsSet";
import { EQUIPMENTS } from "@common/enums";
const EQU = EQUIPMENTS;

const bubbleAi = (args: { battleState: BattleState, userId: string }): Command|null => {
  const { battleState, userId } = args;

  const user = battleState.fighters[userId];
  if (!user) throw Error(`bubbleAi error: user ID${userId} not found.`);
  const eqiupmentCanUse = user.getEquipmentCanUse(args);

  const equipmentIdsWithoutGoodbye = eqiupmentCanUse.filter((e) => e !== EQU.GOODBYE);
  const equipmentIncludesGoodbye = eqiupmentCanUse.some((e) => e === EQU.GOODBYE);
  const healthBelowHalf = Math.floor(user.health / user.healthMax) <= 0.5;
  const equipmentId = (healthBelowHalf && equipmentIncludesGoodbye)
    ? EQU.GOODBYE
    : randomFrom(equipmentIdsWithoutGoodbye);
  const equipment = equipments[equipmentId];
  if (!equipment?.getCanTarget) return null;

  const eligibleCoords = equipment.getCanTarget(args);
  const targeting: { targetId?: string; targetCoords?: [number, number] } = {};
  if (equipment.targetType === 'id') {
    const targetId = randomFrom(getFighterIdsInCoordsSet({ battleState, coordsSet: eligibleCoords }));
    const targetFighter = battleState.fighters[targetId];
    if (!targetFighter) throw Error(`bubbleAi error: target fighter ID${targetId} not found.`);
    targeting.targetId = targetId;
  }
  else {
    targeting.targetCoords = randomFrom(eligibleCoords);
  }

  return {
    id: uuid(),
    fromId: user.id,
    equipmentId,
    ...targeting
  };
};

export default bubbleAi;