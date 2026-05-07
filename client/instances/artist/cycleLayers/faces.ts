import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { SPRITE_NAMES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;

const cycleLayersFaces: { [id: string] : CycleLayer } = {
  [EQUIPMENTS.FACE_REGULAR_TOPAZ]: {
    layers: {
      [LAS.RESTING]: {
        spriteNames: [SPRITE_NAMES.FACE_RESTING], offsets: [{ x: 4, y: 5 }]
      }, 
      // [LAS.RESTING]: {
      //   spriteNames: [SPRITE_NAMES.FACE_RESTING], offsets: [{ x: 4, y: 5 }]
      // }, 
    },
    zIndex: ARTIST_Z_INDECES.FACE,
    tint: '#f8d858'
  }
};

export default cycleLayersFaces;