export default interface Animation {
  id: string;
  type: string;
  startedAt: number;
  expiresAt: number;
  targets: string;
  lastTickAt?: number;
  ix?: number;
  iy?: number;
  px?: number;
  py?: number;
  vx?: number;
  vy?: number;
};