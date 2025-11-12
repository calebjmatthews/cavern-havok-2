export default interface Treasure {
  kind: 'equipment' | 'food' | 'cinders' | 'none';
  id?: string;
  quantity: number;
};