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
  console.log(`occupantFuture`, occupantFuture);
  console.log(`occupantOutcomesFuture`, occupantOutcomesFuture);

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
    <HealthBar occupant={occupant} />
    <FutureIcon futureLabel={futureLabel} />
  </div>);
};

function HealthBar(props: {
  occupant: Fighter | Obstacle | Creation
}) {
  const { occupant } = props;
  const { health, healthMax } = occupant;

  let proportion = (health / healthMax);
  let downed = false;
  if (proportion <= 0) {
    downed = true;
    proportion = Math.abs(proportion);
  };

  return (
    <div
      className={clss([
        "health-bar-outer",
        (downed ? "fill-grey-dark" : "fill-white")
      ])}
    >
      <div
        className={clss([
          "health-bar-inner",
          ((!downed && proportion >= 1) && "fill-blue"),
          ((!downed && proportion < 1 && proportion >= 0.5) && "fill-green"),
          ((!downed && proportion < 0.5 && proportion >= HEALTH_DANGER_THRESHOLD) && "fill-yellow"),
          ((!downed && proportion < HEALTH_DANGER_THRESHOLD && proportion > 0) && "fill-red"),
          ((downed) && "fill-red-dark"),
        ])}
        style={{width: `${(65 * proportion)}px`}}
      />
      <span className={clss([
        "health-bar-text",
        (downed ? "text-white" : "text-black")
      ])}>
        {`${Math.round(health)}/${healthMax}`}
      </span>
    </div>
  );
};

function FutureIcon(props: { futureLabel: string | null }) {
  const { futureLabel } = props;

  if (futureLabel === null) return null;

  const icons: { [iconName: string] : { value: string, color: string } } = {
    'becameDowned':          { value: 'KO', color: 'var(--red-dark)' },
    'skippedBecauseStunned': { value: 'ST', color: 'var(--yellow)' },
    'sufferedDamage':        { value: 'DM', color: 'var(--red)' },
    'defenseBroken':         { value: 'BR', color: 'var(--yellow)' },
    'defenseDamaged':        { value: 'DD', color: 'var(--blue)' },
    'defenseGained':         { value: 'DG', color: 'var(--blue)' },
    'moveTo':                { value: 'MV', color: 'var(--grey)' }
  };
  const icon = icons[futureLabel];
  if (!icon) return null;

  return (
    <div className="future-icon" style={{ color: icon.color }}>
      {icon.value}
    </div>
  );
};