import { v4 as uuid } from 'uuid';

import type Obstacle from '@common/models/obstacle';
import Fighter from "@common/models/fighter";
import Encounter from "@server/models/encounter";
import getCharacterClass from "@common/instances/character_classes";
import randomFrom from "@common/functions/utils/randomFrom";
import getCoordsOnSide from '@common/functions/positioning/getCoordsOnSide';
import cloneBattleState from '@common/functions/cloneBattleState';
import getObstacleKind from '@common/instances/obstacle_kinds';
import range from '@common/functions/utils/range';
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";
import { ENCOUNTERS } from "@server/enums";
import { FIGHTER_CONTROL_AUTO } from "@common/constants";
const CHC = CHARACTER_CLASSES;
const OBK = OBSTACLE_KINDS;

const bubbles = new Encounter({
  id: ENCOUNTERS.BUBBLES,
  getIntroText: (() => 'Some bubbles float menacingly in your direction.'),
  victoryText: 'The bubbles float away in dejected defeat.',
  defeatText: `You've been defeated by the Bubbles' frothy might.`,
  battlefieldSize: [5, 5],
  getFoes: ((args) => {
    const battleState = cloneBattleState(args.battleState);
    const foes: { [fighterId: string] : Fighter } = {}

    const bubble = getCharacterClass(CHC.BUBBLE).toFighter({
      id: uuid(),
      name: "Bubble 1",
      ownedBy: FIGHTER_CONTROL_AUTO,
      controlledBy: FIGHTER_CONTROL_AUTO,
      side: 'B',
      coords: randomFrom(getCoordsOnSide({ battleState, side: "B", onlyOpenSpaces: true }))
    });
    foes[bubble.id] = bubble;
    battleState.fighters[bubble.id] = bubble;

    range(1, (Object.keys(args.accounts).length + 1)).forEach((index) => {
      const bubbleNext = new Fighter({
        ...bubble,
        id: uuid(),
        name: `Bubble ${index+1}`,
        coords: randomFrom(getCoordsOnSide({ battleState, side: "B", onlyOpenSpaces: true }))
      });
      foes[bubbleNext.id] = bubbleNext;
      battleState.fighters[bubbleNext.id] = bubbleNext;
    });

    return foes;
  }),
  getObstacles: ((args) => {
    const battleState = cloneBattleState(args.battleState);
    const obstacles: { [obstacleId: string] : Obstacle } = {};

    const sideABoulder = getObstacleKind(OBK.BOULDER).makeObstacle({
      name: "Boulder 1",
      createdBy: FIGHTER_CONTROL_AUTO,
      side: "A",
      coords: randomFrom(getCoordsOnSide({ battleState, side: "A", onlyOpenSpaces: true }))
    });
    battleState.obstacles[sideABoulder.id] = sideABoulder;
    obstacles[sideABoulder.id] = sideABoulder;

    const sideBBoulder = getObstacleKind(OBK.BOULDER).makeObstacle({
      name: "Boulder 2",
      createdBy: FIGHTER_CONTROL_AUTO,
      side: "B",
      coords: randomFrom(getCoordsOnSide({ battleState, side: "B", onlyOpenSpaces: true }))
    });
    battleState.obstacles[sideBBoulder.id] = sideBBoulder;
    obstacles[sideBBoulder.id] = sideBBoulder;

    return obstacles;
  })
});

export default bubbles;