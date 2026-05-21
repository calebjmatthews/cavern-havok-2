import type CycleLayer from "@client/models/artist/cycleLayer";
import framesOneNameToCycles from "@client/functions/artist/framesOneNameToCycles";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { CYCLE_LAYER_SLOTS, FRAME_NAMES } from "@client/enums";

const FRN = FRAME_NAMES;

const cycleLayersHats: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.COZY_HOOD]: {
    id: EQUIPMENTS.COZY_HOOD,
    slot: CYCLE_LAYER_SLOTS.HEAD,
    layers: { ...framesOneNameToCycles({
      spriteName: 'comfy_hood.png',
      frames: {
        [FRN.DEFAULT]: {
          offset: { x: 1, y: 1 }
        },
        [FRN.ONE_LOWER]: {
          offset: { x: 1, y: 2 }
        },
        [FRN.CRITICAL]: {
          offset: { x: 1, y: 4 }
        },
        [FRN.DOWN]: {
          offset: { x: -3, y: 22 }
        },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.HAT
  },
  [EQUIPMENTS.FLINT_HEMLET]: {
    id: EQUIPMENTS.FLINT_HEMLET,
    slot: CYCLE_LAYER_SLOTS.HEAD,
    layers: { ...framesOneNameToCycles({
      spriteName: 'sweep_helm.png',
      frames: {
        [FRN.DEFAULT]: {
          offset: { x: 1, y: -1 }
        },
        [FRN.ONE_LOWER]: {
          offset: { x: 1, y: 0 }
        },
        [FRN.DAMAGED]: {
          offset: { x: 2, y: 0 }
        },
        [FRN.CRITICAL]: {
          offset: { x: 1, y: 2 }
        },
        [FRN.DOWN]: {
          offset: { x: -4, y: 22 }
        },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.HAT
  },
};

export default cycleLayersHats;