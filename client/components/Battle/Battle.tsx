import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

import type Command from "@common/models/command";
import type OutletContext from "@client/models/outlet_context";
import type Treasure from '@common/models/treasure';
import type BattleState from '@common/models/battleState';
import type ActionResolved from '@common/models/actionResolved';
import Spot from "./Spot";
import EquipmentSelect from "./EquipSelect";
import OutcomeText from './OutcomeText';
import IntentionText from './IntentionText';
import MessageClient from '@common/communicator/message_client';
import TreasureSelect from './TreasureSelect';
import TreasureOutcomes from './TreasureOutcomes';
import range from "@common/functions/utils/range";
import equipments from "@common/instances/equipments";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
import getCoordsOnSide from '@common/functions/positioning/getCoordsOnSide';
import applyPossibleCommand from './applyPossibleCommand';
import { battleStateEmpty } from "@common/models/battleState";
import { genId } from "@common/functions/utils/random";
import { BATTLE_UI_STATES } from "@client/enums";
import { MESSAGE_KINDS } from "@common/enums";
import "./battle.css";
const BUS = BATTLE_UI_STATES;

export default function Battle() {
  const [uiState, setUiState] = useState(BUS.INACTIVE);
  const [roundCurrent, setRoundCurrent] = useState(-1);
  const [pieceSelected, setPieceSelected] = useState<string | null>();
  const [targetSelected, setTargetSelected] = useState<[number, number] | null>(null);
  const [introTextRead, setIntroTextRead] = useState(false);
  const [battleStatePossible, setBattleStatePossible] = useState<BattleState | null>(null);
  const [actionPossible, setActionPossible] = useState<ActionResolved | null>(null);
  const outletContext: OutletContext = useOutletContext();
  const {
    battleState, setBattleState, battleStateLast, setBattleStateLast, battleStateFuture, 
    setBattleStateFuture, actionsResolved, setActionsResolved, actionsResolvedFuture, 
    setActionsResolvedFuture, toCommand, setOutgoingToAdd, account, treasuresApplying,
    setTreasuresApplying, setModalToAdd
  } = outletContext;
  const navigate = useNavigate();

  const fighterToCommand = useMemo(() => (
    battleState?.fighters?.[toCommand || '']
  ), [JSON.stringify(battleState), toCommand]);
  const piece = useMemo(() => (
    fighterToCommand?.equipped.find((p) => p.id === pieceSelected)
  ), [fighterToCommand, pieceSelected]);
  const equip = useMemo(() => (equipments[piece?.equipmentId || '']), [piece]);
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
  const treasuresCindersGuaranteed = useMemo(() => {
    const treasures = battleState?.treasures?.[account?.id ?? ''];
    return (treasures ?? []).filter((t) => t.isGuaranteed && t.kind === 'cinders')?.[0]
  }, [battleState?.treasures]);

  const battleStateIncomingHandle = () => {
    if (!battleState) return;
    const isNewRound = (battleState?.round ?? 0) > roundCurrent;
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
      return;
    };

    if (!isNewRound && (uiState !== BUS.INACTIVE && uiState !== BUS.WAITING)) return;
    
    if (battleState.conclusion) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    else if ((actionsResolved || []).length > 0) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    else if (toCommand) {
      setUiState(BUS.INTENTIONS_READING);
    };
  };
  useEffect(battleStateIncomingHandle, 
    [JSON.stringify(battleState), toCommand, introTextRead, roundCurrent]
  );

  const pieceSelectedUpdateUIState = () => {
    // If only one available target, skip ahead to confirmation
    const equipment = equipments[piece?.equipmentId ?? ''];
    if ((targetOptionsEquipment[0] && targetOptionsEquipment.length === 1)) {
      setTargetSelected(targetOptionsEquipment[0]);
      setUiState(BUS.CONFIRM);
    }
    else if (equipment?.getStaticTargets) {
      setUiState(BUS.CONFIRM);
    }
    else if (piece) {
      setUiState(BUS.TARGET_SELECT);
    };
  };
  useEffect(pieceSelectedUpdateUIState, [piece]);

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
        if (battleState && piece && toCommand) {
          const { battleStatePossibleNext, actionPossibleNext } = applyPossibleCommand({
            battleState, toCommand, piece, targetSelected
          });
          setBattleStatePossible(battleStatePossibleNext);
          if (actionPossibleNext) setActionPossible(actionPossibleNext);
        };
        setUiState(BUS.CONFIRM);
      };
    };
  };
  useEffect(targetSelectedUpdateUIState, [targetSelected]);

  const submitCommand = () => {
    if (!battleState || !toCommand || !equip || !account || !pieceSelected) {
      throw Error("Data missing from submitCommand");
    }
    const targetId = (equip.targetType === 'id' && targetSelected)
      ? getOccupantIdFromCoords({ battleState, coords: targetSelected })
      : undefined;
    const targetCoords = (equip.targetType === 'coords' && targetSelected) ? targetSelected : undefined;
    const command: Command = {
      id: genId(),
      fromId: toCommand,
      pieceId: pieceSelected,
      targetId,
      targetCoords
    };    
    setOutgoingToAdd(new MessageClient({
      payload: { kind: MESSAGE_KINDS.COMMAND_SEND, command, accountId: account?.id }
    }));
    setBattleStatePossible(null);
    setActionPossible(null);
    setPieceSelected(null);
    setTargetSelected(null);
    setUiState(BUS.WAITING);
  };

  const onTreasureSelect = (treasure: Treasure) => {
    if (!account) return;

    setUiState(BUS.TREASURE_OUTCOMES);
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: {
        kind: MESSAGE_KINDS.TREASURE_SELECTED,
        treasure
      }
    }));
  };

  const readyForChamberNew = () => {
    if (!account) return;

    setUiState(BUS.POST_CONCLUSION);
    setIntroTextRead(false);
    setBattleState(null);
    setBattleStateLast(null);
    setBattleStateFuture(null);
    setActionsResolved(null);
    setActionsResolvedFuture(null);
    setTreasuresApplying(null);
    setRoundCurrent(-1);

    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: { kind: MESSAGE_KINDS.CHAMBER_READY_FOR_NEW }
    }));
  };

  const backClick = () => {
    if (uiState === BUS.INTENTIONS_READING) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    if (uiState === BUS.EQUIPMENT_SELECT) {
      setUiState(BUS.INTENTIONS_READING);
    }
    if (uiState === BUS.TARGET_SELECT) {
      setPieceSelected(null);
      setUiState(BUS.EQUIPMENT_SELECT);
    }
    if (uiState === BUS.CONFIRM) {
      setTargetSelected(null);
      setBattleStatePossible(null);
      setActionPossible(null);
      if (targetOptionsEquipment.length > 1) {
        setUiState(BUS.TARGET_SELECT);
      }
      else {
        setPieceSelected(null);
        setUiState(BUS.EQUIPMENT_SELECT);
      }
    }
  };

  const nextClick = (uiStateCurrent: BATTLE_UI_STATES) => {
    if (uiStateCurrent === BUS.INTRO_TEXT_READING) {
      setIntroTextRead(true);
    }
    else if (uiStateCurrent === BUS.ACTIONS_RESOLVED_READING && !battleState?.conclusion) {
      setUiState(BUS.INTENTIONS_READING);
    }
    else if (uiStateCurrent === BUS.ACTIONS_RESOLVED_READING && battleState?.conclusion) {
      setUiState(BUS.OUTRO_TEXT_READING);
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

  if (uiState === BUS.POST_CONCLUSION)  return (
    <section id="battle-post-conclusion">
      <div className="text-large">{`Waiting for other players...`}</div>
    </section>
  );

  if (!battleState) return (
    <section className="container">
      <span className="title">{`Cavern Havok`}</span>
      <div className="text-large">{`This battle is over now. Nothing left to do here.`}</div>
      <button type="button" className="btn-large" onClick={() => navigate(`/`)}>
        {`Back to room`}
      </button>
    </section>
  );
  
  return (
    <section id="battle">
      <div id="battle-background-wrapper">
        <img id="battle-background" src={"/public/background_cave.png"} />
      </div>
      <header id="battle-header">
        <div id="battle-header-contents">
          <div id="cinders-spacer">{(fighterToCommand) ? `c${fighterToCommand.cinders}` : ''}</div>
          <h1>{`${uiState} | ${!!piece}`}</h1>
          {/* <h1>{`Battle!`}</h1> */}
          <div>{(fighterToCommand) ? `c${fighterToCommand.cinders}` : ''}</div>
        </div>
      </header>
      <div id="battlefield">
        {[0, (battleState.size[0])].map((colMin) => (
          <div key={`battlefield-side-${colMin}`} className='battlefield-side'>
            {range(0, (battleState.size[1] - 1)).map((row) => (
              <div key={`${row}-row`} className="battle-row">
                {range(colMin, (colMin + (battleState.size[0]) - 1)).map((col) => (
                  <Spot
                    key={`c${col}-r${row}-spot`}
                    coords={[col, row]}
                    battleState={battleState}
                    battleStateFuture={battleStatePossible ?? battleStateFuture}
                    actionsResolvedFuture={actionsResolvedFuture}
                    targetOptions={targetOptions}
                    targetSelected={targetSelected}
                    setTargetSelected={setTargetSelected}
                    targetsStaticallySelected={targetsStaticallySelected}
                    setModalToAdd={setModalToAdd}
                  /> 
                ))}
              </div>
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

      {(uiState === BUS.ACTIONS_RESOLVED_READING && (actionsResolved || []).length > 0) && (
        <div className="bottom-container">
          <div>
            {(actionsResolved || []).map((actionResolved) => (
              actionResolved.outcomes.map((outcome, index) => (
                <OutcomeText
                  key={`${actionResolved.commandId}-${index}-outcome`}
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

      {((uiState === BUS.INTENTIONS_READING && (actionsResolved || []).length > 0)
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
          setPieceSelected={setPieceSelected}
        />
      )}

      {uiState === BUS.CONFIRM && (
        <div className="bottom-container command-confirm">
          <div className="text-large">
            {actionPossible?.outcomes.map((outcome, index) => (
              <OutcomeText
                key={`${actionPossible.commandId}-${index}-outcome`}
                outcome={outcome}
                battleState={battleStateLast ?? battleState}
                futureTense
              />
            ))}
          </div>
          <button className="btn-large btn-confirm" onClick={submitCommand}>
            {`Go!`}
          </button>
        </div>
      )}
      
      {uiState === BUS.CONCLUSION && (
        <section className="conclusion-section">
          <span className="title">{`Battle over!`}</span>
          <p className="text-large">
            {battleState?.conclusion}
          </p>
          {treasuresCindersGuaranteed && (
            <p className="treasure-guaranteed-text">
              {`You collected ${treasuresCindersGuaranteed.quantity} cinders the enemies left lying around. But there's better treasure than that here!`}
            </p>
          )}
          <button type="button" className="btn-large" onClick={() => nextClick(uiState)}>
          {`What'd we find?`}
        </button>
        </section>
      )}

      {uiState === BUS.TREASURE_CLAIMING && (
        <TreasureSelect
          treasures={(battleState.treasures && account) && battleState.treasures[account.id]}
          onTreasureSelect={onTreasureSelect}
        />
      )}

      {(uiState === BUS.TREASURE_OUTCOMES && treasuresApplying) && (
        <TreasureOutcomes
          treasuresApplying={treasuresApplying}
          readyForChamberNew={readyForChamberNew}
        />
      )}
    </section>
  )
};