import type BattleState from "@common/models/battleState";

const getFighterIdFromCoords = (args: {
  battleState: BattleState,
  coords: [number, number]
}) => {
  const { battleState, coords } = args;

  const fighters = Object.values(battleState.fighters);
  for (let index = 0; index < fighters.length; index++) {
    const fighter = fighters[index];
    if (fighter?.coords[0] === coords[0] && fighter?.coords[1] === coords[1]) {
      return fighter.id;
    };
  };

  return undefined;
};

export default getFighterIdFromCoords;