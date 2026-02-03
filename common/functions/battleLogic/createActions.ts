import type { ACTION_PRIORITIES } from "@common/enums";
import type { GetActionsArgs } from "@common/models/equipment";
import type Outcome from "@common/models/outcome";
import type { GetOutcomesArgs } from "@common/models/action";
import Action from "@common/models/action";

const createActions = (args: CreateActionsArgs) => (
  [new Action({ ...args, ...args.command })]
);

type CreateActionsArgs = GetActionsArgs & {
  priority?: ACTION_PRIORITIES;
  duration: number;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[];
};

export default createActions