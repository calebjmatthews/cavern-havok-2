import type AnimationType from "@client/models/artist/animationType";
import wobble from "./wobble";
import dropFromAbove from "./dropFromAbove";
import fadeAway from "./fadeAway";
import pulseOpacity from "./pulseOpacity";
import driftAndFade from "./driftAndFade";
import move from "./move";

import cindersTreasureSpill from "../particleContainers/cindersTreasureSpill";
import healthNumbers from "../particleContainers/healthNumbers";

import cinderTreasure from "../particles/cinderTreasure";
import healthNumber from "../particles/healthNumber";

import { ANIMATION_TYPES } from "@client/enums";

const animationTypes: { [id: string] : AnimationType} = {
  [ANIMATION_TYPES.WOBBLE]: wobble,
  [ANIMATION_TYPES.DROP_FROM_ABOVE]: dropFromAbove,
  [ANIMATION_TYPES.FADE_AWAY]: fadeAway,
  [ANIMATION_TYPES.PULSE_OPACITY]: pulseOpacity,
  [ANIMATION_TYPES.DRIFT_AND_FADE]: driftAndFade,
  [ANIMATION_TYPES.MOVE]: move,

  [ANIMATION_TYPES.CINDERS_TREASURE_SPILL]: cindersTreasureSpill,
  [ANIMATION_TYPES.HEALTH_NUMBERS]: healthNumbers,

  [ANIMATION_TYPES.CINDER_TREASURE]: cinderTreasure,
  [ANIMATION_TYPES.HEALTH_NUMBER]: healthNumber,
};

export default animationTypes;