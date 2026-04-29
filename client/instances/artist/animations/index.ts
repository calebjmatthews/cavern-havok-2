import type AnimationType from "@client/models/artist/animationType";
import wobble from "./wobble";
import dropFromAbove from "./dropFromAbove";
import fadeAway from "./fadeAway";

import cindersTreasureSpill from "../particleContainers/cindersTreasureSpill";

import cinderTreasure from "../particles/cinderTreasure";

import { ANIMATION_TYPES } from "@client/enums";

const animationTypes: { [id: string] : AnimationType} = {
  [ANIMATION_TYPES.WOBBLE]: wobble,
  [ANIMATION_TYPES.DROP_FROM_ABOVE]: dropFromAbove,
  [ANIMATION_TYPES.FADE_AWAY]: fadeAway,

  [ANIMATION_TYPES.CINDERS_TREASURE_SPILL]: cindersTreasureSpill,

  [ANIMATION_TYPES.CINDER_TREASURE]: cinderTreasure
};

export default animationTypes;