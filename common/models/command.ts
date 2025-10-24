export default interface Command {
  id: string;
  fromId: string;
  // fromType: COMMAND_FROM
  equipmentId: string;
  targetId?: number;
  targetCoords?: number;
  // targetType: COMMAND_TARGETS
};