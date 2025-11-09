import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

import type BattleState from "@common/models/battleState";
import type ActionResolved from "@common/models/subCommandResolved";
import type Account from "@common/models/account";
import type Room from "@common/models/room";
import CommunicatorClient from "@client/models/communicator_client";
import MessageClient from "@common/communicator/message_client";
import MessageServer from "@common/communicator/message_server";
import performCommands from "@common/functions/battleLogic/performCommands/performCommands";
import cloneBattleState from "@common/functions/cloneBattleState";
import { MESSAGE_KINDS } from "@common/enums";
import { WS_STATES } from "@client/enums";
import { WS_HOST, COMMUNICATOR_CHECK_INTERVAL } from "@common/constants";

export default function Communication(props: {
  account: Account | null,
  setAccount: (nextAccount: Account) => void,
  outgoingToAdd: MessageClient | null,
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void,
  setBattleState: (nextBattleState: BattleState | null) => void,
  setBattleStateLast: (nextBattleState: BattleState | null) => void,
  setBattleStateFuture: (nextBattleState: BattleState | null) => void,
  setSubCommandsResolved: (nextActionsResolved: ActionResolved[] | null) => void,
  setSubCommandsResolvedFuture: (nextActionsResolved: ActionResolved[] | null) => void,
  setToCommand: (nextToCommand: string | null) => void,
  setRoom: (nextRoom: Room) => void
}) {
  const { account, setAccount, outgoingToAdd, setOutgoingToAdd, setBattleState, setBattleStateLast,
    setBattleStateFuture, setSubCommandsResolved, setSubCommandsResolvedFuture, setToCommand, setRoom }
    = props;
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
      const accountExistingId = localStorage.getItem('ch-accountId');

      ws.onopen = () => {
        console.log(`Connected to the server.`);
        if (accountExistingId) {
          const message = new MessageClient({
            id: uuid(),
            payload: {
              kind: MESSAGE_KINDS.CLIENT_CONNECT,
              accountId: accountExistingId
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
      setAccount(payload.account);
      localStorage.setItem('ch-accountId', payload.account.id);
      setState(WS_STATES.CONNECTED);
    }
    else if (payload.kind === MESSAGE_KINDS.CLAIMED_GUEST_ACCOUNT) {
      setAccount(payload.account);
      localStorage.setItem('ch-accountId', payload.account.id);
    }
    else if (payload.kind === MESSAGE_KINDS.SERVER_CONNECT) {
      setAccount(payload.account);
      if (payload.battleState) setBattleState(payload.battleState);
      if (payload.room) setRoom(payload.room);
      localStorage.setItem('ch-accountId', payload.account.id);
      setState(WS_STATES.CONNECTED);
    }
    else if (payload.kind === MESSAGE_KINDS.ROOM_JOINED) {
      setRoom(payload.room);
    }
    else if (payload.kind === MESSAGE_KINDS.FIGHTER_PLACEMENT) {
      setBattleState(payload.battleState);
      setToCommand(payload.toCommand);
    }
    else if (payload.kind === MESSAGE_KINDS.ROUND_START
      || payload.kind === MESSAGE_KINDS.BATTLE_CONCLUSION) {
      setBattleState(payload.battleState);
      if ("toCommand" in payload && payload.toCommand) setToCommand(payload.toCommand);
      if (payload.battleStateLast) {
        const battleStateToPerformUpon = cloneBattleState(payload.battleStateLast);
        const roundResult = performCommands(battleStateToPerformUpon);
        setSubCommandsResolved(roundResult.subCommandsResolved);
        setBattleStateLast(payload.battleStateLast);
      };
    };

    if ("battleState" in payload && payload.battleState) {
      if (Object.keys(payload.battleState?.commandsPending).length > 0) {
        const resultFuture = performCommands(payload.battleState);
        setBattleStateFuture(resultFuture.battleState);
        setSubCommandsResolvedFuture(resultFuture.subCommandsResolved);
      };
    };
    if (payload.kind === MESSAGE_KINDS.BATTLE_CONCLUSION) {
      setBattleStateFuture(null);
      setSubCommandsResolvedFuture(null);
    }
  };

  return (
    <section>
      {`${state} as ${account?.id ?? 'no one'}`}
    </section>
  );
};