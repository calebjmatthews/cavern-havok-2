import defaultAi from "./default_ai";
import bubbleAi from "./bubble_ai";
import { AIS } from "@common/enums";

const ais = {
  [AIS.DEFAULT]: defaultAi,
  [AIS.BUBBLE]: bubbleAi
};

export default ais;