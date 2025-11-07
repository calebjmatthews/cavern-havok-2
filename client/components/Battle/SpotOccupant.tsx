import { useMemo } from "react";

import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";

export default function SpotOccupant(props: {
  occupant: Fighter | Obstacle | Creation
}) {
  const { occupant } = props;

  const occupantChargeLabel = useMemo(() => {
    if (!occupant || !("charge" in occupant)) return null;
    return `C: ${occupant.charge}`;
  }, [occupant]);

  return (<>
    <div>{occupant.name}</div>
    <div>{`H: ${occupant.health}/${occupant.healthMax}`}</div>
    <div>{occupantChargeLabel}</div>
  </>);
};

// function HealthBar(props: {
//   occupant: Fighter | Obstacle | Creation
// }) {
//   const { occupant } = props;
//   const { health, healthMax } = occupant;

//   let proportion = (health/healthMax);
//   let downed = false;
//   if (proportion <= 0) {
//     downed = true;
//     proportion = Math.abs(proportion);
//   };
// };