import { v4 as uuid } from 'uuid';

import Fighter from "../common/models/fighter";
import type BattleState from '../common/models/battleState';
import getCharacterClass from '@common/instances/character_classes';
import { BATTLE_STATUS, CHARACTER_CLASSES } from '@common/enums';
import { FIGHTER_CONTROL_AUTO } from '@common/constants';
const CHC = CHARACTER_CLASSES;

const getSandboxBattleArgs = (accountId: string) => {
  const player = getCharacterClass(CHC.JAVALIN).toFighter({
    id: uuid(),
    name: "Carbo",
    ownedBy: accountId,
    controlledBy: accountId,
    side: 'A',
    coords: [0, 2],
  });

  const monster1 = getCharacterClass(CHC.BUBBLE).toFighter({
    id: uuid(),
    name: "Bubble 1",
    ownedBy: FIGHTER_CONTROL_AUTO,
    controlledBy: FIGHTER_CONTROL_AUTO,
    side: 'B',
    coords: [6, 0],
  });
  const monster2 = new Fighter({ ...monster1, name: "Bubble 2", id: uuid(), coords: [5, 2] });
  const monster3 = new Fighter({ ...monster1, name: "Bubble 3", id: uuid(), coords: [8, 4] });

  //   const monster1 = getCharacterClass(CHC.BOULDER_MOLE).toFighter({
  //   id: uuid(),
  //   name: "Mole 1",
  //   ownedBy: FIGHTER_CONTROL_AUTO,
  //   controlledBy: FIGHTER_CONTROL_AUTO,
  //   side: 'B',
  //   coords: [6, 0],
  // });
  // const monster2 = new Fighter({ ...monster1, name: "Mole 2", id: uuid(), coords: [5, 2] });
  // const monster3 = new Fighter({ ...monster1, name: "Mole 3", id: uuid(), coords: [8, 4] });

  const battleId = uuid();
  const battleStateInitial: BattleState = {
    battleId,
    size: [5, 5],
    round: 0,
    // terrain: 
    fighters: {
      [player.id]: player,
      [monster1.id]: monster1,
      [monster2.id]: monster2,
      [monster3.id]: monster3
    },
    obstacles: {},
    creations: {},
    commandsPending: {},
    alterationsActive: {}
  };
  
  return {
    id: battleId,
    status: BATTLE_STATUS.CLEAN,
    roundDuration: 1000000,
    stateCurrent: battleStateInitial,
    stateInitial: battleStateInitial,
    commandsHistorical: []
  };
};

export default getSandboxBattleArgs;