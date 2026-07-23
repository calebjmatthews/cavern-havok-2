export default interface EquipmentPiece {
  id: string;
  equipmentId: string;
  belongsTo: string;
  acquiredAt: number;
  mainSlot?: number;
  isEphemeral?: boolean;
  level?: number;
  enchantments?: string[];
};