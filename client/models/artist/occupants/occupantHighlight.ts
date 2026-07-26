import * as PIXI from 'pixi.js';

import type Artist from "../artist";
import Animation from "../animation";
import { genId } from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";
import { ANIMATION_SPEED } from '@common/constants';
import { ARTIST_Z_INDECES } from '@common/enums';

const TARGET_SPRITE_DURATION = 300;

const occupantHighlight = (artist: Artist, occupantId: string) => {
  artist.occupantsUnhighlightAny();
  artist.animations.push(new Animation({
    id: `occupant-highlight-${occupantId}`,
    type: ANIMATION_TYPES.PULSE_TINT,
    targets: occupantId,
    infinite: true
  }));

  const container = artist.pixiChildrenRef.current[occupantId];
  const firstChildOrContainer = container?.children[0] ?? container;
  if (!container || !firstChildOrContainer) return;
  const textures = ['spot_target0.png', 'spot_target1.png'].map((path) => PIXI.Texture.from(path));
  const targetSprite = new PIXI.AnimatedSprite(textures);
  targetSprite.animationSpeed = ANIMATION_SPEED * 1.5;
  targetSprite.zIndex = ARTIST_Z_INDECES.ANIMATED_SPRITE_EFFECTS;
  targetSprite.loop = false;
  targetSprite.position = {
    x: Math.round((firstChildOrContainer.width / 2) - (targetSprite.width / 2)),
    y: Math.round((firstChildOrContainer.height / 2) - (targetSprite.height / 2))
  };
  const targetSpriteId = genId();
  artist.pixiChildrenRef.current[targetSpriteId] = targetSprite;
  container.addChild(targetSprite);
  targetSprite.play()
  setTimeout(() => {
    container.removeChild(targetSprite);
    delete artist.pixiChildrenRef.current[targetSpriteId];
  }, TARGET_SPRITE_DURATION);
};

export default occupantHighlight;