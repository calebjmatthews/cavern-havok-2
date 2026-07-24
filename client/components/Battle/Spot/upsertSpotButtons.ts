import type Artist from "@client/models/artist/artist";
import type BattleState from "@common/models/battleState";
import pixiBoundsToDOMStyle from "@client/functions/artist/pixiBoundsToDOMStyle";

const upsertSpotButtons = (args: {
  battleState: BattleState,
  artist: Artist,
  spotClick: (spotId: string) => void
}) => {
  const { battleState, artist, spotClick } = args;
  const spotSelectButtonDiv = document.getElementById('spot-select-buttons');
  if (!spotSelectButtonDiv) return;
  artist.spotsBounds.forEach((spotBound) => {
    const domStyle = pixiBoundsToDOMStyle(spotBound, artist);
    const spotElement = document.getElementById(spotBound.id);
    let spotButton: HTMLButtonElement | null = (
      spotElement instanceof HTMLButtonElement ? spotElement : null
    );

    if (spotButton) {
      spotButton.style = domStyle;
    }
    else {
      spotButton = document.createElement('button');
      spotButton.id = spotBound.id;
      spotButton.type = 'button';
      spotButton.style = domStyle;
      spotButton.className = 'spot-select-button';
      spotButton.addEventListener('click', () => spotClick(spotBound.id));
    };
    
    const spotIdSplit = spotBound.id.split('|').map((n) => parseInt(n ?? ''));
    const coords = [spotIdSplit[1], spotIdSplit[2]];
    const fighter = Object.values(battleState.fighters ?? {}).filter((fighter) => (
      fighter.coords[0] === coords[0] && fighter.coords[1] === coords[1]
    ))?.[0];
    if (!fighter) {
      spotButton.disabled = true;
    }
    else {
      spotButton.disabled = false;
    }
    spotSelectButtonDiv.appendChild(spotButton);
  });
};

export default upsertSpotButtons;