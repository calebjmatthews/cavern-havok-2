import { PIXEL_SCALE } from "@common/constants";

const scaleToFill = (spriteSize: [number, number], toFillSize: [number, number]) => (
  Math.max(
    (toFillSize[0] / PIXEL_SCALE) / spriteSize[0],
    (toFillSize[1] / PIXEL_SCALE) / spriteSize[1]
  )
);

export default scaleToFill;