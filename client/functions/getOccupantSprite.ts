import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import { SPRITE_STATES } from "@common/enums";
import { characterClasses } from "@common/instances/character_classes";
import { obstacleKinds } from "@common/instances/obstacle_kinds";

const getOccupantSprite = (occupant: Fighter | Creation | Obstacle) => {
  let sprite = { src: "/public/sprites/unknown.png", width: 15, height: 19 };

  const spriteState = (occupant.health > 0) ? SPRITE_STATES.RESTING : SPRITE_STATES.DOWNED;
  const classSprite = "characterClass" in occupant
    && characterClasses[occupant.characterClass]?.spriteSet?.[spriteState];
  if (classSprite) sprite = classSprite;
  const obstacleSprite = "kind" in occupant
    && obstacleKinds[occupant.kind]?.spriteSet?.[spriteState];
  if (obstacleSprite) sprite = obstacleSprite;

  return sprite;
};

export default getOccupantSprite;