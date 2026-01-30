import type Adventure from "@server/models/adventure/adventure";
import accountsFromRaw from "./accountsFromRaw";

const adventuresFromRaw = (adventuresRaw: { [adventureId: string] : any }) => {
  const adventures: { [roomId: string] : Adventure } = {}

  Object.values(adventuresRaw).forEach((adventureRaw) => {
    const adventure: Adventure = { ...adventureRaw, accounts: accountsFromRaw(adventureRaw.accounts) };
    adventures[adventure.id] = adventure;
  });

  return adventures;
};

export default adventuresFromRaw;