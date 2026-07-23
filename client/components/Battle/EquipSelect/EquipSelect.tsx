import range from "@common/functions/utils/range";
import { Fragment, useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Equipment from "@common/models/equipment";
import type EquipmentPiece from "@common/models/equipmentPiece";
import RichTextRenderer from "@client/components/RichTextRenderer/RichTextRenderer";
import Fighter from "@common/models/fighter";
import equipments, { equipmentMissing } from '@common/instances/equipments';
import getEquipmentName from "@common/functions/getEquipmentName";
import getSortedPieces from "@client/functions/getSortedPieces";
import { EQUIPMENT_SLOTS } from "@common/enums";
import "./equipSelect.css"

const MAX_EQUIPS_MAIN = 4;

export default function EquipSelect(props: {
  battleState: BattleState,
  toCommand: string,
  setPieceSelected: (equipment: string) => void
}) {
  const { battleState, toCommand, setPieceSelected } = props;

  const user = useMemo(() => (
    battleState.fighters[toCommand] || new Fighter()
  ), [battleState, toCommand]);

  const topEquip = useMemo(() => (
    user.equipped.map((ep) => ({ piece: ep, equipment: equipments[ep.equipmentId] ?? equipmentMissing }))
    .find((equip) => equip.equipment.slot === EQUIPMENT_SLOTS.TOP)
  ), [battleState, toCommand]);
  const mainEquips = useMemo(() => (
    getSortedPieces(user.equipped)
    .map((ep) => ({ piece: ep, equipment: equipments[ep.equipmentId] ?? equipmentMissing }))
    .filter((equip) => (
      equip.equipment?.slot === EQUIPMENT_SLOTS.MAIN && !equip.equipment?.isStyle
    ))
  ), [battleState, toCommand]);
  const bottomEquip = useMemo(() => (
    user.equipped.map((ep) => ({ piece: ep, equipment: equipments[ep.equipmentId] ?? equipmentMissing }))
    .find((equip) => equip.equipment.slot === EQUIPMENT_SLOTS.BOTTOM)
  ), [battleState, toCommand]);

  return (
    <>

      {topEquip && (
        <EquipSelectPanel
          equip={topEquip}
          isTopBottom={true}
          setPieceSelected={setPieceSelected}
          battleState={battleState}
          toCommand={toCommand}
        />
      )}
      {!topEquip && (
        <div className="select-panel select-empty top-bottom-select">
          {`(Nothing equipped)`}
        </div>
      )}

      {[0, 1].map((evenOrOdd) => (
        <div key={`equip-select-main-${evenOrOdd}`} className="select-main-column">
          {range(0, (MAX_EQUIPS_MAIN-1)).filter((n) => n % 2 === evenOrOdd).map((index) => {
            const mainEquip = mainEquips[index];
            return (<Fragment key={`${index}-main-select`}>
              {mainEquip && (
                <EquipSelectPanel
                  equip={mainEquip}
                  isTopBottom={false}
                  setPieceSelected={setPieceSelected}
                  battleState={battleState}
                  toCommand={toCommand}
                />
              )}
              {!mainEquip && (
                <div className="select-panel main-select select-empty">
                  {`(Nothing equipped)`}
                </div>
              )}
            </Fragment>);
          })}
        </div>)
      )}

      {bottomEquip && (
        <EquipSelectPanel
          equip={bottomEquip}
          isTopBottom={true}
          setPieceSelected={setPieceSelected}
          battleState={battleState}
          toCommand={toCommand}
        />
      )}
      {!bottomEquip && (
        <div className="select-panel select-empty top-bottom-select">
          {`(Nothing equipped)`}
        </div>
      )}

    </>
  )
};

function EquipSelectPanel(props: {
  equip: { piece: EquipmentPiece, equipment: Equipment },
  isTopBottom: boolean,
  setPieceSelected: (equipment: string) => void,
  battleState: BattleState,
  toCommand: string
}) {
  const { equip, isTopBottom, setPieceSelected, battleState, toCommand } = props;

  const className = useMemo(() => (
    isTopBottom ? "select-panel top-bottom-select" : "select-panel main-select"
  ), [isTopBottom]);

  const disabled = useMemo(() => (
    equip.equipment.getCanUse
    ? !(equip.equipment.getCanUse({ battleState, userId: toCommand }))
    : false
  ), [equip, battleState]);

  const description = useMemo(() => (
    equip.equipment.getDescription({ piece: equip.piece, battleState, userId: toCommand })
  ), [equip, battleState, toCommand]);

  return (
    <div className={className}>
      <div className="text-large">
        <RichTextRenderer richText={getEquipmentName(equip.piece)} />
      </div>
      <div className="select-description">
        <RichTextRenderer richText={description} />
      </div>
      <button onClick={() => setPieceSelected(equip.piece.id)} disabled={disabled}>
        {`Use`}
      </button>
    </div>
  );
};