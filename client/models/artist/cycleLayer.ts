import type Cycle from "./cycle";

export default interface CycleLayer {
  layers: { [state: string]: Cycle };
  zIndex: number;
  isPrimary?: boolean;
  tint?: string;
  untetheredToParent?: boolean;
};