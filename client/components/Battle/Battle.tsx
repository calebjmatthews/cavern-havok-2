import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";

import Spot from "./Spot";
import EquipmentSelect from "./EquipmentSelect";
import type OutletContext from "@client/models/outlet_context";
import type BattleRouteParams from "@client/models/route_params";
import range from "@common/functions/utils/range";
import { BATTLE_UI_STATES } from "@client/enums";
import { EQUIPMENTS } from "@common/enums";
import "./battle.css";
const BUS = BATTLE_UI_STATES;

export default function Battle() {
  const [uiState, setUiState] = useState(BUS.INACTIVE);
  const [equipSelected, setEquipSelected] = useState<string | null>();
  const routeParams = useParams() as unknown as BattleRouteParams;
  const { battleId } = routeParams;
  const outletContext: OutletContext = useOutletContext();
  const { battleState, toCommand } = outletContext;

  useEffect(() => {
    if (toCommand) {
      setUiState(BUS.EQUIPMENT_SELECT);
    }
    else {
      setUiState(BUS.INACTIVE);
    }
  }, [toCommand]);

  useEffect(() => {
    console.log(`equipSelected`, equipSelected);
  }, [equipSelected]);

  if (!battleState) return null;
  
  return (
    <section id="battle">
      <span><h1>{`Battle`}</h1><h3>{`ID ${battleId}`}</h3></span>
      <div id="battlefield">
        {range(0, (battleState.size[0] - 1)).map((row) => (
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
      {(uiState === BUS.EQUIPMENT_SELECT && toCommand) && (
        <EquipmentSelect
          battleState={battleState}
          toCommand={toCommand}
          setEquipSelected={setEquipSelected}
        />
      )}
    </section>
  )
};