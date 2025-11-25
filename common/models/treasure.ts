export default interface Treasure {
  kind: 'equipment' | 'food' | 'cinders' | 'classCrest' | 'areaKey' | 'none';
  id?: string;
  quantity: number;
  isGuaranteed?: boolean;
};