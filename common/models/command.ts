export default interface Command {
  id: string;
  fromId: string;
  // fromType: COMMAND_FROM
  equipmentId: string;
  targetId?: string;
  targetCoords?: [number, number];
  // targetType: COMMAND_TARGETS
};