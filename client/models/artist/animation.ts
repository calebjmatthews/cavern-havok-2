export default interface Animation {
  id: string;
  type: string;
  startedAt: number;
  expiresAs: number;
  targets: string;
  positionInitial: { x: number, y: number };
};