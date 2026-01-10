import type Obstacle from '@common/models/obstacle';
import type Creation from '@common/models/creation';
import type BattleState from '@common/models/battleState';
import type Command from '@common/models/command';
import Fighter from "@common/models/fighter";
import type AlterationActive from '@common/models/alterationActive';

const cloneBattleState = (battleState: BattleState): BattleState => {
  const fighters: { [id: string] : Fighter } = {};
  Object.values(battleState.fighters).forEach((f) => fighters[f.id] = new Fighter(f));
  const obstacles: { [id: string] : Obstacle } = {};
  Object.values(battleState.obstacles).forEach((o) => obstacles[o.id] = { ...o });
  const creations: { [id: string] : Creation } = {};
  Object.values(battleState.creations).forEach((c) => creations[c.id] = { ...c });
  const commandsPending: { [id: string] : Command } = {};
  Object.values(battleState.commandsPending).forEach((c) => commandsPending[c.id] = { ...c });
  const alterationsActive: { [id: string] : AlterationActive } = {};
  Object.values(battleState.alterationsActive).forEach((a) => alterationsActive[a.id] = { ...a });
  return { ...battleState, fighters, obstacles, creations, commandsPending, alterationsActive };
};

export default cloneBattleState;