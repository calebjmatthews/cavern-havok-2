import { useOutletContext, useParams } from "react-router";

import Spot from "./Spot";
import type OutletContext from "@client/models/outlet_context";
import type BattleRouteParams from "@client/models/route_params";
import range from "@common/functions/utils/range";
import "./battle.css";

export default function Battle() {
  const routeParams = useParams() as unknown as BattleRouteParams;
  const { battleId } = routeParams;
  const outletContext: OutletContext = useOutletContext();
  const { battleState } = outletContext;

  if (!battleState) return null;
  
  return (
    <section id="battle">
      <span><h1>{`Battle`}</h1><h3>{`ID ${battleId}`}</h3></span>
      <div id="battlefield">
        {range(0, battleState.size[0]).map((row) => (
          <div key={`${row}-row`} className="battle-row">
            {range(0, ((battleState.size[1] * 2) - 1)).map((col) => (
              <Spot
                key={`c${col}-r${row}-spot`}
                coords={[col, row]}
                battleState={battleState}
              /> 
            ))}
          </div>
        ))}
      </div>
    </section>
  )
};