import type Artist from "../artist";
import Animation from "../animation";
import animationTypes from '@client/instances/artist/animations';
import { ANIMATION_TYPES } from '@client/enums';

export interface DamageChestArgs {
  chestId: string,
  artist?: Artist,
}

const damageChest = (args: DamageChestArgs) => {
  const { chestId, artist } = args;
  const pixiChildren = artist?.pixiChildrenRef?.current;
  const container = pixiChildren?.[chestId];
  if (!artist || !container) return;
  
  const animationType = animationTypes[ANIMATION_TYPES.WOBBLE];
  if (!animationType) return;
  artist.animations.push(new Animation({
    type: ANIMATION_TYPES.WOBBLE,
    targets: chestId,
    ix: container.x,
    iy: container.y
  }, animationType));
};

export default damageChest;