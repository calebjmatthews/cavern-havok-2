import { ADVENTURE_KINDS, CHEST_KINDS } from "@common/enums";

const spriteMap: { [key: string] : string } = {
  [CHEST_KINDS.WEAPONRY_CHEST]: 'chest-basic.png',
  [`${CHEST_KINDS.WEAPONRY_CHEST}-open`]: 'chest-basic-open.png',
  [CHEST_KINDS.ARMORERS_CHEST]: 'chest-armorers.png',
  [`${CHEST_KINDS.ARMORERS_CHEST}-open`]: 'chest-armorers-open.png',
  [CHEST_KINDS.COBBLERS_CHEST]: 'chest-cobblers.png',
  [`${CHEST_KINDS.COBBLERS_CHEST}-open`]: 'chest-cobblers-open.png',

  [ADVENTURE_KINDS.PRISMATIC_FALLS]: 'background_cave.png'
};

const getSpritePath = (key: string) => (
  spriteMap[key] ?? 'unknown.png'
);

export default getSpritePath;