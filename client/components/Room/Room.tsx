import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';

import type OutletContext from '@client/models/outlet_context';
import type RouteParams from '@client/models/route_params';
import MessageClient from "@common/communicator/message_client";
import { MESSAGE_KINDS } from '@common/enums';
import './room.css';

export default function Room() {
  const [closeRoomConfirm, setCloseRoomConfirm] = useState(false);
  const outletContext: OutletContext = useOutletContext();
  const { account, room, setOutgoingToAdd } = outletContext;
  const navigate = useNavigate();

  const { ownerAccount, isOwnRoom, otherAccounts } = useMemo(() => {
    if (account && room) {
      const ownerAccount = room?.accounts[room.createdById] ?? null;
      const isOwnRoom = (account.id === room.createdById);
      const otherAccounts = Object.values(room.accounts).filter((a) => a.id !== account.id);
      console.log(`room`, room);
      console.log(`otherAccounts`, otherAccounts);
      return { ownerAccount, isOwnRoom, otherAccounts };
    };
    return { ownerAccount: null, isOwnRoom: null, otherAccounts: null };
  }, [account, room]);

  const requestBattle = () => {
    if (!account) return;
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: { kind: MESSAGE_KINDS.REQUEST_NEW_BATTLE }
    }));
  };

  const closeRoom = () => {
    setCloseRoomConfirm(false);
    if (!account || !room) return;
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: { kind: MESSAGE_KINDS.ROOM_CLOSURE_REQUEST, roomId: room.id, accountId: account.id }
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
      {(otherAccounts && otherAccounts.length > 0) && (
        <div className="text-large">{`Also here: ${otherAccounts.map((a) => a.name).join()}`}</div>
      )}
      {(room) && (
        <button type="button" className="btn-large" onClick={requestBattle}>
          {`Start a battle`}
        </button>
      )}
      
      {(isOwnRoom && !closeRoomConfirm) && (
        <button type="button" onClick={() => setCloseRoomConfirm(true)}>
          {`Close the room`}
        </button>
      )}
      {(isOwnRoom && closeRoomConfirm) && (
        <button type="button" onClick={closeRoom}>
          {`Really close the room?`}
        </button>
      )}

      {(!room) && (
        <>
          <div className="text-large">{`This room is missing, nowhere to be found.`}</div>
          <button type="button" className="btn-large" onClick={() => navigate('/')}>
            {`Back to the start`}
          </button>
        </>

      )}
    </section>
  );
};