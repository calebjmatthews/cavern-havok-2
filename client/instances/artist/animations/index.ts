import type AnimationType from "@client/models/artist/animationType";
import wobble from "./wobble";
import dropFromAbove from "./dropFromAbove";
import fadeAway from "./fadeAway";
import { ANIMATION_TYPES } from "@client/enums";

const animationTypes: { [id: string] : AnimationType} = {
  [ANIMATION_TYPES.WOBBLE]: wobble,
  [ANIMATION_TYPES.DROP_FROM_ABOVE]: dropFromAbove,
  [ANIMATION_TYPES.FADE_AWAY]: fadeAway
};

export default animationTypes;