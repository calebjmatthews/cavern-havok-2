import { v4 as uuid } from "uuid";

import type Account from "@common/models/account";
import type Fighter from "@common/models/fighter";
import type Encounter from "./encounter";
import type EncounterPeaceful from "./encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type MessageServer from "@common/communicator/message_server";
import encounterEmpty from "@server/instances/encounters/encounterEmpty";
import getChamberMaker from '@server/instances/adventures/chamberMakers';
import getTreasureMaker from '@server/instances/adventures/treasureMakers';
import { ADVENTURE_KINDS } from "@common/enums";

export default class Adventure implements AdventureInterface {
  id: string = '';
  kindId: ADVENTURE_KINDS = ADVENTURE_KINDS.KIND_MISSING;
  accounts: { [id: string] : Account } = {};
  fighters: { [id: string] : Fighter } = {};
  chamberCurrent: Encounter | EncounterPeaceful = encounterEmpty;
  chamberKindsFinished: string[] = [];
  chamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful = () => encounterEmpty;
  treasureMaker: (adventure: Adventure) => Treasure[] = () => ([]);
  sendMessage?: (message: MessageServer) => void;

  constructor(adventure: AdventureInterface) {
    Object.assign(this, adventure);
  };

  attachSendMessage(sendMessageFunction: (message: MessageServer) => void) {
    this.sendMessage = sendMessageFunction;
  };
};

export const getAdventure = (args: {
  adventureKindId: ADVENTURE_KINDS,
  accounts: { [id: string] : Account }
}) => {
  const { adventureKindId, accounts } =  args;

  const chamberMaker = getChamberMaker(adventureKindId);
  const treasureMaker = getTreasureMaker(adventureKindId);
  const adventure = new Adventure({
    id: uuid(),
    kindId: adventureKindId,
    accounts,
    fighters: {},
    chamberCurrent: encounterEmpty,
    chamberKindsFinished: [],
    chamberMaker,
    treasureMaker
  });

  const fighters: { [fighterId: string] : Fighter } = {};
  Object.values(accounts).forEach((account) => {
    const fighter = account.character?.toFighter({
      name: account.name || "",
      ownedBy: account.id,
      controlledBy: account.id,
      side: 'A',
      coords: [Object.keys(fighters).length, -1]
    });
    if (fighter) fighters[fighter.id] = fighter;
  });

  return adventure;
};

interface AdventureInterface {
  id: string;
  kindId: ADVENTURE_KINDS;
  accounts: { [id: string] : Account };
  fighters: { [id: string] : Fighter };
  chamberCurrent: Encounter | EncounterPeaceful;
  chamberKindsFinished: string[];
  chamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful;
  treasureMaker: (adventure: Adventure) => Treasure[];
};