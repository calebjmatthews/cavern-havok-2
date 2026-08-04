import type AnimationType from "@client/models/artist/animationType";

import wobble from "./wobble";
import dropFromAbove from "./dropFromAbove";
import fadeAway from "./fadeAway";
import pulseOpacity from "./pulseOpacity";
import driftAndFade from "./driftAndFade";
import move from "./move";
import regress from "./regress";
import lunge from "./lunge";
import pulseTint from "./pulseTint";
import hover from "./hover";

import cindersTreasureSpill from "../particleContainers/cindersTreasureSpill";
import damageNumbers from "../particleContainers/damageNumbers";
import defenseNumbers from "../particleContainers/defenseNumbers";
import healingNumbers from "../particleContainers/healingNumbers";
import magicCircling from "../particleContainers/magicCircling";

import cinderTreasure from "../particles/cinderTreasure";
import damageNumber from "../particles/damageNumber";
import defenseNumber from "../particles/defenseNumber";
import healingNumber from "../particles/healingNumber";
import magicBit from "../particles/magicBit";

import { ANIMATION_TYPES } from "@client/enums";

const animationTypes: { [id: string] : AnimationType} = {
  [ANIMATION_TYPES.WOBBLE]: wobble,
  [ANIMATION_TYPES.DROP_FROM_ABOVE]: dropFromAbove,
  [ANIMATION_TYPES.FADE_AWAY]: fadeAway,
  [ANIMATION_TYPES.PULSE_OPACITY]: pulseOpacity,
  [ANIMATION_TYPES.DRIFT_AND_FADE]: driftAndFade,
  [ANIMATION_TYPES.MOVE]: move,
  [ANIMATION_TYPES.REGRESS]: regress,
  [ANIMATION_TYPES.LUNGE]: lunge,
  [ANIMATION_TYPES.PULSE_TINT]: pulseTint,
  [ANIMATION_TYPES.HOVER]: hover,

  [ANIMATION_TYPES.CINDERS_TREASURE_SPILL]: cindersTreasureSpill,
  [ANIMATION_TYPES.DAMAGE_NUMBERS]: damageNumbers,
  [ANIMATION_TYPES.DEFENSE_NUMBERS]: defenseNumbers,
  [ANIMATION_TYPES.HEALING_NUMBERS]: healingNumbers,
  [ANIMATION_TYPES.MAGIC_CIRCLING]: magicCircling,

  [ANIMATION_TYPES.CINDER_TREASURE]: cinderTreasure,
  [ANIMATION_TYPES.DAMAGE_NUMBER]: damageNumber,
  [ANIMATION_TYPES.DEFENSE_NUMBER]: defenseNumber,
  [ANIMATION_TYPES.HEALING_NUMBER]: healingNumber,
  [ANIMATION_TYPES.MAGIC_BIT]: magicBit
};

export default animationTypes;