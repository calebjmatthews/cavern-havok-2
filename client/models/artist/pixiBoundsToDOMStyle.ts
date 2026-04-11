import type Bounds from "./bounds";
import { PIXEL_SCALE } from "@common/constants";

const pixiBoundsToDOMStyle = (pixiBounds: Bounds): string => {
  const domBounds: Bounds = {
    id: pixiBounds.id,
    x: pixiBounds.x * PIXEL_SCALE,
    y: pixiBounds.y * PIXEL_SCALE,
    width: pixiBounds.width * PIXEL_SCALE,
    height: pixiBounds.height * PIXEL_SCALE
  };
  return `
    position: fixed;
    margin-left: ${domBounds.x}px;
    margin-top: ${domBounds.y}px;
    width: ${domBounds.width}px;
    height: ${domBounds.height}px;
  `;
};

export default pixiBoundsToDOMStyle;