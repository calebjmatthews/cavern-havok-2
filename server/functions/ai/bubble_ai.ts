import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import equipments from "@common/instances/equipments";
import getOccupantIdsInCoordsSet from "@common/functions/positioning/getOccupantIdsInCoordsSet";
import selectIdToTarget from '@common/functions/positioning/selectIdToTarget';
import defaultAi from './default_ai';
import { genId } from "@common/functions/utils/random";
import { EQUIPMENTS } from "@common/enums";
const EQU = EQUIPMENTS;

const bubbleAi = (args: { battleState: BattleState, userId: string }): Command|null => {
  const { battleState, userId } = args;

  const user = battleState.fighters[userId];
  if (!user) throw Error(`bubbleAi error: user ID${userId} not found.`);
  const eqiupmentCanUse = user.getEquipmentCanUse(args);

  const equipmentIncludesGoodbye = eqiupmentCanUse.some((piece) => piece.equipmentId === EQU.GOODBYE);
  const healthBelowHalf = Math.floor(user.health / user.healthMax) <= 0.5;
  
  if (equipmentIncludesGoodbye && healthBelowHalf) {
    const equipment = equipments[EQU.GOODBYE];
    if (!equipment?.getCanTarget) throw Error("bubbleAi error: Missing GOODBYE Equipment.");
    const eligibleCoords = equipment.getCanTarget(args);
    const occupantIds = getOccupantIdsInCoordsSet({ battleState, coordsSet: eligibleCoords });
    const targetId = selectIdToTarget({ equipment, battleState, user, occupantIds });
    const pieceId = user.equipped.find((piece) => piece.equipmentId === EQU.GOODBYE)?.id;
    if (targetId && pieceId) {
      return { id: genId(), fromId: user.id, pieceId, targetId };
    };
  };

  const equipmentWithoutGoodbye = eqiupmentCanUse.filter((piece) => piece.equipmentId !== EQU.GOODBYE);
  return defaultAi({ ...args, equipmentFromArgs: equipmentWithoutGoodbye });
};

export default bubbleAi;