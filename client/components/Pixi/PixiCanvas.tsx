import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

import type Artist from '@client/models/artist/artist';
import animationTypes from '@client/instances/artist/animations';
import {
  PIXEL_SCALE,
  SPRITE_SHEET_PATHS,
  ANIMATION_DEFAULT_INTERVAL,
  ANIMATION_DELETION_BUFFER,
} from '@common/constants';
import { genId } from '@common/functions/utils/random';
import { ANIMATION_TYPES } from '@client/enums';
import './pixiCanvas.css';

const PixiCanvas = (props: {
  artistRef: React.RefObject<Artist>
}) => {
  const { artistRef } = props;

  const [state, setState] = useState('clean');  

  useEffect(() => {
    if (state === 'clean') setState('beginLoad');
    if (state === 'beginLoad') {
      setState('loading');

      const canvasAnchor = document.querySelector('#canvasAnchor');
      if (!canvasAnchor) {
        setState('error');
        return;
      }
      
      initPixiApp({ canvasAnchor, artistRef })
      .then(() => {
        setState('ready');
        artistRef.current.setPixiInitialized(true);
      });
    }
  }, [state, artistRef]);

  return <div id="canvasAnchor" />;
};

const initPixiApp = async (args: {
  canvasAnchor: Element;
  artistRef: React.RefObject<Artist>
}) => {
  const { canvasAnchor, artistRef } = args;

  const pixiApp = new PIXI.Application();
  await pixiApp.init({
    width: (window.innerWidth / PIXEL_SCALE),
    height: (window.innerHeight / PIXEL_SCALE),
    resolution: PIXEL_SCALE,
    antialias: true,
    backgroundAlpha: 0
  });
  canvasAnchor.appendChild(pixiApp.canvas);
  artistRef.current.pixiAppRef.current = pixiApp;
  const artist = artistRef.current;
  const pixiContainers = artistRef.current.pixiContainersRef.current;
  const pixiParticleContainers = artistRef.current.pixiParticleContainersRef.current;
  const pixiParticles = artistRef.current.pixiParticlesRef.current;

  return Promise.all(SPRITE_SHEET_PATHS.map((path) => PIXI.Assets.load(path)))
  .then((spriteSheets) => {
    spriteSheets.forEach((spriteSheet: PIXI.Spritesheet) => {
      Object.values(spriteSheet.textures).forEach((texture) => {
        texture.source.scaleMode = 'nearest';
      });
    });
    pixiApp.ticker.add(() => tickerFunction({
      pixiApp,
      artist,
      pixiContainers,
      pixiParticleContainers,
      pixiParticles
    }));
  });
};

const tickerFunction = (args: {
  pixiApp: PIXI.Application,
  artist: Artist,
  pixiContainers: { [id: string]: PIXI.Container<PIXI.ContainerChild> },
  pixiParticleContainers: { [id: string]: PIXI.ParticleContainer<PIXI.IParticle> },
  pixiParticles: { [id: string]: PIXI.IParticle }
}) => {
  const { pixiApp, artist, pixiContainers, pixiParticleContainers, pixiParticles } = args;
  const now = Date.now();
  
  const toDelete: string[] = [];
  artist.animations.forEach((animation) => {
    const container = pixiContainers[animation.targets];
    const animationType = animationTypes[animation.type];
    if (!container || !animationType) return;

    const shouldDelete = (animation.expiresAt + ANIMATION_DELETION_BUFFER) < now;
    if (shouldDelete) {
      toDelete.push(animation.id);
      return;
    }

    const interval = animationType.interval ?? ANIMATION_DEFAULT_INTERVAL;
    const shouldAnimate = (
      ((animation.lastTickAt ?? 0) + interval) < now
      && now > (animation.delayUntil ?? 0)
    );
    if (!shouldAnimate) return;
    const elapsed = now - animation.startedAt;

    if (animationType.getPosition) {
      const positionNext = animationType.getPosition(animation, elapsed);
      container.position = positionNext;
      animation.lastTickAt = now;
    };

    if (animationType.getOpacity) {
      const opacityNext = animationType.getOpacity(elapsed);
      container.alpha = opacityNext;
      animation.lastTickAt = now;
    };

    if (animationType.getParticlesToCreate && animationType.getParticleAnimation) {
      if (!pixiParticleContainers[animation.id]) {
        const particleContainerNew = new PIXI.ParticleContainer({
          dynamicProperties: animationType.particleContainerDynamicProperties
        });
        particleContainerNew.zIndex = 2;
        pixiParticleContainers[animation.id] = particleContainerNew
        pixiApp.stage.addChild(particleContainerNew);
      };
      const pixiParticleContainer = pixiParticleContainers[animation.id];

      const particles = animationType.getParticlesToCreate(animation, elapsed, animationType);
      if (particles) {
        animation.lastTickAt = now;
        if (!animation.particlesCreatedCount) animation.particlesCreatedCount = 0;
        animation.particlesCreatedCount += particles.length;
      };

      particles?.forEach((particle) => {
        if (!animationType.getParticleAnimation || !pixiParticleContainer) return;

        pixiParticleContainer.addParticle(particle);
        const id = `${animation.id}-${genId()}`;
        pixiParticles[id] = particle;
        
        const particleAnimationType = animationTypes[ANIMATION_TYPES.CINDER_TREASURE];
        if (!particleAnimationType) throw Error('Missing particleAnimationType');
        const particleAnimation = animationType.getParticleAnimation(animation, elapsed, particleAnimationType);
        artist.particleAnimations.push({ ...particleAnimation, targets: id });
      });
    };
  });

  const toDeleteParticles: string[] = [];
  artist.particleAnimations.forEach((animation) => {
    const particle = pixiParticles[animation.targets];
    const animationType = animationTypes[animation.type];
    if (!particle || !animationType) return;

    const shouldDelete = (animation.expiresAt + ANIMATION_DELETION_BUFFER) < now;
    if (shouldDelete) {
      toDeleteParticles.push(animation.id);
      return;
    }

    const interval = animationType.interval ?? ANIMATION_DEFAULT_INTERVAL;
    const shouldAnimate = ((animation.lastTickAt ?? 0) + interval) < now;
    if (!shouldAnimate) return;
    const elapsed = now - animation.startedAt;

    if (animationType.getPosition) {
      const positionNext = animationType.getPosition(animation, elapsed);
      particle.x = positionNext.x;
      particle.y = positionNext.y;
      animation.lastTickAt = now;
    };

    // ToDo: Translate opacity to color hex value
    // if (animationType.getOpacity) {
    //   const opacityNext = animationType.getOpacity(elapsed);
    //   particle.color = opacityNext;
    //   animation.lastTickAt = now;
    // };
  });

  if (toDelete.length > 0) {
    artist.animations = artist.animations.filter((a) => !toDelete.includes(a.id));
  };
  if (toDeleteParticles.length > 0) {
    artist.particleAnimations = artist.particleAnimations.filter((a) => (
      !toDeleteParticles.includes(a.id)
    ));
    // ToDo: Handle deletion of PIXI containers and particle containers
  };
}

export default PixiCanvas;