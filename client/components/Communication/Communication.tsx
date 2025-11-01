import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import CommunicatorClient from "@client/models/communicator_client";
import MessageClient from "@common/communicator/message_client";
import MessageServer from "@common/communicator/message_server";
import { MESSAGE_KINDS } from "@common/enums";
import { WS_STATES } from "@client/enums";
import { WS_HOST, COMMUNICATOR_CHECK_INTERVAL } from "@common/constants";
import type BattleState from "@common/models/battleState";
import performCommands from "@common/functions/battleLogic/performCommands/performCommands";
import type ActionResolved from "@common/models/actionResolved";

export default function Communication(props: {
  accountId: string | null,
  setAccountId: (nextAccountId: string) => void,
  outgoingToAdd: MessageClient | null,
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void,
  setBattleState: (nextBattleState: BattleState | null) => void,
  setActionsResolved: (nextActionsResolved: ActionResolved[] | null) => void,
  setToCommand: (nextToCommand: string | null) => void
}) {
  const { accountId, setAccountId, outgoingToAdd, setOutgoingToAdd, setBattleState,
    setActionsResolved, setToCommand } = props;
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
    const payload = message.payload;
    if (!payload) return;
    if (payload.kind === MESSAGE_KINDS.GRANT_GUEST_ACCOUNT) {
      setAccountId(payload.accountId);
      setState(WS_STATES.CONNECTED);
    }
    else if (payload.kind === MESSAGE_KINDS.ROUND_START) {
      setBattleState(payload.battleState);
      if (payload.toCommand) setToCommand(payload.toCommand);
      if (payload.battleStateLast) {
        const roundResult = performCommands(payload.battleStateLast);
        setActionsResolved(roundResult.actionsResolved);
      };
    }
    else if (payload.kind === MESSAGE_KINDS.BATTLE_CONCLUSION) {
      setBattleState(payload.battleState);
    };
  };

  return (
    <section>
      {`${state} as ${accountId ?? 'no one'}`}
    </section>
  );
};