import type Artist from "@client/models/artist/artist";
import type { PixiEvent } from "@common/models/pixiEvent";
import Animation from "@client/models/artist/animation";
import animationTypes from "@client/instances/artist/animations";
import { ANIMATION_TYPES } from "@client/enums";

const applyAnimationToOccupant = (args: {
  artist: Artist,
  pixiEvent: PixiEvent
}) => {
  const { artist, pixiEvent } = args;
  if (!('animationTypeId' in pixiEvent.args)) return;
  const pixiChildren = artist.pixiChildrenRef.current;

  const animationTypeId = pixiEvent.args.animationTypeId;
  const animationType = animationTypes[animationTypeId ?? ''];
  const fighter = 'fighter' in pixiEvent.args ? pixiEvent.args.fighter : undefined;
  const obstacle = 'obstacle' in pixiEvent.args ? pixiEvent.args.obstacle : undefined;
  const occupant = fighter ?? obstacle;
  const container = pixiChildren[occupant?.id ?? ''];
  if (!animationType || !container || !occupant) {
    throw Error(`Missing data in performEventSet drawFighter/drawObstacle, animationType: ${!!animationType}, container: ${!!container}.`);
  }
  let py = container.y;
  if (animationTypeId === ANIMATION_TYPES.DROP_FROM_ABOVE) py -= (60 * artist.pixelScale);
  artist.animations.push(new Animation({
    type: animationTypeId ?? '',
    targets: occupant.id,
    ix: container.x,
    iy: container.y,
    py,
    vx: animationType.getVxStarting && animationType.getVxStarting(artist.pixelScale),
    vy: animationType.getVyStarting && animationType.getVyStarting(artist.pixelScale)
  }, animationType));
};

export default applyAnimationToOccupant;