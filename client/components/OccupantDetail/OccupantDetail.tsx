import FighterDetail from "./FighterDetail";
import type BattleState from "@common/models/battleState";
import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";

export default function OccupantDetail(props: {
  battleState?: BattleState,
  occupant: Fighter | Creation | Obstacle
}) {
  return (
    <section>
      <ModalContent {...props} />
    </section>
  );
};

function ModalContent(props: {
  battleState?: BattleState,
  occupant: Fighter | Creation | Obstacle
}) {
  const { occupant } = props;
  if ("characterClass" in occupant) return <FighterDetail {...props} fighter={occupant} />;
};