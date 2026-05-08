import type Cycle from "@client/models/artist/cycle";
import type CycleFrame from "@client/models/artist/cycleFrame";
import { FRAME_NAMES } from "@client/enums";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const FRN = FRAME_NAMES;
const LAS = LAYERED_ANIMATED_STATES;

// Purely for programming convenience, this creates a system whereby frames can be defined
// individually and then reused by various animations without spriteNames and offsets having to
// be restated.
const framesToCycles = (args: {
  name: string,
  frames: { [name: string] : CycleFrame }
}) => {
  const { name, frames } = args;
  const cycles: { [name: string]: Cycle | Cycle[] } = {};

  // Resting
  const frameResting = frames[FRN.RESTING];
  if (frameResting) cycles[LAS.RESTING] = {
    spriteNames: [`${name}_resting.png`],
    offsets: frameResting.offset ? [frameResting.offset] : undefined,
    loop: true
  };

  // Walking
  const frameWalking0 = frames[FRN.WALKING_0];
  const frameWalking1 = frames[FRN.WALKING_1];
  if (frameResting && frameWalking0 && frameWalking1) cycles[LAS.WALKING] = {
    spriteNames: [
      `${name}_resting.png`, `${name}_walking0.png`, `${name}_resting.png`, `${name}_walking1.png`
    ],
    offsets: frameResting?.offset && frameWalking0?.offset && frameWalking1?.offset ? [
      frameResting.offset, frameWalking0.offset, frameResting.offset, frameWalking1.offset
    ] : undefined,
    loop: true
  };

  if (frameWalking0) cycles[LAS.WALKING0] = {
    spriteNames: [`${name}_walking0.png`],
    offsets: frameWalking0.offset ? [frameWalking0.offset] : undefined
  };

  if (frameWalking1) cycles[LAS.WALKING1] = {
    spriteNames: [`${name}_walking1.png`],
    offsets: frameWalking1.offset ? [frameWalking1.offset] : undefined
  };

  // Swinging
  const frameSwinging0 = frames[FRN.SWINGING_0];
  const frameSwinging1 = frames[FRN.SWINGING_1];
  const frameSwinging2 = frames[FRN.SWINGING_2];
  if (frameSwinging0 && frameSwinging1 && frameSwinging2) cycles[LAS.WALKING] = {
    spriteNames: [
      `${name}_swinging0.png`, `${name}_swinging1.png`, `${name}_swinging2.png`
    ],
    offsets: frameSwinging0?.offset && frameSwinging1?.offset && frameSwinging2?.offset ? [
      frameSwinging0.offset, frameSwinging1.offset, frameSwinging2.offset
    ] : undefined
  };

  if (frameSwinging0) cycles[LAS.SWINGING0] = {
    spriteNames: [`${name}_swinging0.png`],
    offsets: frameSwinging0.offset ? [frameSwinging0.offset] : undefined
  };


  if (frameSwinging1) cycles[LAS.SWINGING1] = {
    spriteNames: [`${name}_swinging1.png`],
    offsets: frameSwinging1.offset ? [frameSwinging1.offset] : undefined
  };

  if (frameSwinging2) cycles[LAS.SWINGING2] = {
    spriteNames: [`${name}_swinging2.png`],
    offsets: frameSwinging2.offset ? [frameSwinging2.offset] : undefined
  };

  // Casting
  const frameCasting = frames[FRN.CASTING];
  if (frameCasting) cycles[LAS.CASTING] = {
    spriteNames: [`${name}_casting0.png`],
    offsets: frameCasting.offset ? [frameCasting.offset] : undefined,
    loop: true
  };

  // Throwing
  if (frameWalking1 && frameSwinging1 && frameSwinging0 && frameSwinging2) cycles[LAS.THROWING] = {
    spriteNames: [
      `${name}_walking0.png`, `${name}_swinging1.png`, `${name}_swinging0.png`,
      `${name}_swinging2.png`
    ],
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
    spriteNames: [`${name}_clenching.png`],
    offsets: frameClenching.offset ? [frameClenching.offset] : undefined
  };

  // Cheering
  const frameCheering = frames[FRN.CHEERING];
  if (frameCheering) cycles[LAS.CHEERING] = {
    spriteNames: [`${name}_cheering.png`],
    offsets: frameCheering.offset ? [frameCheering.offset] : undefined
  };

  // Damaged
  const frameDamaged = frames[FRN.DAMAGED];
  if (frameDamaged) cycles[LAS.DAMAGED] = {
    spriteNames: [`${name}_damaged.png`],
    offsets: frameDamaged.offset ? [frameDamaged.offset] : undefined
  };

  // Critical
  const frameCritical = frames[FRN.CRITICAL];
  if (frameCritical) cycles[LAS.CRITICAL] = {
    spriteNames: [`${name}_critical.png`],
    offsets: frameCritical.offset ? [frameCritical.offset] : undefined
  };

  // Down
  if (frameSwinging0) cycles[LAS.DOWN] = {
    spriteNames: [`${name}_swinging0.png`],
    offsets: frameSwinging0.offset ? [frameSwinging0.offset] : undefined,
    angle: 270
  };

  return cycles;
};

export default framesToCycles;