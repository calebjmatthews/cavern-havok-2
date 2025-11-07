import { useMemo } from "react";

import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import clss from "@client/functions/clss";
import { HEALTH_DANGER_THRESHOLD } from "@common/constants";

export default function SpotOccupant(props: {
  occupant: Fighter | Obstacle | Creation
}) {
  const { occupant } = props;

  const occupantChargeLabel = useMemo(() => {
    if (!occupant || !("charge" in occupant)) return null;
    return `C: ${occupant.charge}`;
  }, [occupant]);

  const downed = Math.round(occupant.health) <= 0;

  return (<div className={clss([ "spot-occupant", (downed ? "text-muted" : null) ])}>
    <div>{occupant.name}</div>
    <div>{occupantChargeLabel}</div>
    <HealthBar occupant={occupant} />
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