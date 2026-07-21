import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

import type Command from "@common/models/command";
import type OutletContext from "@client/models/outlet_context";
import type Treasure from '@common/models/treasure';
import type BattleState from '@common/models/battleState';
import type ActionResolved from '@common/models/actionResolved';
import MessageClient from '@common/communicator/message_client';
import TreasureSelect from '../TreasureSelect/TreasureSelect';
import TreasureOutcomes from '../TreasureOutcomes/TreasureOutcomes';
import SpotGrid from "./Spot/SpotGrid";
import BarsGrid from "./BarsGrid/BarsGrid";
import BottomContainer from "./BottomContainer/BottomContainer";
import equipments from "@common/instances/equipments";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
import getCoordsOnSide from '@common/functions/positioning/getCoordsOnSide';
import applyPossibleCommand from './utils/applyPossibleCommand';
import { battleStateEmpty } from "@common/models/battleState";
import { genId } from "@common/functions/utils/random";
import { BATTLE_UI_STATES } from "@client/enums";
import { MESSAGE_KINDS } from "@common/enums";
import "./battle.css";
import performCommands from "@common/functions/battleLogic/performCommands/performCommands";
const BUS = BATTLE_UI_STATES;

export default function Battle() {
  const [uiState, setUiState] = useState(BUS.INACTIVE);
  const [roundCurrent, setRoundCurrent] = useState(-1);
  const [pieceSelected, setPieceSelected] = useState<string | null>();
  const [targetSelected, setTargetSelected] = useState<[number, number] | null>(null);
  const [introTextRead, setIntroTextRead] = useState(false);
  const [battleStateFuture, setBattleStateFuture] = useState<BattleState | null>(null);
  const [actionPossible, setActionPossible] = useState<ActionResolved | null>(null);
  const [actionsResolvedFuture, setActionsResolvedFuture] = useState<ActionResolved[] | null>(null);

  const outletContext: OutletContext = useOutletContext();
  const {
    battleState, setBattleState, battleStateLast, setBattleStateLast, actionsResolved, 
    setActionsResolved, toCommand, setOutgoingToAdd, account, treasuresApplying, setTreasuresApplying, 
    setModalToAdd, artistRef
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
    equip?.getAllowedTargets?.({
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
    const isNewRound = (battleState?.round ?? 0) > roundCurrent;
    if (isNewRound || battleState.conclusion) {
      setRoundCurrent(battleState.round);
    };
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

    const resultFuture = performCommands(battleState);
    setBattleStateFuture(resultFuture.battleState);
    setActionsResolvedFuture(resultFuture.actionsResolved);

    console.log(`isNewRound: ${isNewRound}, uiState: ${uiState}`);

    if (!isNewRound && (uiState !== BUS.INACTIVE && uiState !== BUS.WAITING)) return;
    
    if (battleState.conclusion) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    else if ((actionsResolved || []).length > 0) {
      setUiState(BUS.ACTIONS_RESOLVED_READING);
    }
    else if ((fighter?.health ?? 0) > 0) {
      setUiState(BUS.INTENTIONS_READING);
    }
    else {
      setUiState(BUS.WAITING);
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
          const { battleStateFutureNext, actionPossibleNext } = applyPossibleCommand({
            battleState, toCommand, piece, targetSelected
          });
          setBattleStateFuture(battleStateFutureNext);
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
    setBattleStateFuture(null);
    setActionPossible(null);
    setPieceSelected(null);
    setTargetSelected(null);
    setUiState(BUS.WAITING);
  };

  const onTreasureSelect = (args: { chestKindId: string, treasure: Treasure }) => {
    const { chestKindId, treasure } = args;
    if (!account) return;

    setUiState(BUS.TREASURE_OUTCOMES);
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: {
        kind: MESSAGE_KINDS.TREASURE_SELECTED,
        chestKindId,
        treasures: [treasure]
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
      setBattleStateFuture(null);
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
    const fighterDowned = (fighterToCommand?.health ?? 0) <= 0;
    if (uiStateCurrent === BUS.INTRO_TEXT_READING) {
      setIntroTextRead(true);
    }
    else if (uiStateCurrent === BUS.ACTIONS_RESOLVED_READING && !battleState?.conclusion) {
      setUiState(BUS.INTENTIONS_READING);
    }
    else if (uiStateCurrent === BUS.ACTIONS_RESOLVED_READING && battleState?.conclusion) {
      setUiState(BUS.OUTRO_TEXT_READING);
    }
    else if (uiStateCurrent === BUS.INTENTIONS_READING && fighterDowned) {
      setUiState(BUS.WAITING);
    }
    else if (uiStateCurrent === BUS.INTENTIONS_READING && !fighterDowned) {
      setUiState(BUS.EQUIPMENT_SELECT);
    }
    else if (uiStateCurrent === BUS.OUTRO_TEXT_READING) {
      artistRef.current.cleanup();
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
      <header id="battle-header">
        <div id="battle-header-contents">
          <div id="cinders-spacer">{(fighterToCommand) ? `c${fighterToCommand.cinders}` : ''}</div>
          <h1>{`${uiState}`}</h1>
          {/* <h1>{`Battle!`}</h1> */}
          <div>{(fighterToCommand) ? `c${fighterToCommand.cinders}` : ''}</div>
        </div>
      </header>
      <div id="battlefield">
        <SpotGrid
          battleState={battleState}
          battleStateFuture={battleStateFuture}
          actionsResolvedFuture={actionsResolvedFuture}
          targetOptions={targetOptions}
          targetSelected={targetSelected}
          setTargetSelected={setTargetSelected}
          targetsStaticallySelected={targetsStaticallySelected}
          setModalToAdd={setModalToAdd}
          artistRef={artistRef}
        />
        <BarsGrid
          battleState={battleState}
          battleStateFuture={battleStateFuture}
          artistRef={artistRef}
          battleUiState={uiState}
        />
      </div>

      <BottomContainer
        uiState={uiState}
        battleState={battleState}
        battleStateLast={battleStateLast}
        nextClick={nextClick}
        backClick={backClick}
        toCommand={toCommand}
        setPieceSelected={setPieceSelected}
        fighterToCommand={fighterToCommand}
        actionsResolved={actionsResolved}
        actionPossible={actionPossible}
        submitCommand={submitCommand}
      />
      
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
          chests={(battleState.chestsToOpen && account) && battleState.chestsToOpen[account.id]}
          onTreasureSelect={onTreasureSelect}
          artistRef={artistRef}
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