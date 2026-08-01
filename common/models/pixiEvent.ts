/**
 * PixiEvents could:
 * - Apply movement of a fighter to a different spot, with accompanying particle animated sprite.
 * - Add a particle container to a fighter or the screen at large.
 * - Add a short-lived animated sprite to a fighter or the screen at large.
 * - Apply an animation to a fighter.
 * - Change displayed equipment of a fighter.
 * - Display damage numbers upon a fighter.
 * - Change the state or default state of a LayeredAnimated.
 * 
 * A basic attack would create the following:
 * 1. Change attacker's LA state to Swinging, add swish effect
 * 2. After 200ms delay change target's LA state to Damaged and default state to Critical, give target a wobble animation, show slash effect on target, and create damage numbers on target.
 */

import type Fighter from "./fighter";
import type Obstacle from "./obstacle";

interface PixiEventBase {
  id: string;
  functionName: (
    'createAnimatedSprite' | 'createParticleContainer' | 'applyAnimation' | 'moveFighterSpace'
    | 'changeFighterState' | 'equipToFront' | 'changeStat' | 'moveSpot' | 'removeContainer'
    | 'drawObstacle' | 'drawFighter' | 'callMethod'
  );
  delay: number;
  args: {
    targetsId?: string;
    targetsCoords?: [number, number];
    spriteNames?: string[];
    durations?: number[];
    offsets?: { x: number, y: number }[];
    angles?: number[];
    opacities?: number[];
    loop?: boolean;
    duration?: number;
    durationOverall?: number;
    animationTypeId?: string;
    animationOptions?: {
      vxStarting?: number,
      vyStarting?: number;
      duration?: number;
      delay?: number;
      cx?: number;
      cy?: number;
    };
    particleContainerName?: string;
    particleCountFinal?: number;
    fighterState?: string;
    fighterStateDefault?: string;
    obstacle?: Obstacle;
    fighter?: Fighter;
    methodName?: 'cleanup';
  },
};

interface PixiEventCreateAnimatedSprite extends PixiEventBase {
  functionName: 'createAnimatedSprite';
  args: {
    targetsId?: string;
    targetsCoords?: [number, number];
    spriteNames: string[];
    durations?: number[];
    offsets?: { x: number, y: number }[];
    angles?: number[];
    opacities?: number[];
    loop?: boolean;
    durationOverall: number;
    animationTypeId?: string;
    animationOptions?: {
      vxStarting?: number,
      vyStarting?: number;
      duration?: number;
      delay?: number;
    };
  };
};

interface PixiEventCreateParticleContainer extends PixiEventBase {
  functionName: 'createParticleContainer';
  args: {
    targetsId?: string;
    targetsCoords?: [number, number];
    particleSpriteNames?: string[];
    particleContainerName: string;
    particleCountFinal: number;
    targetMirrored?: boolean;
  };
};

interface PixiEventChangeFighterState extends PixiEventBase {
  functionName: 'changeFighterState';
  args: {
    targetsId: string;
    fighterState?: string;
    fighterStateDefault?: string;
  };
};

interface PixiEventEquipToFront extends PixiEventBase {
  functionName: 'equipToFront';
  args: {
    targetsId: string;
    pieceId: string;
  };
};

interface PixiEventApplyAnimation extends PixiEventBase {
  functionName: 'applyAnimation';
  args: {
    targetsId: string;
    animationTypeId: string;
    animationOptions?: {
      cx?: number;
      cy?: number;
    };
  };
};

interface PixiEventMoveSpot extends PixiEventBase {
  functionName: 'moveSpot';
  args: {
    targetsId: string;
    coordsNext: [number, number];
  };
};

interface PixiEventRemoveContainer extends PixiEventBase {
  functionName: 'removeContainer';
  args: {
    targetsId: string;
  };
};

interface PixiEventDrawObstacle extends PixiEventBase {
  functionName: 'drawObstacle';
  args: {
    obstacle: Obstacle
    animationTypeId?: string;
  }
};

interface PixiEventDrawFighter extends PixiEventBase {
  functionName: 'drawFighter';
  args: {
    fighter: Fighter,
    animationTypeId?: string;
  }
};

interface PixiEventCallMethod extends PixiEventBase {
  functionName: 'callMethod';
  args: {
    methodName: 'cleanup';
  }
};

export type PixiEvent = (
  PixiEventCreateAnimatedSprite | PixiEventCreateParticleContainer | PixiEventChangeFighterState
  | PixiEventEquipToFront | PixiEventApplyAnimation | PixiEventMoveSpot
  | PixiEventRemoveContainer | PixiEventDrawObstacle | PixiEventDrawFighter | PixiEventCallMethod
);