export default interface Room {
  id: string;
  createdAt: number;
  createdById: string;
  joinedByIds: string[];
};