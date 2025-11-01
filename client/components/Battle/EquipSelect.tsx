import range from "@common/functions/utils/range";
import { Fragment, useMemo } from "react";

import type BattleState from "@common/models/battleState";
import Fighter from "@common/models/fighter";
import equipments from '@common/instances/equipments';
import { EQUIPMENT_SLOTS } from "@common/enums";
import type Equipment from "@common/models/equipment";

export default function EquipSelect(props: {
  battleState: BattleState,
  toCommand: string,
  setEquipSelected: (equipment: string) => void
}) {
  const { battleState, toCommand, setEquipSelected } = props;

  const user = useMemo(() => (
    battleState.fighters[toCommand] || new Fighter()
  ), [battleState, toCommand]);

  const topEquip = useMemo(() => (
    user.equipment.map((id) => equipments[id])
    .find((equipment) => equipment?.slot === EQUIPMENT_SLOTS.TOP)
  ), [battleState, toCommand]);
  const mainEquips = useMemo(() => (
    user.equipment.map((id) => equipments[id])
    .filter((equipment) => (equipment !== undefined))
    .filter((equipment) => (equipment?.slot === EQUIPMENT_SLOTS.MAIN))
  ), [battleState, toCommand]);
  const bottomEquip = useMemo(() => (
    user.equipment.map((id) => equipments[id])
    .find((equipment) => equipment?.slot === EQUIPMENT_SLOTS.BOTTOM)
  ), [battleState, toCommand]);

  return (
    <section id="equip-select">

      {topEquip && (
        <EquipSelectPanel
          equip={topEquip}
          isTopBottom={true}
          setEquipSelected={setEquipSelected}
          battleState={battleState}
          toCommand={toCommand}
        />
      )}
      {!topEquip && (
        <div className="select-panel select-empty top-bottom-select">
          {`(Nothing equipped)`}
        </div>
      )}

      <div id="select-main-container">
        {range(0, 3).map((index) => {
          const mainEquip = mainEquips[index];
          return (<Fragment key={`${index}-main-select`}>
            {mainEquip && (
              <EquipSelectPanel
                equip={mainEquip}
                isTopBottom={false}
                setEquipSelected={setEquipSelected}
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
      </div>

      {bottomEquip && (
        <EquipSelectPanel
          equip={bottomEquip}
          isTopBottom={true}
          setEquipSelected={setEquipSelected}
          battleState={battleState}
          toCommand={toCommand}
        />
      )}
      {!bottomEquip && (
        <div className="select-panel select-empty top-bottom-select">
          {`(Nothing equipped)`}
        </div>
      )}

    </section>
  )
};

function EquipSelectPanel(props: {
  equip: Equipment,
  isTopBottom: boolean,
  setEquipSelected: (equipment: string) => void,
  battleState: BattleState,
  toCommand: string
}) {
  const { equip, isTopBottom, setEquipSelected, battleState, toCommand } = props;

  const className = useMemo(() => (
    isTopBottom ? "select-panel top-bottom-select" : "select-panel main-select"
  ), [isTopBottom]);

  const disabled = useMemo(() => (
    equip.getCanUse ? !(equip.getCanUse({ battleState, userId: toCommand })) : false
  ), [equip, battleState]);

  return (
    <div className={className}>
      <div className="text-large">{equip.id}</div>
      <div className="select-description">{equip.description}</div>
      <button onClick={() => setEquipSelected(equip.id)} disabled={disabled}>
        {`Use`}
      </button>
    </div>
  );
};