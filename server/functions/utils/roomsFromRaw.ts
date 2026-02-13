import type Room from "@common/models/room";

const roomsFromRaw = (roomsRaw: { [roomId: string] : any }) => {
  const rooms: { [roomId: string] : Room } = {}

  Object.values(roomsRaw).forEach((roomRaw) => {
    const room: Room = { ...roomRaw };
    rooms[room.id] = room;
  });

  return rooms;
};

export default roomsFromRaw;