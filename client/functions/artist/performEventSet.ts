import { ANIMATION_TYPES } from "@client/enums";
import type Artist from "@client/models/artist/artist";
import type Fighter from "@common/models/fighter";
import type { PixiEvent } from "@client/models/artist/pixiEvent";
import Animation from "@client/models/artist/animation";
import animationTypes from "@client/instances/artist/animations";

const performEventSet = (args: {
  artist: Artist,
  eventSet: PixiEvent[],
  fighters: { [id: string]: Fighter },
}) => {
  const { artist, eventSet, fighters } = args;

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
      const container = artist.pixiChildrenRef.current[targetsId ?? '']
      if (!animationType || !targetsId || !container) throw Error('Missing data in performEventSet.');
      setTimeout(() => {
        const animation = new Animation({
          type: particleContainerName,
          targets: targetsId,
          ix: (container.x + (container.width / 2)),
          iy: (container.y + (container.height / 2)),
          particleSpriteNames,
          particleCountFinal
        }, animationType);
        artist.animations.push(animation);
      }, pixiEvent.delay);
    };
  });
};

export default performEventSet;