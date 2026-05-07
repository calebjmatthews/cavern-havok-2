import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { SPRITE_NAMES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;
const SPN = SPRITE_NAMES;

const cycleLayersBodies: { [id: string] : CycleLayer } = {
  [EQUIPMENTS.BODY_REGULAR_SHALE]: {
    layers: {
      [LAS.RESTING]: {
        spriteNames: [SPN.SBR_RESTING]
      },
      [LAS.WALKING]: {
        spriteNames: [SPN.SBR_RESTING, SPN.SBR_WALKING_0, SPN.SBR_RESTING, SPN.SBR_WALKING_1],
        offsets: [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 0, y: 0 }, { x: -2, y: 0 }],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY,
    isPrimary: true,
    tint: '#7d3a09'
  }
};

export default cycleLayersBodies;