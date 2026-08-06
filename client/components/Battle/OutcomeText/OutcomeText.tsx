import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import alterations from "@common/instances/alterations";
import { ALTERATION_SUB_COMMAND_RESOLVED } from "@common/constants";

export default function OutcomeText(props: {
  outcome: Outcome,
  battleState: BattleState,
  futureTense?: boolean
}) {
  const { outcome, battleState, futureTense } = props;

  const outcomeText = useMemo(() => {
    const affected = getOccupantById({ battleState, occupantId: (outcome.affectedId || '') });
    const was = futureTense ? `would be` : `was`;

    if (outcome.userId === ALTERATION_SUB_COMMAND_RESOLVED) {
      if (!affected) return `Someone experienced mystery.`;
      const alteration = alterations[outcome.alterationId ?? ''];
      if (!alteration) return `${affected.name} ${was} affected by something mysterious.`;

      if (outcome.damage && affected) {
        return `${affected.name} ${was} damaged ${outcome.damage} by ${alteration.id}.`;
      }
      else if (outcome.healing && affected) {
        return `${affected.name} ${was} healed ${outcome.healing} by ${alteration.id}.`;
      }
      else if (outcome.bless && affected) {
        return `${affected.name} ${was} Blessed with ${outcome.bless.extent} ${outcome.bless.alterationId} by ${alteration.id}.`;
      }
      else if (outcome.curse && affected) {
        return `${affected.name} ${was} Cursed with ${outcome.curse.extent} ${outcome.curse.alterationId} by ${alteration.id}.`;
      }
      return `${affected.name} ${was} affected in an indescribable way by ${alteration.id}.`;
    }

    const user = battleState.fighters[outcome.userId ?? ''];
    if (!user) return `The user vanished entirely.`;
    if (outcome.moveTo) {
      return `${user.name} ${futureTense ? 'would move' : 'moved'} to ${outcome.moveTo}`;
    };
    const toSelf = user.id === affected?.id;
    if (outcome.skippedBecauseDowned) {
      return `${user.name} ${was} knocked down and out.`;
    };
    const attacked = futureTense ? 'would attack' : 'attacked';
    const element = outcome.elements ? `${outcome.elements.join(' / ')} ` : '';
    if (outcome.sufferedDamage && outcome.defenseDamaged && affected) {
      return `${user.name} ${attacked} ${affected.name} to weaken defense by ${outcome.defenseDamaged} and for ${outcome.sufferedDamage} ${element}damage.`;
    };
    if (outcome.defenseDamaged && affected) {
      return `${user.name} ${attacked} ${affected.name} to weaken defense by ${outcome.defenseDamaged}.`;
    };
    if (outcome.sufferedDamage && affected) {
      return `${user.name} ${attacked} ${affected.name} for ${outcome.sufferedDamage} ${element}damage.`;
    };
    const cursed = futureTense ? 'would curse' : 'cursed';
    if (outcome.curse && affected) {
      return `${user.name} ${cursed} ${affected.name} with ${outcome.curse.extent} ${outcome.curse.alterationId}.`;
    };
    const blessed = futureTense ? 'would bless' : 'blessed';
    if (outcome.bless && affected) {
      return `${user.name} ${blessed} ${affected.name} with ${outcome.bless.extent} ${outcome.bless.alterationId}.`;
    };
    const defended = futureTense ? 'would protect themselves' : 'protected themselves';
    if (outcome.defense && toSelf) {
      return `${user.name} ${defended} for ${outcome.defense} defense.`;
    };
    const protect = futureTense ? 'would protect' : 'protected';
    if (outcome.defense && affected) {
      return `${user.name} ${protect} ${affected.name} for ${outcome.defense} defense.`;
    };
    const restore = futureTense ? 'would restore' : 'restored';
    if (outcome.healing && affected && !toSelf) {
      return `${user.name} ${restore} ${affected.name} with ${outcome.healing} ${element}healing.`;
    };
    if (outcome.healing && toSelf) {
      return `${user.name} ${restore} themselves with ${outcome.healing} ${element}healing.`;
    };
    const usedUp = futureTense ? 'would use up' : 'used up';
    if (outcome.charge && toSelf) {
      return `${user.name} ${usedUp} ${outcome.charge} charge.`;
    };
    const created = futureTense ? 'would created' : 'created';
    if (outcome.makeObstacle) {
      return `${user.name} ${created} a ${outcome.makeObstacle.kind} at ${outcome.makeObstacle.coords}.`;
    };
    if (outcome.sufferedDamage) {
      return `${user.name} ${attacked} someone unknown for ${outcome.sufferedDamage} damage.`;
    };
    
    return `${user.name} ${futureTense ? 'would miss' : 'missed'}.`;
  }, [outcome, battleState]);
  

  return (
    <p>{outcomeText}</p>
  )
};