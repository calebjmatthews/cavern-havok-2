import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import type OutletContext from '@client/models/outlet_context';
import type Treasure from '@common/models/treasure';
import TreasureSelect from '../Battle/TreasureSelect';
import MessageClient from '@common/communicator/message_client';
import { MESSAGE_KINDS } from '@common/enums';
import "./scene.css";

export default function Scene() {
  const outletContext: OutletContext = useOutletContext();
  const { account, sceneState, setOutgoingToAdd } = outletContext;
  const [waitingOnOthers, setWaitingOnOthers] = useState(false);
  const navigate = useNavigate();

  const readyForChamberNew = (treasure: Treasure) => {
    if (!account) return;
    
    setWaitingOnOthers(true);
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: {
        kind: MESSAGE_KINDS.CHAMBER_READY_FOR_NEW,
        treasure
      }
    }));
  }

  if (!sceneState) return (
    <section className="container">
      <span className="title">{`Cavern Havok`}</span>
      <div className="text-large">{`Somehow, this scene is missing. Better go back to the beginning.`}</div>
      <button type="button" className="btn-large" onClick={() => navigate(`/`)}>
        {`Back to room`}
      </button>
    </section>
  );

  if (waitingOnOthers) return (
    <section className="container">
      <p className="waiting-text">{`Waiting for other players...`}</p>
    </section>
  )
  
  return (
    <section id="scene" className="container">
      <h1>{sceneState.name}</h1>
      <p>{sceneState.texts.introText}</p>
      {sceneState.treasures && (
        <TreasureSelect
          treasures={(sceneState.treasures && account) && sceneState.treasures[account.id]}
          readyForChamberNew={readyForChamberNew}
        />
      )}
    </section>
  );
};