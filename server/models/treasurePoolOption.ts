import type Treasure from "@common/models/treasure";

export interface TreasurePoolOption extends Treasure {
  weight?: number;
};