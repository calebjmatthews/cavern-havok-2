export default interface EquipmentPiece {
  id: string;
  equipmentId: string;
  belongsTo: string;
  acquiredAt: number;
  slotNumber?: number;
  isEphemeral?: boolean;
  level?: number;
  enchantments?: string[];
  artifactExtentCurrent?: number;
  artifactLastApplied?: { chamber: number, round: number };
};