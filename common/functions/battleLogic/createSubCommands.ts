import type { ACTION_PRIORITIES } from "@common/enums";
import type { GetSubCommandsArgs } from "@common/models/equipment";
import type Outcome from "@common/models/outcome";
import type { GetOutcomesArgs } from "@common/models/subCommand";
import SubCommand from "@common/models/subCommand";

const createSubCommands = (args: CreateSubCommandsArgs) => (
  [new SubCommand({ ...args, ...args.command })]
);

type CreateSubCommandsArgs = GetSubCommandsArgs & {
  priority?: ACTION_PRIORITIES;
  duration: number
  getOutcomes: (args: GetOutcomesArgs) => Outcome[]
};

export default createSubCommands