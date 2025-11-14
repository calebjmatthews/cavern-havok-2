import { v4 as uuid } from 'uuid';

import type MessageClient from "@common/communicator/message_client";
import type Account from '@common/models/account';
import type Room from '@common/models/room';
import type Adventure from './adventure';
import CommunicatorServer from "./communicator_server";
import Battle from "./battle";
import MessageServer from "@common/communicator/message_server";
import getCharacterClass from '@common/instances/character_classes';
import accountsFromRaw from '../functions/utils/accountsFromRaw';
import roomsFromRaw from '../functions/utils/roomsFromRaw';
// import adventuresFromRaw from '@server/functions/utils/adventuresFromRaw';
import { MESSAGE_KINDS } from '@common/enums';
import { getAdventure } from './adventure';
const MEK = MESSAGE_KINDS;

export default class Universe {
  communicator: CommunicatorServer = new CommunicatorServer({
    createGuestAccountFunction: () => this.createGuestAccount(),
    actOnMessageFunction: (incomingMessage: MessageClient) => this.actOnMessage(incomingMessage)
  });
  accounts: { [id: string] : Account } = {}; // Eventually replace this with DB
  rooms: { [id: string] : Room } = {};
  battles: { [id: string] : Battle } = {};
  adventures: { [id: string] : Adventure } = {};
  accountsInRoom: { [accountId: string] : string } = {};
  accountsInAdventure: { [accountId: string] : string } = {};
  accountsInBattle: { [accountId: string] : string } = {};

  constructor() {
    this.loadStateFromDisk();
  };

  actOnMessage(incomingMessage: MessageClient) {
    const payload = incomingMessage.payload;
    if (!payload) return;

    if (payload.kind === MEK.CLIENT_CONNECT) {
      const { accountId } = payload;
      const account = this.accounts[accountId || ''];
      if (account) {
        const battle = this.battles[this.accountsInBattle[accountId] || ''];
        const room = this.rooms[this.accountsInRoom[accountId] || ''];
        let toCommand = undefined;
        if (battle) {
          const fighter = Object.values(battle.stateCurrent.fighters)
          .find((f) => f.ownedBy === account.id);
          toCommand = fighter?.id;
        };
        this.communicator.addPendingMessage(new MessageServer({ accountId, payload: {
          kind: MEK.SERVER_CONNECT,
          account,
          battleState: battle?.stateCurrent,
          battleStateLast: battle?.stateLast,
          room,
          toCommand
        } }));
      };
    }

    else if (payload.kind === MEK.CLAIM_GUEST_ACCOUNT) {
      const { accountId, name, characterClass } = payload;
      const account = this.accounts[accountId || ''];
      if (account) {
        const character = getCharacterClass(characterClass).toCharacter(accountId);
        this.accounts[accountId] = { id: accountId, name, character };
        this.communicator.addPendingMessage(new MessageServer({ accountId, payload: {
          kind: MEK.CLAIMED_GUEST_ACCOUNT,
          account: this.accounts[accountId]
        } }));
        this.saveStateToDisk();
      };
    }

    // ToDo: Move room logic out of universe and into Room, with attached communicator?
    else if (payload.kind === MEK.ROOM_CREATION_REQUEST) {
      const { accountId } = payload;
      const account = this.accounts[accountId];
      if (!account) throw Error(`actOnMessage room creation account not found with ID${accountId}.`);
      const room: Room = {
        id: uuid(),
        createdAt: Date.now(),
        createdById: accountId,
        joinedByIds: [accountId],
        accounts: { [accountId]: account }
      };
      this.rooms[room.id] = room;
      this.accountsInRoom[accountId] = room.id;
      this.communicator.addPendingMessage(new MessageServer({ accountId, payload: {
        kind: MEK.ROOM_UPDATE,
        room
      } }));
      this.saveStateToDisk();
    }

    else if (payload.kind === MEK.ROOM_JOIN_REQUEST) {
      const { accountId, roomId } = payload;
      const account = this.accounts[accountId];
      const room = this.rooms[roomId];
      if (!account || !room) return;
      if (!room.joinedByIds.includes(accountId)) {
        const roomNext = { ...room };
        roomNext.joinedByIds.push(accountId);
        roomNext.accounts[accountId] = account;
        this.rooms[roomId] = roomNext;
        this.accountsInRoom[accountId] = roomNext.id;

        roomNext.joinedByIds.forEach((jbaid) => {
          this.communicator.addPendingMessage(new MessageServer({ accountId: jbaid,
            payload: { kind: MEK.ROOM_UPDATE, room: roomNext } 
          }));
        });
      };
      this.saveStateToDisk();
    }

    else if (payload.kind === MEK.ROOM_CLOSURE_REQUEST) {
      const { accountId, roomId } = payload;
      const account = this.accounts[accountId];
      let room = this.rooms[roomId];
      if (!account || !room || (account.id !== room.createdById)) return;
      room.joinedByIds.forEach((jbaid) => {
        delete this.accountsInRoom[jbaid];
        this.communicator.addPendingMessage(new MessageServer({ accountId: jbaid,
          payload: { kind: MEK.ROOM_CLOSED } 
        }));
      });
      delete this.rooms[room.id];
      this.saveStateToDisk();
    }

    else if (payload.kind === MEK.ADVENTURE_REQUEST_NEW) {
      const accountId = incomingMessage.accountId || '';
      const adventureExisting = this.adventures[this.accountsInAdventure[accountId] || ''];
      if (adventureExisting) return;
      const room = this.rooms[this.accountsInRoom[accountId] || ''];
      if (!room) return;
      const adventure = getAdventure({
        adventureKindId: payload.adventureKindId,
        accounts: room.accounts
      })
      this.createAdventure(adventure);
    }
    
    else if (payload.kind === MEK.CHAMBER_READY_FOR_NEW) {
      const accountId = incomingMessage.accountId || '';
      const adventure = this.adventures[this.accountsInAdventure[accountId] || ''];
      const battle = this.battles[this.accountsInBattle[accountId] || ''];
      if (!accountId || !adventure || !battle) throw Error(`Missing adventure or battle for account ID${incomingMessage.accountId} in actOnMessage`);
      adventure.readyForNew({ accountId, treasure: payload.treasure });
    }

    else if (payload.kind === MEK.COMMAND_SEND) {
      const battleId = this.accountsInBattle[payload.accountId];
      const battle = this.battles[battleId || ''];
      if (!battle) { console.log(`Battle ID${battleId} not found`); return; }
      battle.acceptComand(payload.command);
    }

    else if (payload.kind === MEK.FIGHTER_PLACED) {
      const battleId = this.accountsInBattle[payload.accountId];
      const battle = this.battles[battleId || ''];
      if (!battle) { console.log(`Battle ID${battleId} not found`); return; }
      battle.acceptFighterPlacement({ ...payload });
    };
  };

  createAdventure(adventure: Adventure) {
    adventure.attachFunctions({
      sendMessageFunction: (messageToSend: MessageServer) => (
        this.communicator.addPendingMessage(messageToSend)
      ),
      setAdventureFunction: (adventure: Adventure) => this.adventures[adventure.id] = adventure,
      deleteAdventureFunction: (adventureId: string) => delete this.adventures[adventureId],
      setAccountInAdventureFunction: (accountId: string, adventureId: string) => (
        this.accountsInAdventure[accountId] = adventureId
      ),
      deleteAccountInAdventureFunction: (accountId: string) => (
        delete this.accountsInAdventure[accountId]
      ),
      setBattleFunction: (battle: Battle) => this.battles[battle.id] = battle,
      deleteBattleFunction: (battleId: string) => delete this.battles[battleId],
      setAccountInBattleFunction: (accountId: string, battleId: string) => (
        this.accountsInBattle[accountId] = battleId
      ),
      deleteAccountInBattleFunction: (accountId: string) => (
        delete this.accountsInBattle[accountId]
      ),
      setAccountFunction: (account: Account) => this.accounts[account.id] = account
    });
    adventure.initialize();
  };

  createGuestAccount() {
    const newAccount: Account = { id: uuid(), isGuest: true };
    this.accounts[newAccount.id] = newAccount;
    return newAccount;
  };

  saveStateToDisk() {
    const startTime = Date.now();
    Bun.write('./temp/accounts.json', JSON.stringify(this.accounts, null, 2));
    Bun.write('./temp/rooms.json', JSON.stringify(this.rooms, null, 2));
    Bun.write('./temp/accounts_in_room.json', JSON.stringify(this.accountsInRoom, null, 2));
    // Bun.write('./temp/adventures.json', JSON.stringify(this.adventures, null, 2));
    // Bun.write('./temp/accounts_in_adventure.json', JSON.stringify(this.accountsInAdventure, null, 2));
    const endTime = Date.now();
    console.log(`Loaded server state from local file after ${endTime - startTime}ms.`);
  };

  async loadStateFromDisk() {
    try {
      const startTime = Date.now();
      const accountsLoaded = await Bun.file('./temp/accounts.json').json();
      if (accountsLoaded) this.accounts = accountsFromRaw(accountsLoaded);
      const roomsLoaded = await Bun.file('./temp/rooms.json').json();
      if (roomsLoaded) this.rooms = roomsFromRaw(roomsLoaded);
      const airLoaded = await Bun.file('./temp/accounts_in_room.json').json();
      if (airLoaded) this.accountsInRoom = airLoaded;
      // const adventuresLoaded = await Bun.file('./temp/adventures.json').json();
      // if (adventuresLoaded) this.adventures = adventuresFromRaw(adventuresLoaded);
      // const aiaLoaded = await Bun.file('./temp/accounts_in_adventure.json').json();
      // if (aiaLoaded) this.accountsInAdventure = aiaLoaded;
      const endTime = Date.now();
      console.log(`Loaded server state from local file after ${endTime - startTime}ms.`);
    }
    catch(err) {
      console.log("Server state local file not found, starting without past state:", err);
    }
  };
};