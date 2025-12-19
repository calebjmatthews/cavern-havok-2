import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import { ALTERATION_SUB_COMMAND_RESOLVED } from "@common/constants";
import alterations from "@common/instances/alterations";

export default function OutcomeText(props: {
  outcome: Outcome,
  battleState: BattleState
}) {
  const { outcome, battleState } = props;

  const outcomeText = useMemo(() => {
    const affected = getOccupantById({ battleState, occupantId: (outcome.affectedId || '') });

    if (outcome.userId === ALTERATION_SUB_COMMAND_RESOLVED) {
      if (!affected) return `Someone experienced mystery.`;
      const alteration = alterations[outcome.alterationId ?? ''];
      if (!alteration) return `${affected.name} was affected by something mysterious.`;

      if (outcome.damage && affected) {
        return `${affected.name} was damaged ${outcome.damage} by ${alteration.id}.`;
      }
      else if (outcome.healing && affected) {
        return `${affected.name} was healed ${outcome.healing} by ${alteration.id}.`;
      }
      else if (outcome.bless && affected) {
        return `${affected.name} was Blessed with ${outcome.bless.extent} ${outcome.bless.alterationId} by ${alteration.id}.`;
      }
      else if (outcome.curse && affected) {
        return `${affected.name} was Cursed with ${outcome.curse.extent} ${outcome.curse.alterationId} by ${alteration.id}.`;
      }
      return `${affected.name} was affected in an indescribable way by ${alteration.id}.`;
    }

    const user = battleState.fighters[outcome.userId ?? ''];
    if (!user) return `The user vanished entirely.`;
    if (outcome.moveTo) return `${user.name} moved to ${outcome.moveTo}`;
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
    if (outcome.curse && affected) {
      return `${user.name} cursed ${affected.name} with ${outcome.curse.extent} ${outcome.curse.alterationId}.`;
    };
    if (outcome.bless && affected) {
      return `${user.name} blessed ${affected.name} with ${outcome.bless.extent} ${outcome.bless.alterationId}.`;
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