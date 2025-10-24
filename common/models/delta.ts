import type Effect from "./effect";

export default interface Delta {
  id: string;
  commandId: string;
  userId: string;
  effects: Effect[];
};