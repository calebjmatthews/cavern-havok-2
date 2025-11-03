import type BattleState from "@common/models/battleState";
import type Equipment from "@common/models/equipment";
import type Fighter from "@common/models/fighter";
import randomFrom from "../utils/randomFrom";
import getOccupantById from "./getOccupantById";

const selectIdToTarget = (args: {
  equipment: Equipment,
  battleState: BattleState,
  user: Fighter,
  occupantIds: string[]
}) => {
  const { equipment, battleState, user, occupantIds } = args;

  if (occupantIds.length === 0) return null;

  let idsPreferred = [...occupantIds];
  if (equipment.targetPreferred === "ally") {
    idsPreferred = idsPreferred.filter((occupantId) => {
      const occupant = getOccupantById({ battleState, occupantId });
      return (occupant?.side === user.side && (occupant?.health || -1) > 0);
    });
  }
  else if (equipment.targetPreferred === "enemy") {
    idsPreferred = idsPreferred.filter((occupantId) => {
      const occupant = getOccupantById({ battleState, occupantId });
      return (occupant?.side !== user.side && (occupant?.health || -1) > 0);
    });
  }
  
  if (idsPreferred.length === 0) return null;

  return randomFrom(idsPreferred);
};

export default selectIdToTarget;