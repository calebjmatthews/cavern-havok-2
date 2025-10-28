import type Outcome from "./outcome";

export default interface CommandResolved {
  commandId: string;
  delayFromRoot: number;
  outcomes: Outcome[];
  // animations: Animation[]
};