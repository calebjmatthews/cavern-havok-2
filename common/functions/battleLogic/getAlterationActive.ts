import type BattleState from "@common/models/battleState";

const getAlterationActive = (args: {
  battleState: BattleState,
  occupantId: string,
  alterationId: string
}) => {
  const { battleState, occupantId, alterationId } = args;
  return Object.values(battleState.alterationsActive).find((aa) => (
    aa.alterationId === alterationId && aa.ownedBy === occupantId
  ));
};

export default getAlterationActive;