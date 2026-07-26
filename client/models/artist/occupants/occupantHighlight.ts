import type Artist from "../artist";
import Animation from "../animation";
import { ANIMATION_TYPES } from "@client/enums";

const occupantHighlight = (artist: Artist, occupantId: string) => {
  artist.occupantsUnhighlightAny();
  artist.animations.push(new Animation({
    id: `occupant-highlight-${occupantId}`,
    type: ANIMATION_TYPES.PULSE_TINT,
    targets: occupantId,
    infinite: true
  }));
};

export default occupantHighlight;