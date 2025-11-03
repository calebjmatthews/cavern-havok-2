import type Creation from "@common/models/creation";
import Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";

const cloneOccupant = (occupant: Fighter | Obstacle | Creation): Fighter | Obstacle | Creation => {
  if (occupant.occupantKind === "fighter") {
    return new Fighter({ ...occupant });
  }
  return { ...occupant };
};

export default cloneOccupant;