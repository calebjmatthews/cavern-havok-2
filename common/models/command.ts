export default interface Command {
  id: string;
  fromId: string;
  // fromType: COMMAND_FROM
  pieceId: string;
  targetId?: string;
  targetCoords?: [number, number];
  // targetType: COMMAND_TARGETS
};