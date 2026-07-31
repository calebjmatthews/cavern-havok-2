
import type BattleState from "@common/models/battleState";
import { characterClasses } from "@common/instances/character_classes";
import { battleStateEmpty } from "@common/models/battleState";
import { obstacleKinds } from "@common/instances/obstacle_kinds";
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";

const getBattleStateInitial = (): BattleState => {
  const raiderClass = characterClasses[CHARACTER_CLASSES.RAIDER];
  const javalinClass = characterClasses[CHARACTER_CLASSES.JAVALIN];
  const blueMageClass = characterClasses[CHARACTER_CLASSES.BLUE_MAGE];
  const boulderMoleClass = characterClasses[CHARACTER_CLASSES.BOULDER_MOLE];
  const boulderObstacleKind = obstacleKinds[OBSTACLE_KINDS.BOULDER];
  if (!raiderClass || !javalinClass || !blueMageClass || !boulderMoleClass || !boulderObstacleKind) {
    throw Error('Classes missing in getBattleStateInitial.');
  };

  return {
    ...battleStateEmpty,
    fighters: {
      ['test']: blueMageClass.toFighter({
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
    },
    obstacles: {
      ['boulder']: boulderObstacleKind.makeObstacle({
        id: 'boulder',
        name: 'boulder',
        createdBy: 'testUser',
        side: 'B',
        coords: [6, 4]
      })
    }
  }
};

export default getBattleStateInitial;