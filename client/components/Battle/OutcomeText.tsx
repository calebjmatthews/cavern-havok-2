import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import getOccupantById from "@common/functions/positioning/getOccupantById";

export default function OutcomeText(props: {
  outcome: Outcome,
  battleState: BattleState
}) {
  const { outcome, battleState } = props;

  const outcomeText = useMemo(() => {
    const user = battleState.fighters[outcome.userId];
    if (!user) return `The user vanished entirely.`;
    if (outcome.moveTo) return `${user.name} moved to ${outcome.moveTo}`;
    const affected = getOccupantById({ battleState, occupantId: (outcome.affectedId || '') });
    const toSelf = user.id === affected?.id;
    if (outcome.skippedBecauseDowned) {
      return `${user.name} is knocked down and out.`;
    };
    if (outcome.sufferedDamage && outcome.defenseDamaged && affected) {
      return `${user.name} attacked ${affected.name} to weaken defense by ${outcome.defenseDamaged} and for ${outcome.sufferedDamage} damage.`;
    };
    if (outcome.defenseDamaged && affected) {
      return `${user.name} attacked ${affected.name} to weaken defense by ${outcome.defenseDamaged}.`;
    };
    if (outcome.sufferedDamage && affected) {
      return `${user.name} attacked ${affected.name} for ${outcome.sufferedDamage} damage.`;
    };
    if (outcome.defense && toSelf) {
      return `${user.name} toughened up for ${outcome.defense} defense.`;
    };
    if (outcome.defense && affected) {
      return `${user.name} protected ${affected.name} for ${outcome.defense} defense.`;
    };
    if (outcome.charge && toSelf) {
      return `${user.name} used up ${outcome.charge} charge.`;
    };
    if (outcome.makeObstacle) {
      return `${user.name} created a ${outcome.makeObstacle.kind} at ${outcome.makeObstacle.coords}.`;
    };
    if (outcome.sufferedDamage) {
      return `${user.name} attacked someone unknown for ${outcome.sufferedDamage} damage.`;
    };
    
    return `${user.name} did something weird: ${JSON.stringify(outcome)}`;
  }, [outcome, battleState]);
  

  return (
    <p>{outcomeText}</p>
  )
};