import { useMemo } from "react";

import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Outcome from "@common/models/outcome";
import clss from "@client/functions/clss";
import { HEALTH_DANGER_THRESHOLD } from "@common/constants";

export default function SpotOccupant(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture: Fighter | Obstacle | Creation | null,
  occupantOutcomesFuture: Outcome[] | null
}) {
  const { occupant, occupantFuture, occupantOutcomesFuture } = props;

  const occupantChargeLabel = useMemo(() => {
    if (!("charge" in occupant)) return null;
    return `C: ${occupant.charge}`;
  }, [occupant]);

  const futureLabel = useMemo(() => {
  if (!occupantOutcomesFuture || !occupantFuture) return null;

  const rules = [
    { key: 'becameDowned',          check: (o: Outcome) => o.becameDowned },
    { key: 'skippedBecauseStunned', check: (o: Outcome) => o.skippedBecauseStunned },
    { key: 'sufferedDamage',        check: (o: Outcome) => o.sufferedDamage },
    { key: 'defenseBroken',         check: (o: Outcome) => o.defenseBroken },
    { key: 'defenseDamaged',        check: (o: Outcome) => o.defenseDamaged },
    { key: 'defenseGained',         check: (o: Outcome) => o.defense && o.defense > 0 },
    { key: 'moveTo',                check: (o: Outcome) => o.moveTo && o.moveTo },
  ];

  for (const { key, check } of rules) {
    if (occupantOutcomesFuture.some(check)) return key;
  };

  return null;
}, [occupantOutcomesFuture, occupantFuture]);

  const downed = Math.round(occupant.health) <= 0;

  return (<div className={clss([ "spot-occupant", (downed ? "text-muted" : null) ])}>
    <div>{occupant.name}</div>
    <div>{occupantChargeLabel}</div>
    <HealthBar occupant={occupant} occupantFuture={occupantFuture} />
    <FutureIcon futureLabel={futureLabel} />
  </div>);
};

function HealthBar(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture: Fighter | Obstacle | Creation | null
}) {
  const { occupant, occupantFuture } = props;

  let proportion = (occupant.health / occupant.healthMax);
  let downed = false;
  if (proportion <= 0) {
    downed = true;
    proportion = Math.abs(proportion);
  };

  const proportionToLose = (occupantFuture && occupantFuture.health < occupant.health)
    ? ((occupant.health - occupantFuture.health) / occupantFuture.healthMax)
    : null;
  const proportionToGain = (occupantFuture && occupantFuture.health > occupant.health)
    ? ((occupantFuture.health - occupant.health) / occupantFuture.healthMax)
    : null;
  let proportionDefense = occupantFuture?.defense
    ? (occupantFuture.defense / occupantFuture.healthMax)
    : null;

  let bgColor = "var(--c-green)";
  if (downed) bgColor = "var(--c-red-dark)";
  else if (proportion >= 1) bgColor = "var(--c-green-bold)";
  else if (proportion >= 0.5) bgColor = "var(--c-green)";
  else if (proportion >= HEALTH_DANGER_THRESHOLD) bgColor = "var(--c-yellow)";
  else bgColor = "var(--c-red)";

  return (
    <div
      className="health-bar-outer"
      style={{ backgroundColor: (downed ? "var(--c-grey-dark)" : "var(--c-white)") }}
    >
      <div
        className="health-bar-inner"
        style={{ width: `${(65 * proportion)}px`, backgroundColor: bgColor }}
      />
      {proportionDefense && (
        <div
          className="health-bar-inner pulse-opacity"
          style={{ width: `${(65 * proportionDefense)}px`, backgroundColor: "var(--c-blue-light)" }}
        />
      )}
      {proportionToLose && (
        <div
          className="health-bar-inner pulse-opacity"
          style={{
            width: `${(65 * proportionToLose)}px`,
            left: `${(65 * (proportion - proportionToLose))}px`,
            backgroundColor: "var(--c-white)"
          }}
        />
      )}
      <span className="health-bar-text" style={{ color: (downed ? "var(--c-white)" : "var(--c-black)") }}>
        {`${Math.round(occupant.health)}/${occupant.healthMax}`}
      </span>
    </div>
  );
};

function FutureIcon(props: { futureLabel: string | null }) {
  const { futureLabel } = props;

  if (futureLabel === null) return null;

  const icons: { [iconName: string] : { value: string, color: string } } = {
    'becameDowned':          { value: 'KO', color: 'var(--c-red-dark)' },
    'skippedBecauseStunned': { value: 'ST', color: 'var(--c-yellow)' },
    'sufferedDamage':        { value: 'DM', color: 'var(--c-red)' },
    'defenseBroken':         { value: 'BR', color: 'var(--c-yellow)' },
    'defenseDamaged':        { value: 'DD', color: 'var(--c-blue)' },
    'defenseGained':         { value: 'DG', color: 'var(--c-blue)' },
    'moveTo':                { value: 'MV', color: 'var(--c-grey)' }
  };
  const icon = icons[futureLabel];
  if (!icon) return null;

  return (
    <div className="future-icon" style={{ color: icon.color }}>
      {icon.value}
    </div>
  );
};