import type CharacterClass from "@common/models/characterClass";
import raider from "./raider";
import bubble from "../monsters/bubble";
import boulderMole from "../monsters/boulder_mole";
import { CHARACTER_CLASSES } from "@common/enums";
const CHC = CHARACTER_CLASSES;

const characterClasses: { [characterClassName: string]: CharacterClass } = {
  [CHC.BUBBLE]: bubble,
  [CHC.RAIDER]: raider,
  [CHC.BOULDER_MOLE]: boulderMole
};

const getCharacterClass = (characterClassName: CHARACTER_CLASSES) => {
  const characterClass = characterClasses[characterClassName];
  if (!characterClass) throw Error(`getCharacterClasses error, ${characterClassName} not found.`);
  return characterClass;
};

export default getCharacterClass;