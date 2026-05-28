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
 * Maybe, in general, a PixiEvent could correspond to a function with arguments, targets, and timing?
 * 
 * A basic attack would create the following:
 * 1. Change attacker's LA state to Swinging, add swish effect
 * 2. After 200ms delay change target's LA state to Damaged and default state to Critical, give target a wobble animation, show slash effect on target, and create damage numbers on target.
 */

interface PixiEventBase {
  id: string;
  functionName: 'createAnimatedSprite' | 'createParticleContainer' | 'moveFighterSpace' | 'changeFighterState' | 'applyAnimation';
  delay: number;
  args: {
    targetsId?: string;
    targetsCoords?: [number, number];
    spriteName?: string;
    duration?: number;
    particleContainerName?: string;
    particleCountFinal?: number;
    fighterState?: string;
    fighterStateDefault?: string;
  },
};

interface PixiEventCreateAnimatedSprite extends PixiEventBase {
  functionName: 'createAnimatedSprite';
  args: {
    targetsId?: string;
    targetsCoords?: [number, number];
    spriteName: string;
    duration: number;
  };
};

interface PixiEventCreateParticleContainer extends PixiEventBase {
  functionName: 'createParticleContainer';
  args: {
    targetsId?: string;
    targetsCoords?: [number, number];
    spriteName: string;
    particleContainerName: string;
    particleCountFinal: number;
  };
};

interface PixiEventChangeFighterState extends PixiEventBase {
  functionName: 'changeFighterState';
  args: {
    targetsId: string;
    fighterState: string;
    fighterStateDefault?: string;
  };
}

export type PixiEvent = (
  PixiEventCreateAnimatedSprite | PixiEventCreateParticleContainer | PixiEventChangeFighterState
);