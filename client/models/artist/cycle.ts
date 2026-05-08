export default interface Cycle {
  spriteNames: string[];
  durations?: number[];
  offsets?: { x: number, y: number }[];
  angle?: number;
  loop?: boolean;
};