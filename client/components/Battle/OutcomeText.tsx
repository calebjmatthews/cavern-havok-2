import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";

export default function OutcomeText(props: {
  outcome: Outcome,
  battleState: BattleState
}) {
  const { outcome, battleState } = props;

  const outcomeText = useMemo(() => {
    const user = battleState.fighters[outcome.userId];
    if (!user) return `The user vanished entirely.`;
    if (outcome.moveTo) return `${user.name} moved to ${outcome.moveTo}`;
    const affected = battleState.fighters[outcome.affectedId || ''];
    const toSelf = user.id === affected?.id;
    if (outcome.skippedBecauseDowned) {
      return `${user.name} is knocked down and out.`;
    }
    if (outcome.damage && affected) {
      return `${user.name} attacked ${affected.name} for ${outcome.damage}.`;
    }
    if (outcome.defense && toSelf) {
      return `${user.name} toughened up for ${outcome.defense} defense.`;
    }
    if (outcome.charge && toSelf) {
      return `${user.name} used up ${outcome.charge} charge.`;
    }
    
    return `${user.name} did something weird: ${JSON.stringify(outcome)}`;
  }, [outcome, battleState]);
  

  return (
    <p>{outcomeText}</p>
  )
};