import type { ServerWebSocket } from "bun";
import { v4 as uuid } from 'uuid';

import Communicator from '@common/communicator/communicator';
import MessageClient from '@common/communicator/message_client';
import MessageServer from '@common/communicator/message_server';
import type Account from "@common/models/account";
import { MESSAGE_KINDS } from '@common/enums';

const MEK = MESSAGE_KINDS;
const SEND_INTERVAL = 100;
const RESEND_INTERVAL = 100;
const RESEND_MULTIPLIER = 1;
const RESEND_ATTEMPT_LIMIT = 10;
const BACKPRESSURE_WAITING_INTERVAL = 1000;

export default class CommunicatorServer extends Communicator {
  wss: { [accountId: string] : ServerWebSocket } = {};
  wssBackpressured: { [accountId: string] : number } = {};
  override messagesSuccessfullySent: { [id: string] : boolean } = {};
  override messagesPending: { [id: string] : MessageServer } = {};
  override messagesReceived: { [id: string] : boolean } = {};
  override messagesFailed: { [id: string] : MessageServer } = {};
  actOnMessage: (incomingMessage: MessageClient) => void = () => {};
  createGuestAccount: () => Account|null = () => null;

  constructor(args: {
    createGuestAccountFunction: () => Account,
    actOnMessageFunction: (incomingMessage: MessageClient) => void
  }) {
    super();
    const { createGuestAccountFunction, actOnMessageFunction } = args;
    this.attachCreateGuestAccount(createGuestAccountFunction);
    this.attachActOnMessage(actOnMessageFunction);
    this.callCheckPendingMessages();
  };

  callCheckPendingMessages() {
    this.sendPendingMessages();

    setTimeout(() => this.callCheckPendingMessages(), SEND_INTERVAL);
  };

  sendPendingMessages() {
    Object.values(this.messagesPending).forEach((message) => {
      const resendTime = (message.lastSentAt + (RESEND_INTERVAL
        * ((message.sendAttempts + 1) * RESEND_MULTIPLIER)));
      if ((message.sendAttempts === 0) || (resendTime < Date.now())) {
        this.sendOneMessage(message);
      };
    });
  };

  sendOneMessage(message: MessageServer) {
    const ws = this.wss[message.accountId || ''];
    if (!ws) {
      console.log(`Connection not found for message: `, message);
      return;
    };

    const result = ws.send(JSON.stringify(message));
    if (result === -1) {

    }
    message.lastSentAt = Date.now();
    // Only make one attempt to deliver confirmation messages
    if (message.payload?.kind === MEK.MESSAGE_RECEIVED_BY_SERVER) {
      delete this.messagesPending[message.id];
    }
    message.sendAttempts++;
    if (message.sendAttempts >= RESEND_ATTEMPT_LIMIT) {
      console.log(`Maximum attempts reached, deleting message: `, message);
      this.messagesFailed[message.id] = message;
      delete this.messagesPending[message.id];
    };
  };
  
  receiveMessage(args: { ws: ServerWebSocket, message: string|Buffer<ArrayBuffer> }) {
    const { ws, message } = args;
    
    let normalized: string;
    if (typeof message === "string") normalized = message;
    else if (message instanceof ArrayBuffer) normalized = new TextDecoder().decode(message);
    else throw new Error("Unsupported message type");
    const incomingMessage = new MessageClient(JSON.parse(normalized));
    console.log(`server-side incomingMessage: `, incomingMessage);

    let accountId: string | undefined;
    const payload = (incomingMessage.payload || {});
    if ('accountId' in payload) {
      accountId = payload.accountId as string;
    };
    const messageKind = incomingMessage.payload?.kind;

    // If client connection message, link websocket connection to accountId
    if (messageKind === MEK.CLIENT_CONNECT && accountId) {
      this.createNewConnection({ ws, accountId });
    };

    const guestAccountAlreadyGranted = Object.values(this.wss).find((wsFromMap) => wsFromMap === ws);
    if (messageKind === MEK.REQUEST_GUEST_ACCOUNT && !guestAccountAlreadyGranted) {
      const account = this.createGuestAccount();
      if (!account) throw Error("Error: Account ID expected after guest account generation.");
      accountId = account.id;
      this.createNewConnection({ ws, accountId });
      const accountGrantedMessageId = uuid();
      this.messagesPending[accountGrantedMessageId] = new MessageServer({
        id: accountGrantedMessageId,
        accountId,
        payload: { kind: MEK.GRANT_GUEST_ACCOUNT, account }
      });
    }
    else if (messageKind === MEK.REQUEST_GUEST_ACCOUNT && guestAccountAlreadyGranted) {
      Object.entries(this.wss).forEach(([id, wsFromMap]) => {
        if (wsFromMap === ws) accountId = id;
      });
    };

    // Normal message from client
    if (messageKind !== MEK.MESSAGE_RECEIVED_BY_CLIENT) {
      // actOnMessage logic supplied by battle, via universe
      this.actOnMessage(incomingMessage);

      const confirmationMessage = new MessageServer({
        id: incomingMessage.id,
        accountId,
        payload: { kind: MEK.MESSAGE_RECEIVED_BY_SERVER }
      });
      this.sendOneMessage(confirmationMessage);
      // this.messagesPending[incomingMessage.id] = confirmationMessage;
      return true;
    }
    
    // Client receipt of server message
    else if (this.messagesPending[incomingMessage.id]) {
      delete this.messagesPending[incomingMessage.id];
      this.messagesSuccessfullySent[incomingMessage.id] = true;
    }
    else {
      console.log(`Message received by client, but missing from pending: `, incomingMessage);
    };
    this.messagesReceived[incomingMessage.id] = true;
    return false;
  };

  createNewConnection(args: { ws: ServerWebSocket, accountId: string }) {
    const { ws, accountId } = args;
    this.wss[accountId] = ws;
  };

  socketBackpressureDetected(accountId: string) {
    this.wssBackpressured[accountId] = Date.now();
    setTimeout(() => this.socketBackpressureClear(accountId), BACKPRESSURE_WAITING_INTERVAL);
  };

  socketBackpressureClear(accountId: string) {
    delete this.wssBackpressured[accountId];
  };

  override addPendingMessage(message: MessageServer) {
    this.messagesPending[message.id] = message;
  };

  attachActOnMessage(actOnMessageFunction: (incomingMessage: MessageClient) => void) {
    this.actOnMessage = actOnMessageFunction;
  };

  attachCreateGuestAccount(createGuestAccountFunction: () => Account|null) {
    this.createGuestAccount = createGuestAccountFunction;
  }
};