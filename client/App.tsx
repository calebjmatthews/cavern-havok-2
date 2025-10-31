import { useState } from "react";
import Communication from "./Communication";
import "./index.css";
import type MessageClient from "@common/communicator/message_client";

export default function App() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [outgoingToAdd, setOutgoingToAdd] = useState<MessageClient | null>(null);
  
  return (
    <div className="app">
      Hello, world.
      <Communication
        accountId={accountId}
        setAccountId={setAccountId}
        outgoingToAdd={outgoingToAdd}
        setOutgoingToAdd={setOutgoingToAdd}
      />
    </div>
  );
};
