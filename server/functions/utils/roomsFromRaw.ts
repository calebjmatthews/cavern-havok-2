import type Room from "@common/models/room";
import accountsFromRaw from "./accountsFromRaw";

const roomsFromRaw = (roomsRaw: { [roomId: string] : any }) => {
  const rooms: { [roomId: string] : Room } = {}

  Object.values(roomsRaw).forEach((roomRaw) => {
    const room: Room = { ...roomRaw, accounts: accountsFromRaw(roomRaw.accounts) };
    rooms[room.id] = room;
  });

  return rooms;
};

export default roomsFromRaw;