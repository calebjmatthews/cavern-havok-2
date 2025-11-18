import { useNavigate, useOutletContext } from 'react-router';

import type OutletContext from '@client/models/outlet_context';
import TreasureSelect from '../Battle/TreasureSelect';

export default function Scene() {
  const outletContext: OutletContext = useOutletContext();
  const { account, sceneState, setOutgoingToAdd } = outletContext;
  const navigate = useNavigate();

  if (!sceneState) return (
    <section className="container">
      <span className="title">{`Cavern Havok`}</span>
      <div className="text-large">{`Somehow, this scene is missing. Better go back to the beginning.`}</div>
      <button type="button" className="btn-large" onClick={() => navigate(`/`)}>
        {`Back to room`}
      </button>
    </section>
  );
  
  return (
    <section>
      <h1>{sceneState.name}</h1>
      <p>{sceneState.texts.introText}</p>
      {sceneState.treasures && (
        <TreasureSelect
          treasures={(sceneState.treasures && account) && sceneState.treasures[account.id]}
          readyForChamberNew={() => {}}
        />
      )}
    </section>
  );
};