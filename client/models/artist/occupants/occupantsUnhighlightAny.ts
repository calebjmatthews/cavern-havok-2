import type Artist from "../artist";

const occupantsUnhighlightAny = (artist: Artist) => {
  const existingHighlighted = artist.animations.find((animation) => (
    animation.id.includes('occupant-highlight-')
  ));
  if (!existingHighlighted) return;

  artist.animations = artist.animations.filter((a) => a.id !== existingHighlighted.id);

  const occupantId = existingHighlighted.id.replace('occupant-highlight-', '');
  const container = artist.pixiChildrenRef.current[occupantId];
  if (container) container.tint = 0xffffff;
};

export default occupantsUnhighlightAny;