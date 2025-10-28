import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";

const sortCommands = (args: {
  battleState: BattleState,
  commands: Command[]
}) => {
  const { battleState, commands } = args;

  return [...commands].sort((a, b) => {
    const fighterA = battleState.fighters[a.fromId];
    const fighterB = battleState.fighters[b.fromId];
    if (!fighterA) throw Error(`sortCommands fighter ID${a.fromId} not found.`);
    if (!fighterB) throw Error(`sortCommands fighter ID${b.fromId} not found.`);

    if (fighterA.speed > fighterB.speed) return -1;
    if (fighterB.speed > fighterA.speed) return 1;
    return Math.random() -0.5;
  });
};

export default sortCommands;