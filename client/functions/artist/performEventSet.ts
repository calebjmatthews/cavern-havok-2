import * as PIXI from 'pixi.js';

import type Artist from "@client/models/artist/artist";
import type { PixiEvent } from "@common/models/pixiEvent";
import type Creation from '@common/models/creation';
import type Obstacle from '@common/models/obstacle';
import type BattleState from '@common/models/battleState';
import Fighter from "@common/models/fighter";
import Animation from "@client/models/artist/animation";
import animationTypes from "@client/instances/artist/animations";
import getAnimationTextures from "./getAnimationTextures";
import readyAnimatedSprite from "./readyAnimatedSprite";
import getPositionFromSpot from './getPositionFromSpot';
import { genId } from '@common/functions/utils/random';
import { ANIMATION_SPEED } from "@common/constants";
import { ARTIST_Z_INDECES } from '@common/enums';
import applyAnimationToOccupant from './applyAnimationToOccupant';

const MAX_ATTEMPTS = 1000;
const TIMEOUT_INTERVAL = 10;

const performEventSet = async (args: {
  artist: Artist,
  eventSet: PixiEvent[],
  battleState: BattleState,
  attempts?: number
}) => {
  const { artist, eventSet, battleState, attempts: attemptsArg } = args;
  const attempts = attemptsArg ?? 0;
  const pixiChildren = artist.pixiChildrenRef.current;
  const occupants: { [id: string]: Fighter | Obstacle | Creation } = {
    ...battleState.fighters,
    ...battleState.obstacles,
    ...battleState.creations
  };

  if (Object.keys(pixiChildren).length === 0 && attempts < MAX_ATTEMPTS) {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(performEventSet({ ...args, attempts: attempts+1 })),
        TIMEOUT_INTERVAL
      );
    });
  }
  else if (attempts >= MAX_ATTEMPTS) return null;

  eventSet.forEach((pixiEvent) => {

    if (pixiEvent.functionName === 'changeFighterState') {
      const { targetsId, fighterState, fighterStateDefault } = pixiEvent.args;
      const layeredAnimated = artist.layeredAnimateds[targetsId];
      if (!layeredAnimated) throw Error('Missing layeredAnimated in changeFighterState');
      const fighterStateDefaultCurrent = layeredAnimated.stateDefault;
      setTimeout(() => (
        artist.changeFighterState({
          artist,
          fighterId: targetsId,
          nextState: fighterState ?? fighterStateDefaultCurrent,
          nextStateDefault: fighterStateDefault
        })
      ), pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'equipToFront') {
      const { targetsId, pieceId } = pixiEvent.args;
      setTimeout(() => {
        artist.equipToFront({
          artist,
          fighterId: targetsId,
          pieceId
        });
        const occupant = occupants[targetsId];
        if (occupant?.occupantKind === 'fighter') artist.drawFighters({ [targetsId]: occupant });
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'createParticleContainer') {
      const {
        targetsId, particleContainerName, particleSpriteNames, particleCountFinal
      } = pixiEvent.args;
      const animationType = animationTypes[particleContainerName];
      const container = artist.pixiChildrenRef.current[targetsId ?? ''];
      const firstChildOrContainer = container?.children[0] ?? container;
      if (!animationType || !targetsId || !firstChildOrContainer || !container) {
        throw Error(`Missing data in performEventSet createParticleContainer: animationType ${!!animationType}, targetsId ${!!targetsId}, container ${!!container}.`);
      };
      setTimeout(() => {
        const animation = new Animation({
          type: particleContainerName,
          targets: targetsId,
          ix: pixiEvent.args.targetMirrored
            ? (container.x - ((firstChildOrContainer.width * artist.pixelScale) / 2))
            : (container.x + ((firstChildOrContainer.width * artist.pixelScale) / 2)),
          iy: (container.y + ((firstChildOrContainer.height * artist.pixelScale) / 2)),
          particleSpriteNames,
          particleCountFinal
        }, animationType);
        artist.animations.push(animation);
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'createAnimatedSprite') {
      setTimeout(() => {
        const id = genId();
        const textures = getAnimationTextures(pixiEvent.args);
        const pixiAnimatedSpriteRaw = new PIXI.AnimatedSprite(textures);
        pixiAnimatedSpriteRaw.animationSpeed = ANIMATION_SPEED;
        const pixiAnimatedSprite = readyAnimatedSprite(pixiAnimatedSpriteRaw, pixiEvent.args);
        pixiAnimatedSprite.zIndex = ARTIST_Z_INDECES.FOREGROUND_EFFECTS;
        const container = pixiChildren[pixiEvent.args.targetsId ?? ''];
        if (container) {
          container.addChild(pixiAnimatedSprite);
          pixiChildren[id] = pixiAnimatedSprite;
          // Handle sprite destruction at end of durationOverall
          setTimeout(() => {
            const container = pixiChildren[pixiEvent.args.targetsId ?? ''];
            const spriteToDestroy = pixiChildren[id];
            if (spriteToDestroy) {
              container?.removeChild(spriteToDestroy);
              delete pixiChildren[id];
            };
          }, pixiEvent.args.durationOverall);
          if (pixiEvent.args.animationTypeId) {
            const animationType = animationTypes[pixiEvent.args.animationTypeId];
            if (!animationType) throw Error('Missing data in performEventSet createAnimatedSprite.');
            const { vxStarting, vyStarting, duration, delay } = pixiEvent.args.animationOptions ?? {};
            const delayUntil = delay ? Date.now() + delay : undefined;
            artist.animations.push(new Animation({
              type: pixiEvent.args.animationTypeId,
              targets: id,
              ix: pixiAnimatedSprite.x,
              iy: pixiAnimatedSprite.y,
              vx: vxStarting
                ?? (animationType.getVxStarting && animationType.getVxStarting(artist.pixelScale)),
              vy: vyStarting
                ?? (animationType.getVyStarting && animationType.getVyStarting(artist.pixelScale)),
              duration,
              delayUntil
            }, animationType));
          };
        };
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'applyAnimation') {
      setTimeout(() => {
        const animationType = animationTypes[pixiEvent.args.animationTypeId];
        const container = pixiChildren[pixiEvent.args.targetsId];
        if (!animationType || !container) {
          throw Error(`Missing data in performEventSet applyAnimation, animationType: ${!!animationType}, container: ${!!container}.`);
        }
        const { cx, cy } = pixiEvent.args.animationOptions || {};
        artist.animations.push(new Animation({
          type: pixiEvent.args.animationTypeId,
          targets: pixiEvent.args.targetsId,
          ix: container.x,
          iy: container.y,
          vx: animationType.getVxStarting && animationType.getVxStarting(artist.pixelScale),
          vy: animationType.getVyStarting && animationType.getVyStarting(artist.pixelScale),
          cx,
          cy
        }, animationType));
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'moveSpot') {
      setTimeout(() => {
        const container = pixiChildren[pixiEvent.args.targetsId];
        const firstChildOrContainer = container?.children[0] ?? container;
        const occupant = occupants[pixiEvent.args.targetsId];
        if (!container || !firstChildOrContainer || !occupant) {
          throw Error('Missing data in performEventSets moveSpot.');
        };
        let occupantMoved: Fighter | Obstacle | Creation | null = null;
        if (occupant.occupantKind === 'fighter') {
          occupantMoved = new Fighter({ ...occupant, coords: pixiEvent.args.coordsNext });
        }
        else if (occupant.occupantKind === 'obstacle') {
          occupantMoved = { ...occupant, coords: pixiEvent.args.coordsNext };
        }
        if (!occupantMoved) return;
        const bodySize = {
          width: firstChildOrContainer.width * artist.pixelScale,
          height: firstChildOrContainer.height * artist.pixelScale
        };
        const positionFromSpot = getPositionFromSpot({
          artist, occupant: occupantMoved, size: bodySize
        });
        if (!positionFromSpot) throw Error('Missing data in performEventSets moveSpot.');
        container.position = positionFromSpot;
        if (occupant.side === 'A') {
          container.x += bodySize.width;
        };
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'removeContainer') {
      setTimeout(() => {
        const container = pixiChildren[pixiEvent.args.targetsId];
        const stage = artist.pixiAppRef.current?.stage;
        if (!container || !stage) {
          throw Error('Missing data in performEventSets moveSpot.');
        };
        stage.removeChild(container);
        delete pixiChildren[pixiEvent.args.targetsId];
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'drawObstacle') {
      setTimeout(() => {
        const { obstacle } = pixiEvent.args;
        artist.drawObstacles({ [obstacle.id]: obstacle });
        applyAnimationToOccupant({ artist, pixiEvent });
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'drawFighter') {
      setTimeout(() => {
        const { fighter } = pixiEvent.args;
        artist.drawFighters({ [fighter.id]: fighter });
        applyAnimationToOccupant({ artist, pixiEvent });
      }, pixiEvent.delay);
    };
  });
};

export default performEventSet;