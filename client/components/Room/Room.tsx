import { useMemo } from 'react';
import { useOutletContext } from 'react-router';

// import MessageClient from "@common/communicator/message_client";
import type OutletContext from '@client/models/outlet_context';
// import { CHARACTER_CLASSES, MESSAGE_KINDS } from "@common/enums";
// import './room.css';

export default function Room() {
  const outletContext: OutletContext = useOutletContext();
  const { account, room } = outletContext;

  const { ownerAccount, isOwnRoom } = useMemo(() => {
    if (account && room) {
      const ownerAccount = room?.accounts[room.createdById] ?? null;
      const isOwnRoom = (account.id === room.createdById);
      return { ownerAccount, isOwnRoom };
    };
    return { ownerAccount: null, isOwnRoom: null };
  }, [account, room]);

  return (
    <div>
      {account && (<div>{`Hello, ${account.name}.`}</div>)}
      {isOwnRoom && (<div>{`You're in your own room.`}</div>)}
      {(ownerAccount && !isOwnRoom) && (<div>{`You're in ${ownerAccount.name}'s room.`}</div>)}
    </div>
  );
};