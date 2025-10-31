import type Message from './message';

export default class Communicator {
  messagesSuccessfullySent: { [id: string] : boolean } = {};
  messagesPending: { [id: string] : Message } = {};
  messagesReceived: { [id: string] : boolean } = {};
  messagesFailed: { [id: string] : Message } = {};

  addPendingMessage(comm: Message) {
    this.messagesPending[comm.id] = comm;
  };
};

export interface CommunicatorInterface {
  messagesSuccessfullySent: { [id: string] : boolean };
  messagesPending: { [id: string] : Message };
  messagesReceived: { [id: string] : boolean };
  messagesFailed: { [id: string] : Message };
};