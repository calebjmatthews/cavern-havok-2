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

  const equipmentsValidTarget = eqiupmentCanUse.map((equipmentId) => {
    const equipment = equipments[equipmentId];
    if (!equipment?.getCanTarget) return false;

    const eligibleCoords = equipment.getCanTarget(args);
    const targeting: { targetId?: string; targetCoords?: [number, number] } = {};
    if (equipment.targetType === 'id') {
      const fighterIds = getFighterIdsInCoordsSet({ battleState, coordsSet: eligibleCoords });
      if (fighterIds.length === 0) return false;
      const targetId = randomFrom(fighterIds);
      const targetFighter = battleState.fighters[targetId];
      if (!targetFighter) throw Error(`defaultAi error: target fighter ID${targetId} not found.`);
      targeting.targetId = targetId;
    }
    else {
      targeting.targetCoords = randomFrom(eligibleCoords);
    }

    return { equipmentId, targeting };
  }).filter((evt) => evt !== false);
  
  const { equipmentId, targeting } = randomFrom(equipmentsValidTarget);

  return {
    id: uuid(),
    fromId: user.id,
    equipmentId,
    ...targeting
  };
};

export default defaultAi;