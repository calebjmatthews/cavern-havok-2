import type Fighter from "@common/models/fighter";
import type Creation from "@common/models/creation";
import type Obstacle from "@common/models/obstacle";
import getPixelScale from "@client/functions/getPixelScale";
import getOccupantSprite from "@client/functions/getOccupantSprite";
import clss from "@client/functions/clss";
import "./occupantSprite.css";

export default function OccupantSprite(props: {
  occupant: Fighter | Obstacle | Creation,
  battlefieldSize: [number, number],
  canTarget?: boolean,
  isTargetSelected?: boolean,
  scale?: number
}) {
  const { occupant, battlefieldSize, canTarget, isTargetSelected, scale } = props;
  const sprite = getOccupantSprite(occupant);

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