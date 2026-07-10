
import type { PixiEvent } from "@common/models/pixiEvent";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import { genId } from "@common/functions/utils/random";
import { ANIMATION_SPEED } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const LAS = LAYERED_ANIMATED_STATES;

const testEventSets: { [id: string]: PixiEvent[] } =  {
  ['Ready Hatchet']: [{
    id: genId(),
    functionName: 'equipToFront',
    delay: 0,
    args: { targetsId: 'test', pieceId: '' }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: 0,
    args: {
      targetsId: 'test',
      spriteNames: ['ready_glint0.png', 'ready_glint1.png', 'ready_glint2.png'],
      offsets: [{ x: -9, y: 0 }],
      durations: [10, 6, 6],
      opacities: [0.8],
      durationOverall: 300,
      loop: false
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.CLENCHING, fighterStateDefault: LAS.CLENCHING }
  }],
  ['Attack with swing']: [{
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.SWINGING, fighterStateDefault: LAS.RESTING }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      spriteNames: ['swing_swish.png'],
      offsets: [{ x: -6, y: -5 }],
      opacities: [0.8],
      durationOverall: 300,
      animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: (30 / ANIMATION_SPEED),
    args: { targetsId: 'boulder', fighterState: LAS.DAMAGED, fighterStateDefault: LAS.CRITICAL }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (30 / ANIMATION_SPEED),
    args: { targetsId: 'boulder', animationTypeId: ANIMATION_TYPES.WOBBLE }
  }, {
    id: genId(),
    functionName: 'createParticleContainer',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'boulder',
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      ...getHealthNumberProps(3)
    }
  }, {
    id: genId(),
    functionName: 'changeStat',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'boulder',
      statName: 'health',
      quantity: -3
    }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (30 / ANIMATION_SPEED),
    args: {
      targetsId: 'boulder',
      animationTypeId: ANIMATION_TYPES.FADE_AWAY
    }
  }, {
    id: genId(),
    functionName: 'removeContainer',
    delay: (30 / ANIMATION_SPEED) + 500,
    args: {
      targetsId: 'boulder'
    }
  }],
  ['Ready Swallow']: [{
    id: genId(),
    functionName: 'equipToFront',
    delay: 0,
    args: { targetsId: 'test', pieceId: '' }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: 0,
    args: {
      targetsId: 'test',
      spriteNames: ['ready_glint0.png', 'ready_glint1.png', 'ready_glint2.png'],
      offsets: [{ x: -9, y: 0 }],
      durations: [10, 6, 6],
      opacities: [0.8],
      durationOverall: 300,
      loop: false
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.CLENCHING, fighterStateDefault: LAS.CLENCHING }
  }],
  ['Attack with throw']: [{
    id: genId(),
    functionName: 'changeFighterState',
    delay: 0,
    args: { targetsId: 'test', fighterState: LAS.THROWING, fighterStateDefault: LAS.RESTING }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (40 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      spriteNames: ['throw_swish.png'],
      offsets: [{ x: 4, y: -20 }],
      opacities: [0.8],
      durationOverall: 300,
      animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE,
      animationOptions: { vxStarting: (1200 * 3), vyStarting: (4000 * 3) }
    }
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (40 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      spriteNames: [`swallow.png`],
      offsets: [{ x: 8, y: -6 }],
      durationOverall: 1000,
      animationTypeId: ANIMATION_TYPES.MOVE,
      animationOptions: { vxStarting: (-1200 * 3), vyStarting: (-3200 * 3) }
    }
}, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (60 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      spriteNames: [`swallow.png`],
      offsets: [{ x: 10, y: 4 }],
      angles: [180],
      durationOverall: 1000,
      animationTypeId: ANIMATION_TYPES.REGRESS,
      animationOptions: { vxStarting: (-300 * 3), vyStarting: (-800 * 3) }
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: (85 / ANIMATION_SPEED),
    args: { targetsId: 'foe', fighterState: LAS.DAMAGED, fighterStateDefault: LAS.CRITICAL }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (85 / ANIMATION_SPEED),
    args: { targetsId: 'foe', animationTypeId: ANIMATION_TYPES.WOBBLE }
  }, {
    id: genId(),
    functionName: 'createParticleContainer',
    delay: (85 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      ...getHealthNumberProps(2)
    }
  }, {
    id: genId(),
    functionName: 'changeStat',
    delay: (85 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      statName: 'health',
      quantity: -2
    }
  }],
  ['Lunge']: [{
    id: genId(),
    functionName: 'applyAnimation',
    delay: 0,
    args: {
      targetsId: 'foe',
      animationTypeId: ANIMATION_TYPES.LUNGE,
      animationOptions: { cx: -21, cy: -12 }
    },
  }, {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: (10 / ANIMATION_SPEED),
    args: {
      targetsId: 'foe',
      spriteNames: ['swing_swish.png'],
      offsets: [{ x: -6, y: -5 }],
      opacities: [0.8],
      durationOverall: 250,
      animationTypeId: ANIMATION_TYPES.FADE_AWAY,
      animationOptions: {
        duration: 200
      }
    }
  }, {
    id: genId(),
    functionName: 'changeFighterState',
    delay: (10 / ANIMATION_SPEED),
    args: { targetsId: 'test', fighterState: LAS.DAMAGED, fighterStateDefault: LAS.CRITICAL }
  }, {
    id: genId(),
    functionName: 'applyAnimation',
    delay: (10 / ANIMATION_SPEED),
    args: { targetsId: 'test', animationTypeId: ANIMATION_TYPES.WOBBLE }
  }, {
    id: genId(),
    functionName: 'createParticleContainer',
    delay: (10 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
      targetMirrored: true,
      ...getHealthNumberProps(2)
    }
  }, {
    id: genId(),
    functionName: 'changeStat',
    delay: (10 / ANIMATION_SPEED),
    args: {
      targetsId: 'test',
      statName: 'health',
      quantity: -2
    }
  },],
  ['Move back']: [{
    id: genId(),
    functionName: 'moveSpot',
    delay: 0,
    args: {
      targetsId: 'test',
      coordsNext: [2, 2]
    }
  }]
};

export default testEventSets;