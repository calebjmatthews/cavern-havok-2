import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type EquipmentPiece from "@common/models/equipmentPiece";
import equipments from "@common/instances/equipments";
import randomFrom from "@common/functions/utils/randomFrom";
import getOccupantIdsInCoordsSet from "@common/functions/positioning/getOccupantIdsInCoordsSet";
import selectIdToTarget from "@common/functions/positioning/selectIdToTarget";
import { genId } from "@common/functions/utils/random";

const defaultAi = (args: {
  battleState: BattleState,
  userId: string,
  equipmentFromArgs?: EquipmentPiece[]
}): Command|null => {
  const { battleState, userId, equipmentFromArgs } = args;

  const user = battleState.fighters[userId];
  if (!user) throw Error(`defaultAi error: user ID${userId} not found.`);
  const equipmentCanUse = user.getEquipmentCanUse(args);

  const equipmentsValidTarget = (equipmentFromArgs ?? equipmentCanUse)
  .map((piece: EquipmentPiece) => {
    const equipment = equipments[piece.equipmentId];
    if (!equipment?.getCanTarget) return null;

    const eligibleCoords = equipment.getCanTarget(args);
    const targeting: { targetId?: string; targetCoords?: [number, number] } = {};
    if (equipment.targetType === "id") {
      const occupantIds = getOccupantIdsInCoordsSet({ battleState, coordsSet: eligibleCoords });
      const targetId = selectIdToTarget({ equipment, battleState, user, occupantIds });
      if (!targetId) return null;
      targeting.targetId = targetId;
    }
    else {
      targeting.targetCoords = randomFrom(eligibleCoords);
    }

    return { pieceId: piece.id, targeting };
  }).filter((evt) => evt !== null);
  
  console.log(`equipmentsValidTarget`, equipmentsValidTarget);
  
  const { pieceId, targeting } = randomFrom(equipmentsValidTarget);

  return {
    id: genId(),
    fromId: user.id,
    pieceId,
    ...targeting
  };
};

export default defaultAi;