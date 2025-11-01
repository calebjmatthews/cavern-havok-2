import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

import Communication from "../Communication/Communication";
import type MessageClient from "@common/communicator/message_client";
import type BattleState from "@common/models/battleState";
import type BattleRouteParams from '@client/models/route_params';
import './main.css';

export default function Main() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [outgoingToAdd, setOutgoingToAdd] = useState<MessageClient | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [toCommand, setToCommand] = useState<string | null>(null);
  const navigate = useNavigate();
  const routeParams = useParams() as unknown as BattleRouteParams;

  useEffect(() => {
    if (battleState?.battleId && !routeParams.battleId) {
      navigate(`/battle/${battleState.battleId}`);
    }
  }, [battleState]);
  
  return (
    <main id="main">
      <section id="body">
        <Outlet context={{
          accountId,
          setOutgoingToAdd,
          battleState,
          toCommand
        }} />
      </section>
      <footer>
        <Communication
          accountId={accountId}
          setAccountId={setAccountId}
          outgoingToAdd={outgoingToAdd}
          setOutgoingToAdd={setOutgoingToAdd}
          setBattleState={setBattleState}
          setToCommand={setToCommand}
        />
      </footer>
    </main>
  );
};