import type Artist from "@client/models/artist/artist";
import changeFighterState from "@client/models/artist/fighters/changeFighterState";
import type { PixiEvent } from "@client/models/artist/pixiEvent";

const performEventSet = (args: {
  artist: Artist,
  eventSet: PixiEvent[]
}) => {
  const { artist, eventSet } = args;

  eventSet.forEach((pixiEvent) => {
    switch(pixiEvent.functionName) {
      case 'changeFighterState':
        const { targetsId, fighterState, fighterStateDefault } = pixiEvent.args;
        setTimeout(() => (
          changeFighterState({
            artist,
            fighterId: targetsId,
            nextState: fighterState,
            nextStateDefault: fighterStateDefault
          })
        ), pixiEvent.delay);
        break;
    }
  });
};

export default performEventSet;