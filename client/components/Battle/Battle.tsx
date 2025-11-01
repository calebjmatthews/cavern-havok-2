import { v4 as uuid } from 'uuid';
import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router";

import type OutletContext from "@client/models/outlet_context";
import type BattleRouteParams from "@client/models/route_params";
import type Command from "@common/models/command";
import Spot from "./Spot";
import EquipmentSelect from "./EquipSelect";
import MessageClient from '@common/communicator/message_client';
import range from "@common/functions/utils/range";
import equipments from "@common/instances/equipments";
import getFighterIdFromCoords from "@common/functions/positioning/getFighterIdFromCoords";
import { battleStateEmpty } from "@common/models/battleState";
import { BATTLE_UI_STATES } from "@client/enums";
import { MESSAGE_KINDS } from "@common/enums";
import "./battle.css";
const BUS = BATTLE_UI_STATES;

export default function Battle() {
  const [uiState, setUiState] = useState(BUS.INACTIVE);
  const [equipSelected, setEquipSelected] = useState<string | null>();
  const [targetSelected, setTargetSelected] = useState<[number, number] | null>(null);
  const routeParams = useParams() as unknown as BattleRouteParams;
  const { battleId } = routeParams;
  const outletContext: OutletContext = useOutletContext();
  const { battleState, toCommand, setOutgoingToAdd, accountId } = outletContext;

  const battleStateIncomingHandle = () => {
    if (toCommand) {
      setUiState(BUS.EQUIPMENT_SELECT);
    };
    setEquipSelected(null);
    setTargetSelected(null);
  };
  useEffect(battleStateIncomingHandle, [JSON.stringify(battleState), toCommand]);

  const equipmentSelectedUpdateUIState = () => {
    if (equipSelected) {
      setUiState(BUS.TARGET_SELECT);
    }
  };
  useEffect(equipmentSelectedUpdateUIState, [equipSelected]);

  const targetSelectedUpdateUIState = () => {
    if (targetSelected) {
      setUiState(BUS.CONFIRM);
    }
  };
  useEffect(targetSelectedUpdateUIState, [targetSelected]);

  const equip = useMemo(() => (equipments[equipSelected || '']), [equipSelected]);
  const targetOptions = useMemo(() => (
    equip?.getCanTarget({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) || []
  ), [equip]);

  const submitCommand = () => {
    if (!battleState || !toCommand || !equip || !targetSelected || !accountId) {
      throw Error("Data missing from submitCommand");
    }
    const targetId = (equip.targetType === 'id')
      ? getFighterIdFromCoords({ battleState, coords: targetSelected })
      : undefined;
    const targetCoords = (equip.targetType === 'coords') ? targetSelected : undefined;
    const command: Command = {
      id: uuid(),
      fromId: toCommand,
      equipmentId: equip.id,
      targetId,
      targetCoords
    };
    setOutgoingToAdd(new MessageClient({
      payload: { kind: MESSAGE_KINDS.COMMAND_SEND, command, accountId }
    }));
    setUiState(BUS.WAITING);
  };

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
                uiState={uiState}
                battleState={battleState}
                targetOptions={targetOptions}
                targetSelected={targetSelected}
                setTargetSelected={setTargetSelected}
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
      {uiState === BUS.CONFIRM && (
        <button className="btn-large btn-confirm" onClick={submitCommand}>
          {`Go!`}
        </button>
      )}
      {uiState === BUS.WAITING && (
        <p className="waiting-text">{`Waiting for other players...`}</p>
      )}
    </section>
  )
};