import * as PIXI from 'pixi.js';

import type Artist from "@client/models/artist/artist";
import type { PixiEvent } from "@common/models/pixiEvent";
import Fighter from "@common/models/fighter";
import Animation from "@client/models/artist/animation";
import animationTypes from "@client/instances/artist/animations";
import getAnimationTextures from "./getAnimationTextures";
import readyAnimatedSprite from "./readyAnimatedSprite";
import getPositionFromSpot from './getPositionFromSpot';
import { genId } from '@common/functions/utils/random';
import { ANIMATION_SPEED } from "@common/constants";
import { ARTIST_Z_INDECES } from '@common/enums';

const MAX_ATTEMPTS = 1000;
const TIMEOUT_INTERVAL = 10;

const performEventSet = async (args: {
  artist: Artist,
  eventSet: PixiEvent[],
  fighters: { [id: string]: Fighter },
  attempts?: number
}) => {
  const { artist, eventSet, fighters, attempts: attemptsArg } = args;
  const attempts = attemptsArg ?? 0;
  const pixiChildren = artist.pixiChildrenRef.current;

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
      setTimeout(() => (
        artist.changeFighterState({
          artist,
          fighterId: targetsId,
          nextState: fighterState,
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
        const fighter = fighters[targetsId];
        if (fighter) artist.drawFighters({ [targetsId]: fighter });
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'createParticleContainer') {
      const {
        targetsId, particleContainerName, particleSpriteNames, particleCountFinal
      } = pixiEvent.args;
      const animationType = animationTypes[particleContainerName];
      const container = artist.pixiChildrenRef.current[targetsId ?? ''];
      const firstChild = container?.children[0];
      if (!animationType || !targetsId || !firstChild || !container) {
        throw Error(`Missing data in performEventSet createParticleContainer: animationType ${!!animationType}, targetsId ${!!targetsId}, container ${!!container}.`);
      };
      setTimeout(() => {
        const animation = new Animation({
          type: particleContainerName,
          targets: targetsId,
          ix: pixiEvent.args.targetMirrored
            ? (container.x - ((firstChild.width * artist.pixelScale) / 2))
            : (container.x + ((firstChild.width * artist.pixelScale) / 2)),
          iy: (container.y + ((firstChild.height * artist.pixelScale) / 2)),
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
            const { vxStarting, vyStarting, duration } = pixiEvent.args.animationOptions ?? {};
            artist.animations.push(new Animation({
              type: pixiEvent.args.animationTypeId,
              targets: id,
              ix: pixiAnimatedSprite.x,
              iy: pixiAnimatedSprite.y,
              vx: vxStarting
                ?? (animationType.getVxStarting && animationType.getVxStarting(artist.pixelScale)),
              vy: vyStarting
                ?? (animationType.getVyStarting && animationType.getVyStarting(artist.pixelScale)),
              duration
            }, animationType));
          };
        };
      }, pixiEvent.delay);
    };

    if (pixiEvent.functionName === 'applyAnimation') {
      setTimeout(() => {
        const animationType = animationTypes[pixiEvent.args.animationTypeId];
        const container = pixiChildren[pixiEvent.args.targetsId];
        if (!animationType || !container) throw Error('Missing data in performEventSet applyAnimation.');
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
        const firstChild = container?.children[0];
        const occupant = fighters[pixiEvent.args.targetsId];
        if (!firstChild || !occupant) throw Error('Missing data in performEventSets moveSpot.');
        const occupantMoved = new Fighter({ ...occupant, coords: pixiEvent.args.coordsNext });
        const bodySize = {
          width: firstChild.width * artist.pixelScale,
          height: firstChild.height * artist.pixelScale
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
  });
};

export default performEventSet;