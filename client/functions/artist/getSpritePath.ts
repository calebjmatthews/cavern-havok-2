import random from "@common/functions/utils/random";
import { ADVENTURE_KINDS, CHEST_KINDS, PARTICLE_KINDS } from "@common/enums";

const spriteMap: { [key: string] : string | string[] } = {
  [CHEST_KINDS.WEAPONRY_CHEST]: 'chest-basic.png',
  [`${CHEST_KINDS.WEAPONRY_CHEST}-open`]: 'chest-basic-open.png',
  [CHEST_KINDS.ARMORERS_CHEST]: 'chest-armorers.png',
  [`${CHEST_KINDS.ARMORERS_CHEST}-open`]: 'chest-armorers-open.png',
  [CHEST_KINDS.COBBLERS_CHEST]: 'chest-cobblers.png',
  [`${CHEST_KINDS.COBBLERS_CHEST}-open`]: 'chest-cobblers-open.png',

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