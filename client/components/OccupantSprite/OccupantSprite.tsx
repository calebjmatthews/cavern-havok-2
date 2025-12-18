import type Fighter from "@common/models/fighter";
import type Creation from "@common/models/creation";
import type Obstacle from "@common/models/obstacle";
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";
import getPixelScale from "@client/functions/getPixelScale";
import clss from "@client/functions/clss";
import "./occupantSprite.css";
const CHC = CHARACTER_CLASSES;
const OBK = OBSTACLE_KINDS;

export default function OccupantSprite(props: {
  occupant: Fighter | Obstacle | Creation,
  battlefieldSize: [number, number],
  canTarget?: boolean,
  isTargetSelected?: boolean,
  scale?: number
}) {
  const { occupant, battlefieldSize, canTarget, isTargetSelected, scale } = props;
  const sprites: { [occupantKind: string] : { src: string, width: number, height: number } } = {
    [CHC.JAVALIN]: { src: "/public/sprites/javalin.png", width: 13, height: 28 },
    [CHC.RAIDER]: { src: "/public/sprites/raider.png", width: 11, height: 25 },
    [CHC.FLYING_SNAKE]: { src: "/public/sprites/flying_snake.png", width: 16, height: 16 },
    [CHC.FLYING_SNAKE_BALL]: { src: "/public/sprites/flying_snake_ball.png", width: 23, height: 25 },
    [OBK.BOULDER]: { src: "/public/sprites/rock.png", width: 17, height: 19 },
  };
  let sprite = { src: "/public/sprites/unknown.png", width: 15, height: 19 };
  const classSprite = "characterClass" in occupant && sprites[occupant.characterClass];
  if (classSprite) sprite = classSprite;
  const obstacleSprite = "kind" in occupant && sprites[occupant.kind];
  if (obstacleSprite) sprite = obstacleSprite;

  const pixelScale = getPixelScale(window.innerWidth) * (scale ?? 1);
  const sideB = occupant.coords[0] > (battlefieldSize[0] - 1);
  
  return (
    <div className={clss([
      'occupant-sprite-wrapper',
      sideB && 'mirror',
      (canTarget && 'can-target'),
      (isTargetSelected && 'target-selected')
    ])}>
      <img
        className="occupant-sprite"
        style={{ width: sprite.width * pixelScale, height: sprite.height * pixelScale }}
        src={sprite.src}
      />
    </div>
  );
};