import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";
import type ActionResolved from "@common/models/actionResolved";
import type Artist from "@client/models/artist/artist";
import OutcomeText from "../OutcomeText/OutcomeText";
import IntentionText from "../IntentionText/IntentionText";
import EquipSelect from "../EquipSelect/EquipSelect";
import { BATTLE_UI_STATES } from "@client/enums";
import clss from "@client/functions/clss";
import './bottomContainer.css';
import OutcomeTextMiss from "../OutcomeText/OutcomeTextMiss";
const BUS = BATTLE_UI_STATES;

export default function BottomContainer(props: {
  uiState: string,
  battleState: BattleState,
  battleStateLast: BattleState | null,
  nextClick: (uiState: BATTLE_UI_STATES) => void,
  backClick: () => void,
  toCommand: string | null,
  setPieceSelected: (piece: string | null | undefined) => void,
  fighterToCommand: Fighter | undefined,
  actionsResolved: ActionResolved[] | null,
  actionPossible: ActionResolved | null,
  submitCommand: () => void,
  artist: Artist
}) {
  const {
    uiState, battleState, battleStateLast, nextClick, backClick, toCommand, setPieceSelected,
    fighterToCommand, actionsResolved, actionPossible, submitCommand, artist
  } = props;

  const showBackClick = (
    (uiState === BUS.INTENTIONS_READING && (actionsResolved || []).length > 0)
    || uiState === BUS.EQUIPMENT_SELECT || uiState === BUS.CONFIRM
  );

  return (
    <div className={clss(['bottom-container', (uiState === BUS.CONFIRM ? 'command-confirm' : '')])}>
      {showBackClick && (
        <button onClick={backClick} className="button-back">{`Back`}</button>
      )}
      {!showBackClick && <span>{` `}</span>}

      {(uiState === BUS.FIGHTER_PLACEMENT && fighterToCommand) && (
        <>
          <div className="text-large">{`Place ${fighterToCommand.name} on the battlefield.`}</div>
        </>
      )}

      {(uiState === BUS.ACTIONS_RESOLVED_READING && (actionsResolved || []).length > 0) && (
        <>
          <div className="middle-section">
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
          <button onClick={() => nextClick(uiState)} className="button-next">{`Next`}</button>
        </>
      )}

      {(uiState === BUS.INTENTIONS_READING) && (
        <>
          <div className="middle-section">
            {Object.values(battleState.commandsPending).map((command) => (
              <IntentionText
                key={`${command.id}-intention`}
                command={command}
                battleState={battleState}
              />
            ))}
          </div>
          <button onClick={() => nextClick(uiState)} className="button-next">{`Next`}</button>
        </>
      )}

      {(uiState === BUS.EQUIPMENT_SELECT && toCommand) && (
        <EquipSelect
          battleState={battleState}
          toCommand={toCommand}
          setPieceSelected={setPieceSelected}
          artist={artist}
        />
      )}

      {(uiState === BUS.WAITING || uiState === BUS.POST_CONCLUSION) && (
        <p className="middle-section waiting-text">{`Waiting for other players...`}</p>
      )}

      {(uiState === BUS.OUTRO_TEXT_READING) && (
        <>
          <div className="middle-section text-large">
            {battleState.conclusion === 'Side A wins!' && battleState.texts.victoryText}
            {battleState.conclusion === 'Side B wins...' && battleState.texts.defeatText}
            {battleState.conclusion === 'Draw!' && "Everybody lost this one!"}
          </div>
          <button onClick={() => nextClick(uiState)} className="button-next">{`Next`}</button>
        </>
      )}

      {uiState === BUS.CONFIRM && (
        <>
          <div className="middle-section text-large">
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
        </>
      )}

      {(uiState === BUS.INTRO_TEXT_READING) && (
        <>
          <div className="text-large">{battleState.texts.introText}</div>
          <button onClick={() => nextClick(uiState)} className="button-next">{`Next`}</button>
        </>
      )}
    </div>
  );
};