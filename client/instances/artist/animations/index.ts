import type AnimationType from "@client/models/artist/animationType";
import wobble from "./wobble";
import { ANIMATION_TYPES } from "@client/enums";

const animationTypes: { [id: string] : AnimationType} = {
  [ANIMATION_TYPES.WOBBLE]: wobble
};

export default animationTypes;