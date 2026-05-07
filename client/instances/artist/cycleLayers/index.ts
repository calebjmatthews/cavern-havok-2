import type CycleLayer from "@client/models/artist/cycleLayer";
import cycleLayersBodies from "./bodies";

const cycleLayers: { [key: string]: CycleLayer } = {
  ...cycleLayersBodies
};

export default cycleLayers;