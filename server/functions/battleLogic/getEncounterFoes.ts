import type BattleState from "@common/models/battleState";
import Fighter from "@common/models/fighter";
import getCharacterClass from "@common/instances/character_classes";
import randomFrom from "@common/functions/utils/randomFrom";
import randomFromBag from "@common/functions/utils/randomFromBag";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import cloneBattleState from "@common/functions/cloneBattleState";
import range from "@common/functions/utils/range";
import { genId } from "@common/functions/utils/random";
import { FIGHTER_CONTROL_AUTO } from "@common/constants";

const getEncounterFoes = (args: {
  battleState: BattleState,
  characterClasses: string[],
  quantity: number,
  foes?: { [fighterId: string] : Fighter }
}) => {
  const { battleState: battleStateArgs, characterClasses, quantity, foes: foesArgs } = args;
  const battleState = cloneBattleState(battleStateArgs);
  const foes: { [fighterId: string] : Fighter } = foesArgs ?? {};

  range(0, (quantity - 1)).forEach(() => {
    const characterClass = characterClasses.length > 1
      ? randomFromBag(characterClasses)
      : characterClasses[0];
    if (!characterClass) throw Error(`Missing character class name in getEncounterFoes.`);
    const existingOfClassCount = Object.values(battleState.fighters)
    .filter((f) => f.characterClass === characterClass).length;
    const foe = getCharacterClass(characterClass).toFighter({
      id: genId(),
      name: `${characterClass} ${existingOfClassCount + 1}`,
      ownedBy: FIGHTER_CONTROL_AUTO,
      controlledBy: FIGHTER_CONTROL_AUTO,
      side: "B",
      coords: randomFrom(getCoordsOnSide({ battleState, side: "B", onlyOpenSpaces: true }))
    });
    foes[foe.id] = foe;
    battleState.fighters[foe.id] = foe;
  });
  
  return foes;
};

export default getEncounterFoes;