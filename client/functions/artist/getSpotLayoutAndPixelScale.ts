import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import range from "@common/functions/utils/range";

const terrainSize = { width: 27, height: 21 };
const spotBuffer = 2;
const sideBuffer = 10;
const minBorder = 10;

const getSpotLayoutAndPixelScale = (args: {
  battleState: BattleState,
  artist: Artist
}) => {
  const { battleState, artist } = args;

  const contentUnscaled = ((battleState.size[1] * 2 * (terrainSize.width + spotBuffer)));
  const buffersUnscaled =  + sideBuffer + (minBorder * 2);
  const contentMinUnscaled = contentUnscaled + buffersUnscaled;
  const heightUnscaled = ((battleState.size[0] * (terrainSize.height + spotBuffer)));
  const heightMinUnscaled = heightUnscaled + buffersUnscaled;
  const scaleRaw = Math.min(
    (artist.windowSize[0] / contentMinUnscaled),
    ((artist.windowSize[1] * 0.667) / heightMinUnscaled)
  );
  const zoomOut = (scaleRaw % 1 >= 0.5);
  const scale = Math.floor(scaleRaw) + (zoomOut ? 1 : 0);

  const margin = Math.round(((artist.windowSize[0] - (contentUnscaled * scale)) / 2));

  const unusedVertical = (
    artist.windowSize[1]
    - ((terrainSize.height + spotBuffer) * battleState.size[0] * scale)
  );
  const marginTop = Math.round(unusedVertical / 4);

  const spots = range(0, (battleState.size[0] - 1)).flatMap((row) => (
    range(0, ((battleState.size[1] * 2) - 1)).flatMap((col) => ({
      coords: [col, row],
      position: {
        x: (
          margin + (col >= battleState.size[1] ? sideBuffer : 0)
          + ((terrainSize.width + spotBuffer) * scale) * col
        ),
        y: (marginTop + ((terrainSize.height + spotBuffer) * scale) * row)
      }
    }))
  ));

  return { scale, zoomOut, spots };
};

export default getSpotLayoutAndPixelScale;