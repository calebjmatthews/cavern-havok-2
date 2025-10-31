import { useOutletContext } from 'react-router';

import MessageClient from "@common/communicator/message_client";
import type OutletContext from '@client/models/outlet_context';
import { MESSAGE_KINDS } from "@common/enums";
import './landing.css';

export default function Landing() {
  const outletContext: OutletContext = useOutletContext();
  const { accountId, setOutgoingToAdd } = outletContext;

  const startBattleClick = () => {
    setOutgoingToAdd(new MessageClient({
      accountId: accountId ?? undefined,
      payload: {
        kind: MESSAGE_KINDS.REQUEST_NEW_BATTLE
      }
    }));
  };
  
  return (
    <section id="landing">
      <span className="title">{`Cavern Havok`}</span>
      <button className="btn-large" onClick={startBattleClick}>
        {`Start battle`}
      </button>
    </section>
  )
};