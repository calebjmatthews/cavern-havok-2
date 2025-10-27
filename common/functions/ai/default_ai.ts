import { v4 as uuid } from 'uuid';

import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import equipments from "@common/instances/equipments";
import randomFrom from "../utils/randomFrom";
import getFighterIdsInCoordsSet from "../positioning/getFighterIdsInCoordsSet";

const defaultAi = (args: { battleState: BattleState, userId: string }): Command|null => {
  const { battleState, userId } = args;

  const user = battleState.fighters[userId];
  if (!user) throw Error(`defaultAi error: user ID${userId} not found.`);
  const eqiupmentCanUse = user.getEquipmentCanUse(args);

  const equipmentId = randomFrom(eqiupmentCanUse);
  const equipment = equipments[equipmentId];
  if (!equipment?.getCanTarget) return null;

  const eligibleCoords = equipment.getCanTarget(args);
  const targetId = randomFrom(getFighterIdsInCoordsSet({ battleState, coordsSet: eligibleCoords }));
  const targetFighter = battleState.fighters[targetId];
  if (!targetFighter) throw Error(`defaultAi error: target fighter ID${targetId} not found.`);

  return {
    id: uuid(),
    fromId: user.id,
    equipmentId,
    ...( equipment.targetType === 'id' && { targetId }),
    ...( equipment.targetType === 'coords' && { targetCoords: targetFighter.coords } )
  };
};

export default defaultAi;