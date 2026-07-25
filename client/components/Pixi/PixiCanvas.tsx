import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

import type Artist from '@client/models/artist/artist';
import animationTypes from '@client/instances/artist/animations';
import {
  PIXEL_SCALE_DEFAULT,
  SPRITE_SHEET_PATHS,
  ANIMATION_DEFAULT_INTERVAL,
  ANIMATION_DELETION_BUFFER,
} from '@common/constants';
import { genId } from '@common/functions/utils/random';
import { ARTIST_Z_INDECES } from '@common/enums';
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
      const canvasAnchorTop = document.querySelector('#canvasAnchorTop');
      if (!canvasAnchor || !canvasAnchorTop) {
        setState('error');
        return;
      }
      
      initPixiApp({ canvasAnchor, canvasAnchorTop, artistRef })
      .then(() => {
        const pixiApp = artistRef.current.pixiAppRef.current;
        const pixiTopApp = artistRef.current.pixiTopAppRef.current;
        if (!pixiApp || !pixiTopApp) throw Error('PixiApps missing after initialization');

        const mainContainer = new PIXI.Container();
        mainContainer.zIndex = ARTIST_Z_INDECES.MAIN_CONTAINER;
        pixiApp.stage.addChild(mainContainer);
        artistRef.current.pixiChildrenRef.current['main'] = mainContainer;

        const mainTopContainer = new PIXI.Container();
        mainTopContainer.zIndex = ARTIST_Z_INDECES.MAIN_CONTAINER;
        pixiTopApp.stage.addChild(mainTopContainer);
        artistRef.current.pixiTopChildrenRef.current['main'] = mainTopContainer;

        setState('ready');
        artistRef.current.setPixiInitialized(true);
      });
    }
  }, [state, artistRef]);

  return <>
    <div id="canvasAnchor" />
    <div id="canvasAnchorTop" />
  </>;
};

const initPixiApp = async (args: {
  canvasAnchor: Element;
  canvasAnchorTop: Element;
  artistRef: React.RefObject<Artist>
}) => {
  const { canvasAnchor, canvasAnchorTop, artistRef } = args;

  const artist = artistRef.current;
  const initProps = {
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: false,
    backgroundAlpha: 0
  };
  artist.pixelScale = PIXEL_SCALE_DEFAULT;

  const pixiApp = new PIXI.Application();
  await pixiApp.init(initProps);
  canvasAnchor.appendChild(pixiApp.canvas);
  artistRef.current.pixiAppRef.current = pixiApp;
  const pixiChildren = artistRef.current.pixiChildrenRef.current;
  const pixiParticleContainers = artistRef.current.pixiParticleContainersRef.current;
  const pixiParticles = artistRef.current.pixiParticlesRef.current;

  const pixiTopApp = new PIXI.Application();
  await pixiTopApp.init(initProps);
  canvasAnchorTop.appendChild(pixiTopApp.canvas);
  artistRef.current.pixiTopAppRef.current = pixiTopApp;
  const pixiTopChildren = artistRef.current.pixiTopChildrenRef.current;

  return Promise.all(SPRITE_SHEET_PATHS.map((path) => PIXI.Assets.load(path)))
  .then((spriteSheets) => {
    spriteSheets.forEach((spriteSheet: PIXI.Spritesheet) => {
      Object.values(spriteSheet.textures).forEach((texture) => {
        texture.source.scaleMode = 'nearest';
      });
    });
    pixiApp.ticker.add(() => tickerFunction({
      artist,
      pixiChildren,
      pixiParticleContainers,
      pixiParticles
    }));
    pixiTopApp.ticker.add(() => tickerFunction({
      artist,
      pixiChildren: pixiTopChildren,
      pixiParticleContainers: {},
      pixiParticles: {}
    }));
  });
};

const tickerFunction = (args: {
  artist: Artist,
  pixiChildren: { [id: string]: PIXI.ContainerChild },
  pixiParticleContainers: { [id: string]: PIXI.ParticleContainer<PIXI.Particle> },
  pixiParticles: { [id: string]: PIXI.Particle }
}) => {
  const { artist, pixiChildren, pixiParticleContainers, pixiParticles } = args;
  const now = Date.now();
  
  const toDelete: string[] = [];
  artist.animations.forEach((animation) => {
    const container = pixiChildren[animation.targets];
    const animationType = animationTypes[animation.type];
    if (!container || !animationType) return;

    const shouldDelete = !animation.infinite && (
      ((animation.expiresAt ?? 0) + ANIMATION_DELETION_BUFFER) < now
    );
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
      const positionNext = animationType.getPosition(
        { animation, elapsed, pixelScale: artist.pixelScale }
      );
      container.position = positionNext;
      animation.lastTickAt = now;
    };

    if (animationType.getOpacity) {
      const opacityNext = animationType.getOpacity(elapsed, animation);
      container.alpha = opacityNext;
      animation.lastTickAt = now;
    };

    if (animationType.getParticlesToCreate && animationType.getParticleAnimation) {
      const mainContainer = pixiChildren['main'];
      if (!mainContainer) throw Error('Missing main Pixi container in getParticlesToCreate');
      if (!pixiParticleContainers[animation.id]) {
        const particleContainerNew = new PIXI.ParticleContainer({
          dynamicProperties: animationType.particleContainerDynamicProperties,
          zIndex: ARTIST_Z_INDECES.FOREGROUND_EFFECTS
        }) as PIXI.ParticleContainer<PIXI.Particle>;
        pixiParticleContainers[animation.id] = particleContainerNew;
        mainContainer.addChild(particleContainerNew);
      };
      const pixiParticleContainer = pixiParticleContainers[animation.id];

      const particles = animationType.getParticlesToCreate(animation, elapsed, animationType);
      if (particles) {
        animation.lastTickAt = now;
        if (!animation.particlesCreatedCount) animation.particlesCreatedCount = 0;
        animation.particlesCreatedCount += particles.length;
      };

      particles?.forEach((particle, index) => {
        if (!animationType.getParticleAnimation || !pixiParticleContainer || !animationType.particleAnimationType) return;

        particle.scaleX = artist.pixelScale;
        particle.scaleY = artist.pixelScale;
        pixiParticleContainer.addParticle(particle);
        const id = `${animation.id}-${genId()}`;
        pixiParticles[id] = particle;
        
        const particleAnimationType = animationTypes[animationType.particleAnimationType];
        if (!particleAnimationType) throw Error('Missing particleAnimationType');
        const particleAnimation = animationType.getParticleAnimation({
          animation,
          elapsed,
          index,
          totalCount: particles.length,
          animationType: particleAnimationType,
          pixelScale: artist.pixelScale
        });
        artist.particleAnimations.push({ ...particleAnimation, targets: id });
      });
    };
  });

  const toDeleteParticles: string[] = [];
  artist.particleAnimations.forEach((animation) => {
    const particle = pixiParticles[animation.targets];
    const animationType = animationTypes[animation.type];
    if (!particle || !animationType) return;

    const shouldDelete = !animation.infinite && (
      ((animation.expiresAt ?? 0) + ANIMATION_DELETION_BUFFER) < now
    );
    if (shouldDelete) {
      toDeleteParticles.push(animation.id);
      return;
    }

    const interval = animationType.interval ?? ANIMATION_DEFAULT_INTERVAL;
    const shouldAnimate = ((animation.lastTickAt ?? 0) + interval) < now;
    if (!shouldAnimate) return;
    const elapsed = now - animation.startedAt;

    if (animationType.getPosition) {
      const positionNext = animationType.getPosition(
        { animation, elapsed, pixelScale: artist.pixelScale }
      );
      particle.x = positionNext.x;
      particle.y = positionNext.y;
      animation.lastTickAt = now;
    };

    if (animationType.getOpacity) {
      const opacityNext = animationType.getOpacity(elapsed, animation);
      particle.alpha = opacityNext;
      animation.lastTickAt = now;
    };
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