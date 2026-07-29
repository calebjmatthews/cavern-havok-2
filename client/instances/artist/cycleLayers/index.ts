import type CycleLayer from "@client/models/artist/cycleLayer";
import cycleLayersBodies from "./bodies";
import cycleLayersFaces from "./faces";
import cycleLayersTops from "./tops";
import cycleLayersMonsters from "./monsters";
import cycleLayersHats from "./hats";
import cycleLayersWeapons from "./weapons";
import cycleLayersAccessories from "./accessories";

const cycleLayers: { [key: string]: CycleLayer } = {
  ...cycleLayersBodies,
  ...cycleLayersFaces,
  ...cycleLayersMonsters,
  ...cycleLayersTops,
  ...cycleLayersHats,
  ...cycleLayersWeapons,
  ...cycleLayersAccessories
};

export default cycleLayers;