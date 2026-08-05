export default interface AlterationActive {
  id: string;
  alterationId: string;
  ownedBy: string;
  appliedDuringRound: number;
  extent: number;
};