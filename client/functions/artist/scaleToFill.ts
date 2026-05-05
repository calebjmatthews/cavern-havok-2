import type Artist from "@client/models/artist/artist";

const scaleToFill = (spriteSize: [number, number], toFillSize: [number, number], artist: Artist) => (
  Math.max(
    (toFillSize[0] / artist.pixelScale) / spriteSize[0],
    (toFillSize[1] / artist.pixelScale) / spriteSize[1]
  )
);

export default scaleToFill;