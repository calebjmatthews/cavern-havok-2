import type Outcome from "@common/models/outcome";
import type { GetActionsArgs } from "@common/models/equipment";
import type { GetOutcomesArgs } from "@common/models/action";
import type { ACTION_PRIORITIES } from "@common/enums";
import Action from "@common/models/action";

// ToDo: Apply fast + slow enchantment mods here
// ToDo: Apply defense enchantment mods here
const createActions = (args: CreateActionsArgs) => (
  [new Action({ ...args, ...args.command })]
);

type CreateActionsArgs = GetActionsArgs & {
  priority?: ACTION_PRIORITIES;
  duration: number;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[];
};

export default createActions