import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";

export const getDefenseTotal = (occupant?: Fighter | Obstacle | Creation | null) => {
  if (!occupant) return 0;
  return (
    occupant.defense + occupant.defenseWater + occupant.defenseFire + occupant.defenseBio
  );
}

export const setDefenseReduced = (args: {
  occupant: Fighter | Obstacle | Creation,
  extent: number
}) => {
  const { occupant, extent } = args;
  let extentRemaining = extent;

  if (occupant.defense) {
    if (occupant.defense >= extentRemaining) {
      occupant.defense -= extentRemaining;
      return occupant;
    }
    else {
      extentRemaining -= occupant.defense;
      occupant.defense = 0;
    };
  };

  if (occupant.defenseWater) {
    if (occupant.defenseWater >= extentRemaining) {
      occupant.defenseWater -= extentRemaining;
      return occupant;
    }
    else {
      extentRemaining -= occupant.defenseWater;
      occupant.defenseWater = 0;
    };
  };

  if (occupant.defenseFire) {
    if (occupant.defenseFire >= extentRemaining) {
      occupant.defenseFire -= extentRemaining;
      return occupant;
    }
    else {
      extentRemaining -= occupant.defenseFire;
      occupant.defenseFire = 0;
    };
  };

  if (occupant.defenseBio) {
    if (occupant.defenseBio >= extentRemaining) {
      occupant.defenseBio -= extentRemaining;
      return occupant;
    }
    else {
      extentRemaining -= occupant.defenseBio;
      occupant.defenseBio = 0;
    };
  };

  return occupant;
};