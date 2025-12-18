import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";

export default function IntentionText(props: {
  command: Command,
  battleState: BattleState
}) {
  const { command, battleState } = props;

  const intentionText = useMemo(() => {
    const user = battleState.fighters[command.fromId];
    if (!user) return `The user has no intentions.`;
    let text = `${user.name} plans to use ${command.equipmentId}`;
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