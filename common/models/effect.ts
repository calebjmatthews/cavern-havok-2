export default interface Effect {
  fighterAffectedId: string;
  // duration: number; to match UI changes up with animations
  damage?: number;
  healing?: number;
  defense?: number;
  charge?: number;
  moveTo?: [number, number];
}