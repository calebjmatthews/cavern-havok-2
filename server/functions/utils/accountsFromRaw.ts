import type Account from "@common/models/account";
import Character from "@common/models/character";

const accountsFromRaw = (accountsRaw: { [accountId: string] : any }) => {
  const accounts: { [accountId: string] : Account } = {}

  Object.values(accountsRaw).forEach((accountRaw) => {
    const character = accountRaw?.character ? new Character(accountRaw.character) : undefined;
    accounts[accountRaw.id] = { ...accountRaw, character };
  });

  return accounts;
};

export default accountsFromRaw;