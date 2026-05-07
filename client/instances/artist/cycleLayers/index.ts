import type CycleLayer from "@client/models/artist/cycleLayer";
import cycleLayersBodies from "./bodies";
import cycleLayersFaces from "./faces";

const cycleLayers: { [key: string]: CycleLayer } = {
  ...cycleLayersBodies,
  ...cycleLayersFaces
};

export default cycleLayers;