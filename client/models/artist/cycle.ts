export default interface Cycle {
  spriteNames: string[];
  durations?: number[];
  offsets?: { x: number, y: number }[];
  angles?: number[];
  loop?: boolean;
};