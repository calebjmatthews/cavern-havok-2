import type { ALTERATIONS } from "@common/enums";

export default interface Food {
  id: string;
  name: string;
  description: string;
  damage?: number;
  healing?: number;
  healToPercentage?: number;
  healthMax?: number;
  speed?: number;
  blessing?: { alterationId: ALTERATIONS, extent: number };
};