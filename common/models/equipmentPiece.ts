export default interface EquipmentPiece {
  id: string;
  equipmentId: string;
  belongsTo: string;
  acquiredAt: number;
  isEphemeral?: boolean;
  level?: number;
  enchantments?: string[];
};