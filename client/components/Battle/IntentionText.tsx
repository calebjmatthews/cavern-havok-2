import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import equipments, { equipmentMissing } from "@common/instances/equipments";

export default function IntentionText(props: {
  command: Command,
  battleState: BattleState
}) {
  const { command, battleState } = props;

  const intentionText = useMemo(() => {
    const user = battleState.fighters[command.fromId];
    if (!user) return `There are no intentions.`;
    const piece = user.equipped.find((p) => p.id = command.pieceId);
    const equipment = equipments[piece?.equipmentId ?? ''] ?? equipmentMissing;
    let text = `${user.name} plans to use ${equipment.id}`;
    const target = (command.targetId)
      ? battleState.fighters[command.targetId]
      : command.targetCoords;
    if (!target) return text;
    if ("id" in target && target.id === user.id) {
      return `${text} on themselves.`;
    }
    if ("id" in target) {
      return `${text} on ${target.name}.`;
    }
    return `${text} on ${target}`;
  }, [command, battleState]);
  
  return (
    <p>{intentionText}</p>
  )
};