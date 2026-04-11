export default interface AnimationType {
  id: string;
  duration: number;
  getPosition?: (initial: { x: number, y: number }, elapsed: number) => { x: number, y: number };
};