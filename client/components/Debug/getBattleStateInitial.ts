
import type BattleState from "@common/models/battleState";
import { characterClasses } from "@common/instances/character_classes";
import { battleStateEmpty } from "@common/models/battleState";
import { CHARACTER_CLASSES } from "@common/enums";

const getBattleStateInitial = (): BattleState => {
  const raiderClass = characterClasses[CHARACTER_CLASSES.RAIDER];
  const javalinClass = characterClasses[CHARACTER_CLASSES.JAVALIN];
  const boulderMoleClass = characterClasses[CHARACTER_CLASSES.BOULDER_MOLE];
  if (!raiderClass || !javalinClass || !boulderMoleClass) {
    throw Error('Classes missing in getBattleStateInitial.');
  };

  return {
    ...battleStateEmpty,
    fighters: {
      ['test']: javalinClass.toFighter({
        id: 'test',
        name: 'Test',
        ownedBy: 'testUser',
        controlledBy: 'testUser',
        side: 'A',
        coords: [3, 2]
      }),
      ['foe']: boulderMoleClass.toFighter({
        id: 'foe',
        name: 'Test',
        ownedBy: 'testUser',
        controlledBy: 'testUser',
        side: 'B',
        coords: [6, 2]
      }),
    }
  };
};

export default getBattleStateInitial;