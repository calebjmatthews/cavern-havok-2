import type Outcome from "./outcome";

export default interface ActionResolved {
  commandId: string;
  delayFromRoot: number;
  outcomes: Outcome[];
  // animations: Animation[]
};