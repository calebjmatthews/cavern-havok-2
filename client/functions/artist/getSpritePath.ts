import random from "@common/functions/utils/random";
import { ADVENTURE_KINDS, CHEST_KINDS } from "@common/enums";
import { PARTICLE_KINDS, SPRITE_NAMES } from "@client/enums";

const spriteMap: { [key: string] : string | string[] } = {
  [CHEST_KINDS.WEAPONRY_CHEST]: 'chest-basic.png',
  [`${CHEST_KINDS.WEAPONRY_CHEST}-open`]: 'chest-basic-open.png',
  [CHEST_KINDS.ARMORERS_CHEST]: 'chest-armorers.png',
  [`${CHEST_KINDS.ARMORERS_CHEST}-open`]: 'chest-armorers-open.png',
  [CHEST_KINDS.COBBLERS_CHEST]: 'chest-cobblers.png',
  [`${CHEST_KINDS.COBBLERS_CHEST}-open`]: 'chest-cobblers-open.png',

  [SPRITE_NAMES.SBR_RESTING]: 'sbr_resting0.png',
  [SPRITE_NAMES.SBR_WALKING_0]: 'sbr_walking0.png',
  [SPRITE_NAMES.SBR_WALKING_1]: 'sbr_walking1.png',
  [SPRITE_NAMES.SBR_SWINGING_0]: 'sbr_attacking0.png',
  [SPRITE_NAMES.SBR_SWINGING_1]: 'sbr_attacking1.png',
  [SPRITE_NAMES.SBR_SWINGING_2]: 'sbr_attacking2.png',
  [SPRITE_NAMES.SBR_CHEERING]: 'sbr_boon.png',
  [SPRITE_NAMES.SBR_CASTING]: 'sbr_casting0.png',
  [SPRITE_NAMES.SBR_CRITICAL]: 'sbr_critical.png',
  [SPRITE_NAMES.SBR_DAMAGED]: 'sbr_damaged.png',
  [SPRITE_NAMES.SBR_CLENCHING]: 'sbr_guard.png',
  [SPRITE_NAMES.FACE_RESTING]: 'face_resting.png',
  [SPRITE_NAMES.FACE_CASTING_0]: 'face_casting0.png',
  [SPRITE_NAMES.FACE_CASTING_1]: 'face_casting1.png',
  [SPRITE_NAMES.FACE_CLOSED]: 'face_closed.png',
  [SPRITE_NAMES.FACE_CRITICAL]: 'face_critical.png',
  [SPRITE_NAMES.FACE_DAMAGED]: 'face_damaged.png',
  [SPRITE_NAMES.FACE_DOWNED]: 'face_down.png',

  [PARTICLE_KINDS.CINDER_TREASURE]: [
    'cinder_one.png', 'cinder_two.png', 'cinder_three.png', 'cinder_four.png'
  ],

  [ADVENTURE_KINDS.PRISMATIC_FALLS]: 'background_cave.png'
};

const getSpritePath = (key: string) => {
  const value = spriteMap[key];
  if (!value) return 'unknown.png';

  if (Array.isArray(value)) {
    return value[Math.floor(random() * value.length)] ?? 'unknown.png';
  };

  return value;
};

export default getSpritePath;