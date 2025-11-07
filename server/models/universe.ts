import { v4 as uuid } from 'uuid';

import type MessageClient from "@common/communicator/message_client";
import type Account from '@common/models/account';
import type Room from '@common/models/room';
import CommunicatorServer from "./communicator_server";
import Battle, { type BattleInterface } from "./battle";
import MessageServer from "@common/communicator/message_server";
import getCharacterClass from '@common/instances/character_classes';
import getEncounter from '@server/instances/encounters';
import accountFromRaw from '../functions/utils/roomsFromRaw';
import roomsFromRaw from '../functions/utils/roomsFromRaw';
import { BATTLE_STATUS, MESSAGE_KINDS } from '@common/enums';
import { ENCOUNTERS } from '@server/enums';
import { battleStateEmpty } from '@common/models/battleState';
const MEK = MESSAGE_KINDS;

export default class Universe {
  communicator: CommunicatorServer = new CommunicatorServer({
    createGuestAccountFunction: () => this.createGuestAccount(),
    actOnMessageFunction: (incomingMessage: MessageClient) => this.actOnMessage(incomingMessage)
  });
  accounts: { [id: string] : Account } = {}; // Eventually replace this with DB
  rooms: { [id: string] : Room } = {};
  battles: { [id: string] : Battle } = {};
  accountsBattlingIn: { [accountId: string] : string } = {};
  accountsInRooms: { [accountId: string] : string } = {};

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
        const battle = this.battles[this.accountsBattlingIn[accountId] || ''];
        const room = this.rooms[this.accountsInRooms[accountId] || ''];
        this.communicator.addPendingMessage(new MessageServer({ accountId, payload: {
          kind: MEK.SERVER_CONNECT,
          account,
          battleState: battle?.stateCurrent,
          room
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
      this.accountsInRooms[accountId] = room.id;
      this.communicator.addPendingMessage(new MessageServer({ accountId, payload: {
        kind: MEK.ROOM_JOINED,
        room
      } }));
      this.saveStateToDisk();
    }

    else if (payload.kind === MEK.ROOM_JOIN_REQUEST) {
      const { accountId, roomId } = payload;
      const account = this.accounts[accountId];
      let room = this.rooms[roomId];
      if (!account || !room) return;
      if (!room.joinedByIds.includes(accountId)) {
        room = { ...room };
        room.joinedByIds.push(accountId);
        room.accounts[accountId] = account;
        this.rooms[roomId] = room;
        this.accountsInRooms[accountId] = room.id;
      };
      this.communicator.addPendingMessage(new MessageServer({ accountId, payload: {
        kind: MEK.ROOM_JOINED,
        room
      } }));
      this.saveStateToDisk();
    }
    
    else if (payload.kind === MEK.REQUEST_NEW_BATTLE) {
      const battleExisting = this.battles[this.accountsBattlingIn[incomingMessage.accountId || ''] || ''];
      if (battleExisting && !battleExisting.stateCurrent.conclusion) return;
      const room = this.rooms[this.accountsInRooms[incomingMessage.accountId || ''] || ''];
      if (!room) return;
      const encounter = getEncounter(ENCOUNTERS.BUBBLES);
      const battleArgs = encounter.toBattleArgs({
        battleState: battleStateEmpty,
        difficulty: 1,
        accounts: room.accounts
      });
      this.createBattle(battleArgs);
    }

    else if (payload.kind === MEK.COMMAND_SEND) {
      const battleId = this.accountsBattlingIn[payload.accountId];
      const battle = this.battles[battleId || ''];
      if (!battle) { console.log(`Battle ID${battleId} not found`); return; }
      battle.acceptComand(payload.command);
    }

    else if (payload.kind === MEK.FIGHTER_PLACED) {
      const battleId = this.accountsBattlingIn[payload.accountId];
      const battle = this.battles[battleId || ''];
      if (!battle) { console.log(`Battle ID${battleId} not found`); return; }
      battle.acceptFighterPlacement({ ...payload });
    };
  };

  createBattle(battleInterface: BattleInterface) {
    const battleNew = new Battle(battleInterface);
    battleNew.attachSendMessage((messageToSend: MessageServer) => {
      this.communicator.addPendingMessage(messageToSend);
    });
    this.battles[battleNew.id] = battleNew;
    Object.values(battleInterface.participants).forEach((account) => {
      this.accountsBattlingIn[account.id] = battleNew.id;
    });
    battleNew.shiftStatus(BATTLE_STATUS.INITIALIZING);
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
    Bun.write('./temp/accounts_in_rooms.json', JSON.stringify(this.accountsInRooms, null, 2));
    const endTime = Date.now();
    console.log(`Loaded server state from local file after ${endTime - startTime}ms.`);
  };

  async loadStateFromDisk() {
    try {
      const startTime = Date.now();
      const accountsLoaded = await Bun.file('./temp/accounts.json').json();
      if (accountsLoaded) this.accounts = accountFromRaw(accountsLoaded);
      const roomsLoaded = await Bun.file('./temp/rooms.json').json();
      if (roomsLoaded) this.rooms = roomsFromRaw(roomsLoaded);
      const airLoaded = await Bun.file('./temp/accounts_in_rooms.json').json();
      if (airLoaded) this.accountsInRooms = airLoaded;
      const endTime = Date.now();
      console.log(`Loaded server state from local file after ${endTime - startTime}ms.`);
    }
    catch(err) {
      console.log("Server state local file not found, starting without past state.");
    }
  };
};