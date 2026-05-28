import type Artist from "@client/models/artist/artist";
import type { PixiEvent } from "@client/models/artist/pixiEvent";
import type Fighter from "@common/models/fighter";

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
  });
};

export default performEventSet;