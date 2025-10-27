import type CharacterClass from "@common/models/characterClass";
import bubble from "./bubble";
import raider from "./raider";
import { CHARACTER_CLASSES } from "@common/enums";
const CHC = CHARACTER_CLASSES;

const characterClasses: { [characterClassName: string]: CharacterClass } = {
  [CHC.BUBBLE]: bubble,
  [CHC.RAIDER]: raider
};

const getCharacterClass = (characterClassName: CHARACTER_CLASSES) => {
  const characterClass = characterClasses[characterClassName];
  if (!characterClass) throw Error(`getCharacterClasses error, ${characterClassName} not found.`);
  return characterClass;
};

export default getCharacterClass;