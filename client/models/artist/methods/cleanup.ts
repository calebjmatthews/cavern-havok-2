import type Artist from "../artist";
import Animation from "../animation";
import fadeAway from "@client/instances/artist/animations/fadeAway";
import { ANIMATION_TYPES } from "@client/enums";

const cleanup = (artist: Artist) => {
  const pixiChildren = artist.pixiChildrenRef.current;
  const pixiParticleContainers = artist.pixiParticleContainersRef.current;
  const mainContainer = pixiChildren['main'];
  if (!mainContainer) throw Error('Missing main Pixi container in cleanup.');

  artist.animations.push(new Animation({
    type: ANIMATION_TYPES.FADE_AWAY,
    targets: 'main',
  }, fadeAway));

  setTimeout(() => {
    Object.entries(pixiChildren).forEach(([ id, container ]) => {
      if (id === 'background' || id === 'main') return;
      mainContainer.removeChild(container);
      delete pixiChildren[id];
    });
    Object.entries(pixiParticleContainers).forEach(([ id, particleContainer ]) => {
      mainContainer.removeChild(particleContainer);
      delete pixiParticleContainers[id];
    });
    artist.pixiParticlesRef.current = {};
    artist.animations = [];
    artist.spotsBounds = [];
  }, 600);
};

export default cleanup;