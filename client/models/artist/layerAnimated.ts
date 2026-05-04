export default interface LayerAnimated {
  spriteNames: string[];
  durations?: number[];
  offsets?: { x: number, y: number }[];
  rotations?: number[];
  loop?: boolean;
};