import Artist from '../artist';

const removeSelectBorders = (artist: Artist) => {
  const pixiContainers = artist.pixiContainersRef.current;
  Object.entries(pixiContainers).forEach(([id, sprite]) => {
    if (id.includes('-spot-select')) {
      const spotId = id.replace('-spot-select', '');
      const spotContainer = pixiContainers[spotId];
      if (!spotContainer) return;
      spotContainer.removeChild(sprite);
      delete pixiContainers[id];
      artist.animations = artist.animations.filter((a) => a.targets !== id);
    };
  });
};

export default removeSelectBorders;