import Encounter from "@server/models/encounter";
import type Fighter from "@common/models/fighter";
import cloneBattleState from "@common/functions/cloneBattleState";
import getEncounterObstacles from "@server/functions/battleLogic/getEncounterObstacles";
import getCharacterClass from "@common/instances/character_classes";
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";
import { ENCOUNTERS } from "@server/enums";
import { FIGHTER_CONTROL_AUTO } from "@common/constants";
import getEncounterFoes from "@server/functions/battleLogic/getEncounterFoes";
const CHC = CHARACTER_CLASSES;
const OBK = OBSTACLE_KINDS;

const flyingSnakeBall = new Encounter({
  id: ENCOUNTERS.FLYING_SNAKE_BALL,
  type: 'battle',
  getIntroText: (() => `A writhing ball of flying snakes hovers and bobs ahead of you. How indecent.`),
  victoryText: `The flying snakes disentangle and flap away into the distance.`,
  defeatText: `You've been bitten, headbonked, and submitted to sights no one should have to see. That's enough.`,
  battlefieldSize: [5, 5],
  getFoes: ((args) => {
    const { battleState: battleStateArgs } = args;
    const battleState = cloneBattleState(battleStateArgs);
    let foes: { [fighterId: string] : Fighter } = {};
    const flyingSnakeBall = getCharacterClass(CHC.FLYING_SNAKE_BALL).toFighter({
      ownedBy: FIGHTER_CONTROL_AUTO,
      controlledBy: FIGHTER_CONTROL_AUTO,
      side: 'B',
      coords: [7, 2]
    });
    foes[flyingSnakeBall.id] = flyingSnakeBall;
    battleState.fighters = foes;
      
    return { ...foes, ...getEncounterFoes({
      ...args,
      battleState,
      characterClasses: [CHC.FLYING_SNAKE],
      quantity: (Object.keys(args.accounts).length + Math.floor(args.difficulty * 1.5))
    }) };
  }),
  getObstacles: ((args) => getEncounterObstacles({
    ...args,
    obstacleKinds: [OBK.BOULDER],
    quantityA: 1,
    quantityB: 0
  }))
});

export default flyingSnakeBall;