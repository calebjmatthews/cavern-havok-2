export default interface Cycle {
  spriteNames: string[];
  durations?: number[];
  offsets?: { x: number, y: number }[];
  rotations?: number[];
  loop?: boolean;
};