import type AnimationType from "@client/models/artist/animationType";
import wobble from "./wobble";
import dropFromAbove from "./dropFromAbove";
import { ANIMATION_TYPES } from "@client/enums";

const animationTypes: { [id: string] : AnimationType} = {
  [ANIMATION_TYPES.WOBBLE]: wobble,
  [ANIMATION_TYPES.DROP_FROM_ABOVE]: dropFromAbove
};

export default animationTypes;