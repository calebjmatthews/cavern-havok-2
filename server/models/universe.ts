
import CommunicatorServer from "./communicator_server";
import Battle, { type BattleInterface } from "./battle";
import type MessageServer from "@common/communicator/message_server";
import { v4 as uuid } from 'uuid';
import getSandboxBattleArgs from "@server/sandboxBattle";

export default class Universe {
  communicator: CommunicatorServer = new CommunicatorServer({
    createGuestAccountFunction: this.createGuestAccount
  });
  battles: { [id: string] : Battle } = {};

  createBattle(battleInterface: BattleInterface) {
    const battleNew = new Battle(battleInterface);
    this.communicator.attachActOnMessage(() => {}); // Battle update after client command selection
    battleNew.attachSendMessage((messageToSend: MessageServer) => {
      this.communicator.addPendingMessage(messageToSend);
    });
    this.battles[battleNew.id] = battleNew;
  };

  createGuestAccount() {
    return uuid();
  };

  startSandboxBattle() {
    this.createBattle(getSandboxBattleArgs());
  };
};