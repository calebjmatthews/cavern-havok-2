import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import CommunicatorClient from "./models/communicator_client";
import MessageClient from "@common/communicator/message_client";
import MessageServer from "@common/communicator/message_server";
import { MESSAGE_KINDS, WS_STATES } from "@common/enums";
import { WS_HOST, COMMUNICATOR_CHECK_INTERVAL } from "@common/constants";

export default function Communication(props: {
  accountId: string | null,
  setAccountId: (nextAccountId: string) => void,
  outgoingToAdd: MessageClient | null,
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void,
}) {
  const { accountId, setAccountId, outgoingToAdd, setOutgoingToAdd } = props;
  const [state, setState] = useState(WS_STATES.UNINITIALIZED);
  const [communicator, setCommunicator] = useState(new CommunicatorClient());
  const [incomingToAdd, setIncomingToAdd] = useState <MessageServer | null> (null);
  const [callSendPending, setCallSendPending] = useState(false);

  useEffect(() => {
    if (state === WS_STATES.UNINITIALIZED) {
      setState(WS_STATES.CONNECTING);
    }

    else if (state === WS_STATES.CONNECTING) {
      setState(WS_STATES.CONNECTION_PENDING);
      const ws = new WebSocket(WS_HOST);

      ws.onopen = () => {
        console.log(`Connected to the server.`);
        if (accountId) {
          const message = new MessageClient({
            id: uuid(),
            payload: {
              kind: MESSAGE_KINDS.CLIENT_CONNECT,
              accountId
            }
          });
          setOutgoingToAdd(message);
        }
        else {
          const message = new MessageClient({
            id: uuid(),
            payload: { kind: MESSAGE_KINDS.REQUEST_GUEST_ACCOUNT }
          });
          setOutgoingToAdd(message);
          setState(WS_STATES.REQUESTING_GUEST_ACCOUNT);
        }
        
        setCallSendPending(true);
      };
      ws.onclose = () => {
        console.log(`Disconnected. Check internet or server.`);
        setState(WS_STATES.DISCONNECTED);
      };
      ws.onerror = (e) => {
        console.log(`Error: ${JSON.stringify(e)}`);
        setState(WS_STATES.DISCONNECTED);
      };
      ws.onmessage = (e) => {
        setIncomingToAdd(JSON.parse(e.data));
      };

      const nextCommunicator = new CommunicatorClient({ ws });
      setCommunicator(nextCommunicator);
    }
    
  }, [state]);

  useEffect(() => {
    if (outgoingToAdd) {
      const nextComm = new CommunicatorClient({ communicatorClient: communicator });
      nextComm.addPendingMessage(outgoingToAdd);
      setOutgoingToAdd(null);
    };
  }, [outgoingToAdd, communicator]);

  useEffect(() => {
    if (incomingToAdd) {
      const nextComm = new CommunicatorClient({ communicatorClient: communicator });
      const messageAdded = new MessageServer(incomingToAdd);
      setIncomingToAdd(null);
      const newlyReceived = nextComm.receiveMessage(incomingToAdd);
      setCommunicator(nextComm);
      if (newlyReceived) {
        actFromMessage(messageAdded);
      }
    };
  }, [incomingToAdd, communicator]);

  useEffect(() => {
    if (callSendPending && communicator) {
      setCallSendPending(false);
      communicator.sendPendingMessages();
      setTimeout(() => setCallSendPending(true), COMMUNICATOR_CHECK_INTERVAL);
    }
  }, [callSendPending, communicator]);

  const actFromMessage = (message: MessageServer) => {
    if (!message.payload) return;
    if (message.payload?.kind === MESSAGE_KINDS.GRANT_GUEST_ACCOUNT) {
      setAccountId(message.payload.accountId);
      setState(WS_STATES.CONNECTED);
    }
    else if (message.payload?.kind === MESSAGE_KINDS.ROUND_START) {

    }
    else if (message.payload?.kind === MESSAGE_KINDS.BATTLE_CONCLUSION) {

    };
  };

  return (
    <section>
      <code>{state}</code>
      <code>{accountId}</code>
    </section>
  );
};