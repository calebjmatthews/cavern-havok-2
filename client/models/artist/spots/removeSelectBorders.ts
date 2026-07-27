import Artist from '../artist';

const removeSelectBorders = (artist: Artist) => {
  const pixiChildren = artist.pixiChildrenRef.current;
  console.log(`pixiChildren`, pixiChildren);
  Object.entries(pixiChildren).forEach(([id, sprite]) => {
    if (id.includes('-spot-select')) {
      const spotId = id.replace('-spot-select', '');
      const spotContainer = pixiChildren[spotId];
      if (!spotContainer) return;
      spotContainer.removeChild(sprite);
      delete pixiChildren[id];
      artist.animations = artist.animations.filter((a) => a.targets !== id);
    };
  });
};

export default removeSelectBorders;