import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

import type MessageClient from "@common/communicator/message_client";
import type BattleState from "@common/models/battleState";
import type RouteParams from '@client/models/route_params';
import type SubCommandResolved from '../../../common/models/subCommandResolved';
import type Account from '@common/models/account';
import Communication from "../Communication/Communication";
import './main.css';
import type Room from '@common/models/room';

export default function Main() {
  const [account, setAccount] = useState<Account | null>(null);
  const [outgoingToAdd, setOutgoingToAdd] = useState<MessageClient | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [battleStateLast, setBattleStateLast] = useState<BattleState | null>(null);
  const [subCommandsResolved, setSubCommandResolved] = useState<SubCommandResolved[] | null>(null);
  const [toCommand, setToCommand] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const navigate = useNavigate();
  const routeParams = useParams() as unknown as RouteParams;

  useEffect(() => {
    if (battleState?.battleId && !routeParams.battleId) {
      navigate(`/battle/${battleState.battleId}`);
    }
  }, [battleState]);

  useEffect(() => {
    if (room && !routeParams.roomId) {
      navigate(`/room/${room.id}`);
    }
  }, [room]);
  
  return (
    <main id="main">
      <section id="body">
        <Outlet context={{
          account,
          setOutgoingToAdd,
          battleState,
          battleStateLast,
          subCommandsResolved,
          toCommand,
          room
        }} />
      </section>
      <footer>
        <Communication
          account={account}
          setAccount={setAccount}
          outgoingToAdd={outgoingToAdd}
          setOutgoingToAdd={setOutgoingToAdd}
          setBattleState={setBattleState}
          setBattleStateLast={setBattleStateLast}
          setActionsResolved={setSubCommandResolved}
          setToCommand={setToCommand}
          setRoom={setRoom}
        />
      </footer>
    </main>
  );
};