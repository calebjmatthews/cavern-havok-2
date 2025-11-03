import { v4 as uuid } from 'uuid';

import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Equipment from '@common/models/equipment';
import type Fighter from '@common/models/fighter';
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
      const targetId = selectIdToTarget({ equipment, battleState, user, fighterIds });
      if (!targetId) return false;
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

const selectIdToTarget = (args: {
  equipment: Equipment,
  battleState: BattleState,
  user: Fighter,
  fighterIds: string[]
}) => {
  const { equipment, battleState, user, fighterIds } = args;

  if (fighterIds.length === 0) return null;

  let idsPreferred = [...fighterIds];
  if (equipment.targetPreferred === 'ally') {
    idsPreferred = idsPreferred.filter((fighterId) => {
      const fighter = battleState.fighters[fighterId];
      return (fighter?.side === user.side && (fighter?.health || -1) > 0);
    });
  }
  else if (equipment.targetPreferred === 'enemy') {
    idsPreferred = idsPreferred.filter((fighterId) => {
      const fighter = battleState.fighters[fighterId];
      return (fighter?.side !== user.side && (fighter?.health || -1) > 0);
    });
  };
  
  if (idsPreferred.length === 0) return null;

  return randomFrom(idsPreferred);
};

export default defaultAi;