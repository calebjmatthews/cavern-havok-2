import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

import Communication from "../Communication/Communication";
import type MessageClient from "@common/communicator/message_client";
import './main.css';
import type BattleState from "@common/models/battleState";

export default function Main() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [outgoingToAdd, setOutgoingToAdd] = useState<MessageClient | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (battleState?.battleId) navigate(`/battle/${battleState.battleId}`);
  }, [battleState]);
  
  return (
    <main id="main">
      <section id="body">
        <Outlet context={{
          accountId,
          setOutgoingToAdd,
          battleState
        }} />
      </section>
      <footer>
        <Communication
          accountId={accountId}
          setAccountId={setAccountId}
          outgoingToAdd={outgoingToAdd}
          setOutgoingToAdd={setOutgoingToAdd}
          setBattleState={setBattleState}
        />
      </footer>
    </main>
  );
};