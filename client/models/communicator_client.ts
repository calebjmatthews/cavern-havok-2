import type Message from "@common/communicator/message";
import type MessageServer from "@common/communicator/message_server";
import Communicator, { type CommunicatorInterface } from "@common/communicator/communicator";
import MessageClient from "@common/communicator/message_client";
import { MESSAGE_KINDS } from "@common/enums";

const RESEND_INTERVAL = 250;
const RESEND_MULTIPLIER = 1;
const RESEND_ATTEMPT_LIMIT = 10;

export default class CommunicatorClient extends Communicator {
  ws?: WebSocket;

  constructor(args?: {
    communicatorClient?: CommunicatorClientInterface,
    ws?: WebSocket
  }) {
    super();
    const { communicatorClient, ws } = (args || {});
    if (communicatorClient) Object.assign(this, communicatorClient);
    if (ws) this.ws = ws;
  };

  sendPendingMessages() {
    Object.entries(this.messagesPending).forEach(([id, message]) => {
      const resendTime = (message.lastSentAt + (RESEND_INTERVAL
        * ((message.sendAttempts + 1) * RESEND_MULTIPLIER)));
      if ((message.sendAttempts === 0) || (resendTime < Date.now())) {
        this.sendOneMessage(message);
      };
    });
  };

  sendOneMessage(message: Message) {
    if (!this.ws) return;
    this.ws.send(JSON.stringify(message));
    message.lastSentAt = Date.now();
    if (message.payload?.kind === MESSAGE_KINDS.MESSAGE_RECEIVED_BY_CLIENT) {
      delete this.messagesPending[message.id];
    }
    message.sendAttempts++;
    if (message.sendAttempts >= RESEND_ATTEMPT_LIMIT) {
      console.log(`Maximum attempts reached, deleting message: `, message);
      this.messagesFailed[message.id] = message;
      delete this.messagesPending[message.id];
    };
  };

  receiveMessage(incomingMessage: MessageServer) {
    console.log(`client-side incomingMessage:`, incomingMessage);
    // Normal message from server
    if (incomingMessage.payload?.kind !== MESSAGE_KINDS.MESSAGE_RECEIVED_BY_SERVER) {
      this.sendOneMessage(new MessageClient({
        ...incomingMessage,
        payload: { kind: MESSAGE_KINDS.MESSAGE_RECEIVED_BY_CLIENT }
      }));
      return true;
    }

    // Server receipt of client message
    else if (this.messagesPending[incomingMessage.id]) {
      delete this.messagesPending[incomingMessage.id];
      this.messagesSuccessfullySent[incomingMessage.id] = true;
    }
    else {
      console.log(`Message received by server, but missing from pending: `, incomingMessage);
    };
    this.messagesReceived[incomingMessage.id] = true;
    return false;
  };

  override addPendingMessage(message: MessageClient) {
    this.messagesPending[message.id] = message;
  };
};

interface CommunicatorClientInterface extends CommunicatorInterface {
  ws?: WebSocket;
};