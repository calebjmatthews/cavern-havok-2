import type Artist from "../artist";

export interface EquipToFrontArgs {
  artist?: Artist,
  fighterId: string,
  pieceId: string,
};

const equipToFront = (args: EquipToFrontArgs) => {
  const { artist, fighterId, pieceId } = args;
  let equipOrder = [...artist?.fighterEquips[fighterId] ?? []];
  if (!equipOrder.length || !artist) throw Error('Missing data in equipToFront');

  equipOrder = equipOrder.filter((fe) => fe !== pieceId);
  equipOrder.unshift(pieceId);
  artist.fighterEquips[fighterId] = equipOrder;
};

export default equipToFront;