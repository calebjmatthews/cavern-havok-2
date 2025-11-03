import type BattleState from "@common/models/battleState";
import type Equipment from "@common/models/equipment";
import type Fighter from "@common/models/fighter";
import randomFrom from "../utils/randomFrom";

const selectIdToTarget = (args: {
  equipment: Equipment,
  battleState: BattleState,
  user: Fighter,
  fighterIds: string[]
}) => {
  const { equipment, battleState, user, fighterIds } = args;

  if (fighterIds.length === 0) return null;

  let idsPreferred = [...fighterIds];
  if (equipment.targetPreferred === "ally") {
    idsPreferred = idsPreferred.filter((fighterId) => {
      const fighter = battleState.fighters[fighterId];
      return (fighter?.side === user.side && (fighter?.health || -1) > 0);
    });
  }
  else if (equipment.targetPreferred === "enemy") {
    idsPreferred = idsPreferred.filter((fighterId) => {
      const fighter = battleState.fighters[fighterId];
      return (fighter?.side !== user.side && (fighter?.health || -1) > 0);
    });
  };
  
  if (idsPreferred.length === 0) return null;

  return randomFrom(idsPreferred);
};

export default selectIdToTarget;