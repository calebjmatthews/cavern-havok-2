import readyCycleLayers from "@client/functions/artist/readyCycleLayers";
import type Artist from "../artist";

export interface ChangeFighterStateArgs {
  artist?: Artist,
  fighterId: string,
  nextState: string,
  nextStateDefault?: string
};

const changeFighterState = (args: ChangeFighterStateArgs) => {
  const { artist, fighterId, nextState, nextStateDefault } = args;
  if (!artist) throw Error("Missing artist in changeFighterState");
  const pixiChildren = artist.pixiChildrenRef.current;

  const container = pixiChildren[fighterId];
  const layeredAnimated = artist.layeredAnimateds[fighterId];
  if (!container || !layeredAnimated) return;

  const cycleLayerPrimary = layeredAnimated.cycleLayers
  .filter((cycleLayer) => cycleLayer.isPrimary)?.[0];
  if (!cycleLayerPrimary?.layers?.[nextState]) return;

  layeredAnimated.state = nextState;
  if (nextStateDefault) layeredAnimated.stateDefault = nextStateDefault;
  readyCycleLayers({ artist, fighterId, layeredAnimated, pixiChildren, nextState });
};

export default changeFighterState;