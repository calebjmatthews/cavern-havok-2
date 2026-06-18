import type Cycle from "@client/models/artist/cycle";
import type CycleFrame from "@client/models/artist/cycleFrame";
import range from "@common/functions/utils/range";
import { FRAME_NAMES } from "@client/enums";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const FRN = FRAME_NAMES;
const LAS = LAYERED_ANIMATED_STATES;

const framesOneNameToCycles = (args: {
  spriteName: string,
  frames: { [name: string] : CycleFrame },
  throwingOnly?: boolean
}) => {
  const { spriteName, frames: framesArg, throwingOnly } = args;
  const cycles: { [name: string]: Cycle | Cycle[] } = {};

  const frames = { ...framesArg };

  // Default
  const frameDefault = frames[FRN.DEFAULT];
  if (frameDefault) {
    [FRN.RESTING, FRN.SWINGING_0, FRN.CASTING, FRN.CHEERING].forEach((name) => {
      if (!frames[name]) frames[name] = { ...frameDefault };
    });
  };

  // Typically one pixel lower than default in height
  const frameOneLower = frames[FRN.ONE_LOWER];
  if (frameOneLower) {
    [FRN.WALKING_0, FRN.WALKING_1, FRN.SWINGING_1, FRN.SWINGING_2, FRN.CLENCHING, FRN.DAMAGED]
    .forEach((name) => {
      if (!frames[name]) frames[name] = { ...frameOneLower };
    });
  }

  // Resting
  const frameResting = frames[FRN.RESTING];
  if (frameResting) cycles[LAS.RESTING] = {
    spriteNames: [spriteName],
    offsets: frameResting.offset ? [frameResting.offset] : undefined,
    opacities: (frameResting.opacity !== undefined) ? [frameResting.opacity] : undefined,
    loop: true
  };

  // Clenching
  const frameClenching = frames[FRN.CLENCHING];
  if (frameClenching) cycles[LAS.CLENCHING] = {
    spriteNames: [spriteName],
    offsets: frameClenching.offset ? [frameClenching.offset] : undefined,
    angles: frameClenching.angle ? [frameClenching.angle] : undefined,
    opacities: (frameClenching.opacity !== undefined) ? [frameClenching.opacity] : undefined
  };

  // Throwing
  const frameWalking0 = frames[FRN.WALKING_0];
  const frameWalking1 = frames[FRN.WALKING_1];
  const frameSwinging0 = frames[FRN.SWINGING_0];
  const frameSwinging1 = frames[FRN.SWINGING_1];
  const frameSwinging2 = frames[FRN.SWINGING_2];
  if (frameWalking1 && frameSwinging1 && frameSwinging0 && frameSwinging2) cycles[LAS.THROWING] = {
    spriteNames: range(0, 3).map(() => spriteName),
    offsets: (
      frameWalking1.offset && frameSwinging1.offset && frameSwinging0.offset &&
      frameSwinging2.offset
    ) ? [
      frameWalking1.offset, frameSwinging1.offset, frameSwinging0.offset,
      frameSwinging2.offset
    ] : undefined,
    angles: frameWalking1?.angle || frameSwinging1?.angle || frameSwinging0?.angle
      || frameSwinging2?.angle ? [
      frameWalking1.angle ?? 0, frameSwinging1.angle ?? 0, frameSwinging0.angle ?? 0, frameSwinging2.angle ?? 0
    ] : undefined,
    opacities: (
      (frameWalking1.opacity !== undefined) || (frameSwinging1.opacity !== undefined)
      || (frameSwinging0.opacity !== undefined) || (frameSwinging2.opacity !== undefined)
    ) ? [
      frameWalking1.opacity ?? 1, frameSwinging1.opacity ?? 1, frameSwinging0.opacity ?? 1,
      frameSwinging2.opacity ?? 1
    ] : undefined,
    durations: [10, 5, 20, 30] 
  };
  if (throwingOnly) return cycles;

  // Walking
  if (frameResting && frameWalking0 && frameWalking1) cycles[LAS.WALKING] = {
    spriteNames: range(0, 3).map(() => spriteName),
    offsets: frameWalking0?.offset && frameResting?.offset && frameWalking1?.offset ? [
      frameWalking0.offset, frameResting.offset, frameWalking1.offset, frameResting.offset
    ] : undefined,
    opacities: (
      (frameResting.opacity !== undefined) || (frameWalking0.opacity !== undefined) || (frameWalking1.opacity !== undefined)
    ) ? [
      frameWalking0.opacity ?? 1, frameResting.opacity ?? 1, frameWalking1.opacity ?? 1,
      frameResting.opacity ?? 1,
    ] : undefined,
    loop: true
  };

  if (frameWalking0) cycles[LAS.WALKING0] = {
    spriteNames: [spriteName],
    offsets: frameWalking0.offset ? [frameWalking0.offset] : undefined,
    opacities: (frameWalking0.opacity !== undefined) ? [frameWalking0.opacity] : undefined
  };

  if (frameWalking1) cycles[LAS.WALKING1] = {
    spriteNames: [spriteName],
    offsets: frameWalking1.offset ? [frameWalking1.offset] : undefined,
    opacities: (frameWalking1.opacity !== undefined) ? [frameWalking1.opacity] : undefined
  };

  // Swinging
  if (frameSwinging0 && frameSwinging1 && frameSwinging2) cycles[LAS.SWINGING] = {
    spriteNames: range(0, 2).map(() => spriteName),
    offsets: frameSwinging0?.offset && frameSwinging1?.offset && frameSwinging2?.offset ? [
      frameSwinging0.offset, frameSwinging1.offset, frameSwinging2.offset
    ] : undefined,
    angles: frameSwinging0?.angle || frameSwinging1?.angle || frameSwinging2?.angle ? [
      frameSwinging0.angle ?? 0, frameSwinging1.angle ?? 0, frameSwinging2.angle ?? 0
    ] : undefined,
    opacities: (
      (frameSwinging0?.opacity !== undefined) || (frameSwinging1?.opacity !== undefined) || (frameSwinging2?.opacity !== undefined)
    ) ? [
      frameSwinging0.opacity ?? 1, frameSwinging1.opacity ?? 1, frameSwinging2.opacity ?? 1
    ] : undefined,
    durations: [20, 10, 35]
  };

  if (frameSwinging0) cycles[LAS.SWINGING0] = {
    spriteNames: [spriteName],
    offsets: frameSwinging0.offset ? [frameSwinging0.offset] : undefined,
    opacities: (frameSwinging0.opacity !== undefined) ? [frameSwinging0.opacity] : undefined
  };


  if (frameSwinging1) cycles[LAS.SWINGING1] = {
    spriteNames: [spriteName],
    offsets: frameSwinging1.offset ? [frameSwinging1.offset] : undefined,
    opacities: (frameSwinging1.opacity !== undefined) ? [frameSwinging1.opacity] : undefined
  };

  if (frameSwinging2) cycles[LAS.SWINGING2] = {
    spriteNames: [spriteName],
    offsets: frameSwinging2.offset ? [frameSwinging2.offset] : undefined,
    angles: frameSwinging2.angle ? [frameSwinging2.angle] : undefined,
    opacities: (frameSwinging2.opacity !== undefined) ? [frameSwinging2.opacity] : undefined
  };

  // Casting
  const frameCasting = frames[FRN.CASTING];
  if (frameCasting) cycles[LAS.CASTING] = {
    spriteNames: [spriteName],
    offsets: frameCasting.offset ? [frameCasting.offset] : undefined,
    opacities: (frameCasting.opacity !== undefined) ? [frameCasting.opacity] : undefined,
    loop: true
  };

  // Cheering
  const frameCheering = frames[FRN.CHEERING];
  if (frameCheering) cycles[LAS.CHEERING] = {
    spriteNames: [spriteName],
    offsets: frameCheering.offset ? [frameCheering.offset] : undefined,
    opacities: (frameCheering.opacity !== undefined) ? [frameCheering.opacity] : undefined
  };

  // Damaged
  const frameDamaged = frames[FRN.DAMAGED];
  if (frameDamaged) cycles[LAS.DAMAGED] = {
    spriteNames: [spriteName],
    offsets: frameDamaged.offset ? [frameDamaged.offset] : undefined,
    opacities: (frameDamaged.opacity !== undefined) ? [frameDamaged.opacity] : undefined
  };

  // Critical
  const frameCritical = frames[FRN.CRITICAL];
  if (frameCritical) cycles[LAS.CRITICAL] = {
    spriteNames: [spriteName],
    offsets: frameCritical.offset ? [frameCritical.offset] : undefined,
    opacities: (frameCritical.opacity !== undefined) ? [frameCritical.opacity] : undefined
  };

  // Down
  const frameDown = frames[FRN.DOWN];
  if (frameDown) cycles[FRN.DOWN] = {
    spriteNames: [spriteName],
    offsets: frameDown.offset ? [frameDown.offset] : undefined,
    opacities: (frameDown.opacity !== undefined) ? [frameDown.opacity] : undefined,
    angles: [270]
  };

  return cycles;
};

export default framesOneNameToCycles;