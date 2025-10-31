import { v4 as uuid } from 'uuid';

import CommunicatorServer from "./communicator_server";
import Battle, { type BattleInterface } from "./battle";
import type MessageServer from "@common/communicator/message_server";
import getSandboxBattleArgs from "@server/sandboxBattle";
import type MessageClient from "@common/communicator/message_client";
import type Account from '@common/models/account';
import { BATTLE_STATUS, MESSAGE_KINDS } from '@common/enums';
const MEK = MESSAGE_KINDS;

export default class Universe {
  communicator: CommunicatorServer = new CommunicatorServer({
    createGuestAccountFunction: () => this.createGuestAccount(),
    actOnMessageFunction: (incomingMessage: MessageClient) => this.actOnMessage(incomingMessage)
  });
  accounts: { [id: string] : Account } = {}; // Eventually replace this with DB
  battles: { [id: string] : Battle } = {};

  actOnMessage(incomingMessage: MessageClient) {
    if (incomingMessage.payload?.kind === MEK.REQUEST_NEW_BATTLE) {
      const account = this.accounts[incomingMessage.accountId || '']
      if (account) this.startSandboxBattle(account);
    }
  };

  createBattle(battleInterface: BattleInterface) {
    const battleNew = new Battle(battleInterface);
    battleNew.attachSendMessage((messageToSend: MessageServer) => {
      this.communicator.addPendingMessage(messageToSend);
    });
    this.battles[battleNew.id] = battleNew;
    battleNew.shiftStatus(BATTLE_STATUS.INITIALIZING);
  };

  createGuestAccount() {
    const newAccount: Account = { id: uuid() };
    this.accounts[newAccount.id] = newAccount;
    return newAccount;
  };

  startSandboxBattle(account: Account) {
    console.log(`Starting sandbox battle...`);
    this.createBattle({ ...getSandboxBattleArgs(), participants: { [account.id] : account } });
  };
};