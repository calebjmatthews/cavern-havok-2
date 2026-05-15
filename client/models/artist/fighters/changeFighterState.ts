import readyCycleLayers from "@client/functions/artist/readyCycleLayers";
import type Artist from "../artist";

export interface ChangeFighterStateArgs {
  artist?: Artist,
  fighterId: string,
  nextState: string,
  changeDefault?: boolean
};

const changeFighterState = (args: ChangeFighterStateArgs) => {
  const { artist, fighterId, nextState, changeDefault } = args;
  if (!artist) return;
  const pixiChildren = artist.pixiChildrenRef.current;

  const container = pixiChildren[fighterId];
  const layeredAnimated = artist.layeredAnimateds[fighterId];
  if (!container || !layeredAnimated) return;

  console.log(`container`, container);
  console.log(`layeredAnimated`, layeredAnimated);
  console.log(`pixiChildren`, pixiChildren);

  layeredAnimated.state = nextState;
  if (changeDefault) layeredAnimated.stateDefault = nextState;
  readyCycleLayers({ artist, fighterId, layeredAnimated, pixiChildren, nextState });
};

export default changeFighterState;