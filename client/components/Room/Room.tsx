import { useMemo } from 'react';
import { useOutletContext } from 'react-router';

import MessageClient from "@common/communicator/message_client";
import type OutletContext from '@client/models/outlet_context';
import { MESSAGE_KINDS } from '@common/enums';
import './room.css';

export default function Room() {
  const outletContext: OutletContext = useOutletContext();
  const { account, room, setOutgoingToAdd } = outletContext;

  const { ownerAccount, isOwnRoom } = useMemo(() => {
    if (account && room) {
      const ownerAccount = room?.accounts[room.createdById] ?? null;
      const isOwnRoom = (account.id === room.createdById);
      return { ownerAccount, isOwnRoom };
    };
    return { ownerAccount: null, isOwnRoom: null };
  }, [account, room]);

  const requestBattle = () => {
    if (!account) return;
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: {
        kind: MESSAGE_KINDS.REQUEST_NEW_BATTLE
      }
    }));
  };

  return (
    <section id="room">
      <span className="title">{`Cavern Havok`}</span>
      {account && (
        <div className="text-large">{`Hello, ${account.name}.`
      }</div>)}
      {isOwnRoom && (
        <div className="text-large">{`You're in your own room.`}</div>
      )}
      {(ownerAccount && !isOwnRoom) && (
        <div className="text-large">{`You're in ${ownerAccount.name}'s room.`}</div>
      )}
      <button type="button" className="btn-large" onClick={requestBattle}>
        {`Start a battle`}
      </button>
    </section>
  );
};