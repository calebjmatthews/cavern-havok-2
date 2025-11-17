import { useOutletContext } from 'react-router';

import type OutletContext from '@client/models/outlet_context';
import TreasureSelect from '../Battle/TreasureSelect';

export default function Scene() {
  const outletContext: OutletContext = useOutletContext();
  const { account, sceneState, setOutgoingToAdd } = outletContext;

  if (!sceneState) return null;
  
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