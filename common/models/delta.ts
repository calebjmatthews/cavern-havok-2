import type Effect from "./effect";

export default interface Delta {
  id: string;
  round: number;
  commandId: string;
  userId: string;
  effects: Effect[];
};