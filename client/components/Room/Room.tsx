import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import type OutletContext from '@client/models/outlet_context';
import MessageClient from "@common/communicator/message_client";
import { ADVENTURE_KINDS, MESSAGE_KINDS } from '@common/enums';
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
      return { ownerAccount, isOwnRoom, otherAccounts };
    };
    return { ownerAccount: null, isOwnRoom: null, otherAccounts: null };
  }, [account, room]);

  const requestAdventure = () => {
    if (!account) return;
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: {
        kind: MESSAGE_KINDS.ADVENTURE_REQUEST_NEW,
        adventureKindId: ADVENTURE_KINDS.PRISMATIC_FALLS
      }
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
      {/* {(room) && (
        <button type="button" className="btn-large" onClick={requestBattle}>
          {`Start a battle`}
        </button>
      )} */}
      {(room) && (
        <button type="button" className="btn-large" onClick={requestAdventure}>
          {`Adventure in the Prismatic Falls`}
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