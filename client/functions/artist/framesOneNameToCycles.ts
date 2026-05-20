import type Cycle from "@client/models/artist/cycle";
import type CycleFrame from "@client/models/artist/cycleFrame";
import range from "@common/functions/utils/range";
import { FRAME_NAMES } from "@client/enums";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const FRN = FRAME_NAMES;
const LAS = LAYERED_ANIMATED_STATES;

const framesOneNameToCycles = (args: {
  spriteName: string,
  frames: { [name: string] : CycleFrame }
}) => {
  const { spriteName, frames: framesArg } = args;
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
    loop: true
  };

  // Walking
  const frameWalking0 = frames[FRN.WALKING_0];
  const frameWalking1 = frames[FRN.WALKING_1];
  if (frameResting && frameWalking0 && frameWalking1) cycles[LAS.WALKING] = {
    spriteNames: range(0, 3).map(() => spriteName),
    offsets: frameWalking0?.offset && frameResting?.offset && frameWalking1?.offset ? [
      frameWalking0.offset, frameResting.offset, frameWalking1.offset, frameResting.offset
    ] : undefined,
    loop: true
  };

  if (frameWalking0) cycles[LAS.WALKING0] = {
    spriteNames: [spriteName],
    offsets: frameWalking0.offset ? [frameWalking0.offset] : undefined
  };

  if (frameWalking1) cycles[LAS.WALKING1] = {
    spriteNames: [spriteName],
    offsets: frameWalking1.offset ? [frameWalking1.offset] : undefined
  };

  // Swinging
  const frameSwinging0 = frames[FRN.SWINGING_0];
  const frameSwinging1 = frames[FRN.SWINGING_1];
  const frameSwinging2 = frames[FRN.SWINGING_2];
  if (frameSwinging0 && frameSwinging1 && frameSwinging2) cycles[LAS.SWINGING] = {
    spriteNames: range(0, 2).map(() => spriteName),
    offsets: frameSwinging0?.offset && frameSwinging1?.offset && frameSwinging2?.offset ? [
      frameSwinging0.offset, frameSwinging1.offset, frameSwinging2.offset
    ] : undefined
  };

  if (frameSwinging0) cycles[LAS.SWINGING0] = {
    spriteNames: [spriteName],
    offsets: frameSwinging0.offset ? [frameSwinging0.offset] : undefined
  };


  if (frameSwinging1) cycles[LAS.SWINGING1] = {
    spriteNames: [spriteName],
    offsets: frameSwinging1.offset ? [frameSwinging1.offset] : undefined
  };

  if (frameSwinging2) cycles[LAS.SWINGING2] = {
    spriteNames: [spriteName],
    offsets: frameSwinging2.offset ? [frameSwinging2.offset] : undefined
  };

  // Casting
  const frameCasting = frames[FRN.CASTING];
  if (frameCasting) cycles[LAS.CASTING] = {
    spriteNames: [spriteName],
    offsets: frameCasting.offset ? [frameCasting.offset] : undefined,
    loop: true
  };

  // Throwing
  if (frameWalking1 && frameSwinging1 && frameSwinging0 && frameSwinging2) cycles[LAS.THROWING] = {
    spriteNames: range(0, 3).map(() => spriteName),
    offsets: (
      frameWalking1.offset && frameSwinging1.offset && frameSwinging0.offset &&
      frameSwinging2.offset
    ) ? [
      frameWalking1.offset, frameSwinging1.offset, frameSwinging0.offset,
      frameSwinging2.offset
    ] : undefined,
    durations: [15, 10, 30, 20]
  };

  // Clenching
  const frameClenching = frames[FRN.CLENCHING];
  if (frameClenching) cycles[LAS.CLENCHING] = {
    spriteNames: [spriteName],
    offsets: frameClenching.offset ? [frameClenching.offset] : undefined
  };

  // Cheering
  const frameCheering = frames[FRN.CHEERING];
  if (frameCheering) cycles[LAS.CHEERING] = {
    spriteNames: [spriteName],
    offsets: frameCheering.offset ? [frameCheering.offset] : undefined
  };

  // Damaged
  const frameDamaged = frames[FRN.DAMAGED];
  if (frameDamaged) cycles[LAS.DAMAGED] = {
    spriteNames: [spriteName],
    offsets: frameDamaged.offset ? [frameDamaged.offset] : undefined
  };

  // Critical
  const frameCritical = frames[FRN.CRITICAL];
  if (frameCritical) cycles[LAS.CRITICAL] = {
    spriteNames: [spriteName],
    offsets: frameCritical.offset ? [frameCritical.offset] : undefined
  };

  // Down
  const frameDown = frames[FRN.DOWN];
  if (frameDown) cycles[FRN.DOWN] = {
    spriteNames: [spriteName],
    offsets: frameDown.offset ? [frameDown.offset] : undefined,
    angle: 270
  };

  return cycles;
};

export default framesOneNameToCycles;