import type Command from "./command";
import type Outcome from "./outcome";
import type { ACTION_PRIORITIES } from "@common/enums";

export default interface Action {
  priority?: ACTION_PRIORITIES;
  commandId: string;
  command?: Command;
  outcomes: Outcome[];
};