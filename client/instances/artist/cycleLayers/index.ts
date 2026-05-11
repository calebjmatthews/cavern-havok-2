import type CycleLayer from "@client/models/artist/cycleLayer";
import cycleLayersBodies from "./bodies";
import cycleLayersFaces from "./faces";
import cycleLayersTops from "./tops";
import cycleLayersMonsters from "./monsters";

const cycleLayers: { [key: string]: CycleLayer } = {
  ...cycleLayersBodies,
  ...cycleLayersFaces,
  ...cycleLayersMonsters,
  ...cycleLayersTops
};

export default cycleLayers;