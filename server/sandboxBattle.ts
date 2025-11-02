import { v4 as uuid } from 'uuid';

import Fighter from "../common/models/fighter";
import type BattleState from '../common/models/battleState';
import getCharacterClass from '@common/instances/character_classes';
import { BATTLE_STATUS, CHARACTER_CLASSES } from '@common/enums';
import { FIGHTER_CONTROL_AUTO } from '@common/constants';
const CHC = CHARACTER_CLASSES;

const getSandboxBattleArgs = (accountId: string) => {
  const raider = getCharacterClass(CHC.RAIDER).toFighter({
    id: uuid(),
    name: "Raids",
    ownedBy: accountId,
    controlledBy: accountId,
    side: 'A',
    coords: [4, 2],
  });

  const bubble1 = getCharacterClass(CHC.BUBBLE).toFighter({
    id: uuid(),
    name: "Bubble 1",
    ownedBy: FIGHTER_CONTROL_AUTO,
    controlledBy: FIGHTER_CONTROL_AUTO,
    side: 'B',
    coords: [6, 0],
  });
  const bubble2 = new Fighter({ ...bubble1, name: "Bubble 2", id: uuid(), coords: [5, 2] });
  const bubble3 = new Fighter({ ...bubble1, name: "Bubble 3", id: uuid(), coords: [8, 4] });

  const battleId = uuid();
  const battleStateInitial: BattleState = {
    battleId,
    size: [5, 5],
    round: 0,
    // terrain: 
    fighters: {
      [raider.id]: raider,
      [bubble1.id]: bubble1,
      [bubble2.id]: bubble2,
      [bubble3.id]: bubble3
    },
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