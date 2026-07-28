import type Artist from "@client/models/artist/artist";
import type Bounds from "@client/models/artist/bounds";

const pixiBoundsToDOMStyle = (pixiBounds: Bounds, artist: Artist, options?: {
  marginTop: number
}): string => {
  const domBounds: Bounds = {
    id: pixiBounds.id,
    x: pixiBounds.x * artist.pixelScale,
    y: pixiBounds.y * artist.pixelScale,
    width: pixiBounds.width * artist.pixelScale,
    height: pixiBounds.height * artist.pixelScale
  };
  return `
    position: fixed;
    margin-left: ${domBounds.x}px;
    margin-top: ${domBounds.y + (options?.marginTop ?? 0)}px;
    width: ${domBounds.width}px;
    height: ${domBounds.height}px;
  `;
};

export default pixiBoundsToDOMStyle;