import type Chest from "@common/models/chest";
import type { TreasuresApplying } from "@common/models/treasuresApplying";

export interface TreasureState {
  chestsToOpen: { [accountId: string] : Chest[] };
  treasuresApplying: TreasuresApplying;
};