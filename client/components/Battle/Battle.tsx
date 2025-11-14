import { v4 as uuid } from 'uuid';
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

import type Command from "@common/models/command";
import Spot from "./Spot";
import EquipmentSelect from "./EquipSelect";
import OutcomeText from './OutcomeText';
import IntentionText from './IntentionText';
import type BattleRouteParams from "@client/models/route_params";
import type OutletContext from "@client/models/outlet_context";
import MessageClient from '@common/communicator/message_client';
import range from "@common/functions/utils/range";
import equipments from "@common/instances/equipments";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
import getCoordsOnSide from '@common/functions/positioning/getCoordsOnSide';
import { battleStateEmpty } from "@common/models/battleState";
import { BATTLE_UI_STATES } from "@client/enums";
import { MESSAGE_KINDS } from "@common/enums";
import "./battle.css";
import TreasureSelect from './TreasureSelect';
const BUS = BATTLE_UI_STATES;

export default function Battle() {
  const [uiState, setUiState] = useState(BUS.INACTIVE);
  const [roundCurrent, setRoundCurrent] = useState(-1);
  const [equipSelected, setEquipSelected] = useState<string | null>();
  const [targetSelected, setTargetSelected] = useState<[number, number] | null>(null);
  const [introTextRead, setIntroTextRead] = useState(false);
  const routeParams = useParams() as unknown as BattleRouteParams;
  const { battleId } = routeParams;
  const outletContext: OutletContext = useOutletContext();
  const { battleState, setBattleState, battleStateLast, setBattleStateLast, battleStateFuture, 
    setBattleStateFuture, subCommandsResolved, setSubCommandsResolved, subCommandsResolvedFuture, 
    setSubCommandsResolvedFuture, toCommand, setOutgoingToAdd, account } = outletContext;
  const navigate = useNavigate();

  const equip = useMemo(() => (equipments[equipSelected || '']), [equipSelected]);
  const fighterToCommand = useMemo(() => (
    battleState?.fighters?.[toCommand || '']
  ), [JSON.stringify(battleState), toCommand]);
  const targetOptionsFighterPlacement = useMemo(() => {
    if (uiState === BUS.INTRO_TEXT_READING) return [];
    let targetOptionsFighterPlacement: [number, number][] = [];
    const fighter = battleState?.fighters?.[toCommand || ''];
    if (fighter) {
      const toCommandNeedsPlacement = fighter.coords[1] === -1;
      if (toCommandNeedsPlacement) {
        targetOptionsFighterPlacement = getCoordsOnSide(
          { battleState, side: fighter.side, onlyOpenSpaces: true }
        );
        return targetOptionsFighterPlacement;
      }
    }
    return targetOptionsFighterPlacement;
  }, [JSON.stringify(battleState), toCommand, uiState]);
  const targetOptionsEquipment = useMemo(() => (
    equip?.getCanTarget?.({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) ?? []
  ), [equip]);
  const targetsStaticallySelected = useMemo(() => (
    equip?.getStaticTargets?.({
      battleState: battleState || battleStateEmpty,
      userId: (toCommand || '')
    }) ?? []
  ), [equip]);
  const targetOptions = useMemo(() => {
    if (targetOptionsFighterPlacement.length > 0) return targetOptionsFighterPlacement;
    if (targetOptionsEquipment && uiState === BUS.TARGET_SELECT) return targetOptionsEquipment;
    return [];
  }, [targetOptionsFighterPlacement, targetOptionsEquipment, uiState]);

  const battleStateIncomingHandle = () => {
    if (!battleState) return;
    const isNewRound = (battleState?.round || 0) > roundCurrent;
    if (isNewRound || battleState.conclusion) {
      setRoundCurrent(battleState.round);
    }
    const fighter = battleState.fighters[toCommand || ''];
    const toCommandNeedsPlacement = fighter?.coords?.[1] === -1;
    const anyFightersNeedPlacement = Object.values(battleState.fighters || {})
    .some((f) => f.coords?.[1] === -1);
    
    if (anyFightersNeedPlacement && !introTextRead) {
      setUiState(BUS.INTRO_TEXT_READING);
    }
    else if (toCommandNeedsPlacement) {
      setUiState(BUS.FIGHTER_PLACEMENT);
    }
    else if (anyFightersNeedPlacement) {
      setUiState(BUS.WAITING);
    }
    if (
      ((!isNewRound && roundCurrent > 0) || anyFightersNeedPlacement)
      && (uiState !== BUS.INACTIVE)
    ) return;

    if (battleState.conclusion) {
      setUiState(BUS.OUTRO_TEXT_READING);
    }
    else if ((subCommandsResolved || []).length > 0) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    else if (toCommand) {
      setUiState(BUS.INTENTIONS_READING);
    };
    setEquipSelected(null);
    setTargetSelected(null);
  };
  useEffect(battleStateIncomingHandle, 
    [JSON.stringify(battleState), toCommand, introTextRead, roundCurrent]
  );

  const equipmentSelectedUpdateUIState = () => {
    // If only one available target, skip ahead to confirmation
    const equipment = equipments[equipSelected ?? ''];
    if ((targetOptionsEquipment[0] && targetOptionsEquipment.length === 1)) {
      setTargetSelected(targetOptionsEquipment[0]);
      setUiState(BUS.CONFIRM);
    }
    else if (equipment?.getStaticTargets) {
      setUiState(BUS.CONFIRM);
    }
    else if (equipSelected) {
      setUiState(BUS.TARGET_SELECT);
    };
  };
  useEffect(equipmentSelectedUpdateUIState, [equipSelected]);

  const targetSelectedUpdateUIState = () => {
    if (targetSelected) {
      if (uiState === BUS.FIGHTER_PLACEMENT && account?.id && toCommand) {
        setOutgoingToAdd(new MessageClient({ payload: {
          kind: MESSAGE_KINDS.FIGHTER_PLACED,
          accountId: account.id,
          toCommand,
          coords: targetSelected
        } }));
        setUiState(BUS.WAITING);
      }
      else {
        setUiState(BUS.CONFIRM);
      };
    };
  };
  useEffect(targetSelectedUpdateUIState, [targetSelected]);

  const submitCommand = () => {
    if (!battleState || !toCommand || !equip || !account) {
      throw Error("Data missing from submitCommand");
    }
    const targetId = (equip.targetType === 'id' && targetSelected)
      ? getOccupantIdFromCoords({ battleState, coords: targetSelected })
      : undefined;
    const targetCoords = (equip.targetType === 'coords' && targetSelected) ? targetSelected : undefined;
    const command: Command = {
      id: uuid(),
      fromId: toCommand,
      equipmentId: equip.id,
      targetId,
      targetCoords
    };
    setOutgoingToAdd(new MessageClient({
      payload: { kind: MESSAGE_KINDS.COMMAND_SEND, command, accountId: account?.id }
    }));
    setUiState(BUS.WAITING);
  };

  const readyForChamberNew = () => {
    if (!account) return;

    // setIntroTextRead(false);
    // setBattleState(null);
    // setBattleStateLast(null);
    // setBattleStateFuture(null);
    // setSubCommandsResolved(null);
    // setSubCommandsResolvedFuture(null);
    // setRoundCurrent(-1);

    setOutgoingToAdd(new MessageClient({
      // accountId: account.id,
      // payload: {
      //   kind: MESSAGE_KINDS.CHAMBER_READY_FOR_NEW
      // }
    }));
  };

  const backClick = () => {
    if (uiState === BUS.INTENTIONS_READING) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    if (uiState === BUS.EQUIPMENT_SELECT) setUiState(BUS.INTENTIONS_READING);
    if (uiState === BUS.TARGET_SELECT) {
      setEquipSelected(null);
      setUiState(BUS.EQUIPMENT_SELECT);
    }
    if (uiState === BUS.CONFIRM) {
      setTargetSelected(null);
      if (targetOptionsEquipment.length > 1) {
        setUiState(BUS.TARGET_SELECT);
      }
      else {
        setEquipSelected(null);
        setUiState(BUS.EQUIPMENT_SELECT);
      }
    }
  };

  const nextClick = (uiStateCurrent: BATTLE_UI_STATES) => {
    if (uiStateCurrent === BUS.INTRO_TEXT_READING) {
      setIntroTextRead(true);
    }
    else if (uiStateCurrent === BUS.ACTIONS_RESOLVED_READING) {
      setUiState(BUS.INTENTIONS_READING);
    }
    else if (uiStateCurrent === BUS.INTENTIONS_READING) {
      setUiState(BUS.EQUIPMENT_SELECT);
    }
    else if (uiStateCurrent === BUS.OUTRO_TEXT_READING) {
      setUiState(BUS.CONCLUSION);
    }
    else if (uiStateCurrent === BUS.CONCLUSION) {
      setUiState(BUS.TREASURE_CLAIMING);
    }
  };

  if (!battleState) return (
    <section id="battle-missing">
      <span className="title">{`Cavern Havok`}</span>
      <div className="text-large">{`Somehow, this battle is missing. Nothing left to do here.`}</div>
      <button type="button" className="btn-large" onClick={() => navigate(`/`)}>
        {`Back to room`}
      </button>
    </section>
  );
  
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
                battleStateFuture={battleStateFuture}
                subCommandsResolvedFuture={subCommandsResolvedFuture}
                targetOptions={targetOptions}
                targetSelected={targetSelected}
                setTargetSelected={setTargetSelected}
                targetsStaticallySelected={targetsStaticallySelected}
              /> 
            ))}
          </div>
        ))}
      </div>

      {(uiState === BUS.INTRO_TEXT_READING) && (
        <div className="bottom-container">
          <div className="text-large">{battleState.texts.introText}</div>
          <button onClick={() => nextClick(uiState)}>{`Next`}</button>
        </div>
      )}

      {(uiState === BUS.FIGHTER_PLACEMENT && fighterToCommand) && (
        <div className="bottom-container">
          <div className="text-large">{`Place ${fighterToCommand.name} on the battlefield.`}</div>
        </div>
      )}

      {(uiState === BUS.ACTIONS_RESOLVED_READING && (subCommandsResolved || []).length > 0) && (
        <div className="bottom-container">
          <div>
            {(subCommandsResolved || []).map((subCommandResolved) => (
              subCommandResolved.outcomes.map((outcome, index) => (
                <OutcomeText
                  key={`${subCommandResolved.commandId}-${index}-outcome`}
                  outcome={outcome}
                  battleState={battleStateLast ?? battleState}
                />
              ))
            ))}
          </div>
          <button onClick={() => nextClick(uiState)}>{`Next`}</button>
        </div>
      )}

      {(uiState === BUS.INTENTIONS_READING) && (
        <div className="bottom-container">
          <div>
            {Object.values(battleState.commandsPending).map((command) => (
              <IntentionText
                key={`${command.id}-intention`}
                command={command}
                battleState={battleState}
              />
            ))}
          </div>
          <button onClick={() => nextClick(uiState)}>{`Next`}</button>
        </div>
      )}

      {uiState === BUS.WAITING && (
        <p className="waiting-text">{`Waiting for other players...`}</p>
      )}

      {(uiState === BUS.OUTRO_TEXT_READING) && (
        <div className="bottom-container">
          <div className="text-large">
            {battleState.conclusion === 'Side A wins!' && battleState.texts.victoryText}
            {battleState.conclusion === 'Side B wins...' && battleState.texts.defeatText}
            {battleState.conclusion === 'Draw!' && "Everybody lost this one!"}
          </div>
          <button onClick={() => nextClick(uiState)}>{`Next`}</button>
        </div>
      )}

      {((uiState === BUS.INTENTIONS_READING && (subCommandsResolved || []).length > 0)
        || uiState === BUS.EQUIPMENT_SELECT || uiState === BUS.TARGET_SELECT
        || uiState === BUS.CONFIRM) && (
        <div className="btn-back-container">
          <button onClick={backClick}>{`Back`}</button>
        </div>
      )}

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
      
      {uiState === BUS.CONCLUSION && (
        <section className="conclusion-section">
          <span className="title">{`Battle over!`}</span>
          <p className="text-large">
            {battleState?.conclusion}
          </p>
          <button type="button" className="btn-large" onClick={() => nextClick(uiState)}>
          {`What'd we find?`}
        </button>
        </section>
      )}

      {uiState === BUS.TREASURE_CLAIMING && (
        <TreasureSelect
          treasures={(battleState.treasures && account) && battleState.treasures[account.id]}
          readyForChamberNew={readyForChamberNew}
        />
      )}
    </section>
  )
};