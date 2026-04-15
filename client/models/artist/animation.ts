export default interface Animation {
  id: string;
  type: string;
  startedAt: number;
  lastTickAt: number;
  expiresAt: number;
  targets: string;
  ix?: number;
  iy?: number;
  px?: number;
  py?: number;
  vx?: number;
  vy?: number;
};