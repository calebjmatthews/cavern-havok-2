import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import range from "@common/functions/utils/range";

const terrainSize = { width: 27, height: 21 };
const spotBuffer = 2;
const minBorder = 10;

const getSpotLayout = (args: {
  battleState: BattleState,
  artist: Artist
}) => {
  const { battleState, artist } = args;

  const contentMinUnscaled = (
    battleState.size[1] * 2 * (terrainSize.width + spotBuffer) + (minBorder * 2.5)
  );
  const scale = Math.floor(artist.windowSize[0] / contentMinUnscaled);

  const border = Math.round((artist.windowSize[0] - (contentMinUnscaled * scale)) / 2.5);

  const spots = range(0, ((battleState.size[1] * 2) - 1)).flatMap((col) => (
    range(0, (battleState.size[0] - 1)).map((row) => ({
      coords: [col, row],
      position: {
        x: (
          border + (col >= battleState.size[1] ? (border * 0.5) : 0)
          + ((terrainSize.width + spotBuffer) * scale) * col
        ) / scale,
        y: (minBorder + ((terrainSize.height + spotBuffer) * scale) * row) / scale
      }
    }))
  ));

  return { scale, spots };
};

export default getSpotLayout;