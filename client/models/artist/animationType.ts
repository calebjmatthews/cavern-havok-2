export default interface AnimationType {
  id: string;
  duration: number;
  interval?: number;
  getPosition?: (initial: { x: number, y: number }, elapsed: number) => { x: number, y: number };
};