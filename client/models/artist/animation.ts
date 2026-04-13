export default interface Animation {
  id: string;
  type: string;
  startedAt: number;
  lastTickAt: number;
  expiresAt: number;
  targets: string;
  positionInitial: { x: number, y: number };
};