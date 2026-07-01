import type Cycle from "./cycle";

export default interface CycleLayer {
  id: string;
  slot: string;
  layers: { [state: string]: Cycle | Cycle[] };
  zIndex: number;
  isPrimary?: boolean;
  tint?: string;
  untetheredToParent?: boolean;
  heightExplicit?: number;
};