import type Outcome from "./outcome";

export default interface SubCommandResolved {
  commandId: string;
  delayFromRoot: number;
  outcomes: Outcome[];
  // animations: Animation[]
};