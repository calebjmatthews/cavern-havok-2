import type CharacterClass from "@common/models/characterClass";
import raider from "./raider";
import javalin from "./javalin";
import bubble from "../monsters/bubble";
import boulderMole from "../monsters/boulder_mole";
import { CHARACTER_CLASSES } from "@common/enums";
const CHC = CHARACTER_CLASSES;

export const characterClasses: { [characterClassName: string]: CharacterClass } = {
  [CHC.RAIDER]: raider,
  [CHC.JAVALIN]: javalin,

  [CHC.BUBBLE]: bubble,
  [CHC.BOULDER_MOLE]: boulderMole
};

const getCharacterClass = (characterClassName: CHARACTER_CLASSES) => {
  const characterClass = characterClasses[characterClassName];
  if (!characterClass) throw Error(`getCharacterClasses error, ${characterClassName} not found.`);
  return characterClass;
};

export default getCharacterClass;