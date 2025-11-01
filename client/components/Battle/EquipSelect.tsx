import range from "@common/functions/utils/range";
import { Fragment, useMemo } from "react";

import type BattleState from "@common/models/battleState";
import Fighter from "@common/models/fighter";
import equipments from '@common/instances/equipments';
import { EQUIPMENT_SLOTS } from "@common/enums";

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
        <div className="select-panel top-bottom-select">
          <div className="text-large">{topEquip.id}</div>
          <div className="select-description">{topEquip.description}</div>
          <button onClick={() => setEquipSelected(topEquip.id)}>{`Use`}</button>
        </div>
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
              <div className="select-panel main-select">
                <div className="text-large">{mainEquip.id}</div>
                <div className="select-description">{mainEquip.description}</div>
                <button onClick={() => setEquipSelected(mainEquip.id)}>{`Use`}</button>
              </div>
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
        <div className="select-panel top-bottom-select">
          <div className="text-large">{bottomEquip.id}</div>
          <div className="select-description">{bottomEquip.description}</div>
          <button onClick={() => setEquipSelected(bottomEquip.id)}>{`Use`}</button>
        </div>
      )}
      {!bottomEquip && (
        <div className="select-panel select-empty top-bottom-select">
          {`(Nothing equipped)`}
        </div>
      )}

    </section>
  )
};