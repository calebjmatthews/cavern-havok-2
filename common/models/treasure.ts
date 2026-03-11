export default interface Treasure {
  kind: 'equipment' | 'food' | 'glyph' | 'glyphUnknown' | 'cinders' | 'classCrest' | 'areaKey' | 'none';
  id?: string;
  enchantmentIds?: string[];
  quantity: number;
  isGuaranteed?: boolean;
  nameUnknown?: string;
};