import type EquipmentPiece from "./equipmentPiece";

export default interface Treasure {
  kind: 'equipment' | 'food' | 'glyph' | 'glyphUnknown' | 'cinders' | 'classCrest' | 'areaKey' | 'none';
  id?: string;
  piece?: EquipmentPiece;
  quantity: number;
  isGuaranteed?: boolean;
  nameUnknown?: string;
};