import type CycleLayer from "@client/models/artist/cycleLayer";
import cycleLayersBodies from "./bodies";
import cycleLayersFaces from "./faces";
import cycleLayersTops from "./tops";

const cycleLayers: { [key: string]: CycleLayer } = {
  ...cycleLayersBodies,
  ...cycleLayersFaces,
  ...cycleLayersTops
};

export default cycleLayers;