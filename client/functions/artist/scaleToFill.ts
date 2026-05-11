const scaleToFill = (spriteSize: [number, number], toFillSize: [number, number]) => (
  Math.max(toFillSize[0] / spriteSize[0], toFillSize[1] / spriteSize[1])
);

export default scaleToFill;