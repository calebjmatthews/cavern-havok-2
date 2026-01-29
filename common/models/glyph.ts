import type { ALTERATIONS } from "@common/enums";

export default interface Glyph {
  id: string;
  name: string;
  kind: 'simple';
  description: string;
  damage?: number;
  healing?: number;
  healToPercentage?: number;
  healthMax?: number;
  speed?: number;
  blessing?: { alterationId: ALTERATIONS, extent: number };
};