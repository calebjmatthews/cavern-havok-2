import { useState } from "react";

import Communication from "../Communication/Communication";
import type MessageClient from "@common/communicator/message_client";
import './main.css';
import Landing from "../Landing/Landing";

export default function Main() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [outgoingToAdd, setOutgoingToAdd] = useState<MessageClient | null>(null);
  
  return (
    <main id="main">
      <section id="body">
        <Landing setOutgoingToAdd={setOutgoingToAdd} />
      </section>
      <footer>
        <Communication
          accountId={accountId}
          setAccountId={setAccountId}
          outgoingToAdd={outgoingToAdd}
          setOutgoingToAdd={setOutgoingToAdd}
        />
      </footer>
    </main>
  );
};
