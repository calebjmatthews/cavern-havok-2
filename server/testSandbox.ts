import { v4 as uuid } from 'uuid';

import Fighter from "../common/models/fighter";
import Battle from './models/battle';
import type BattleState from '../common/models/battleState';
import getCharacterClass from '@common/instances/character_classes';
import { BATTLE_STATUS, CHARACTER_CLASSES } from '@common/enums';
import { FIGHTER_CONTROL_AUTO, ROUND_DURATION_DEFAULT } from '@common/constants';
const CHC = CHARACTER_CLASSES;

const testSandbox = () => {
  const raider = getCharacterClass(CHC.RAIDER).toFighter({
    id: uuid(),
    name: "Raids",
    ownedBy: FIGHTER_CONTROL_AUTO,
    controlledBy: FIGHTER_CONTROL_AUTO,
    side: 'A',
    coords: [4, 2],
  });

  const bubble1 = getCharacterClass(CHC.BUBBLE).toFighter({
    id: uuid(),
    name: "Bubble",
    ownedBy: FIGHTER_CONTROL_AUTO,
    controlledBy: FIGHTER_CONTROL_AUTO,
    side: 'B',
    coords: [6, 0],
  });
  const bubble2 = new Fighter({ ...bubble1, id: uuid(), coords: [5, 2] });
  const bubble3 = new Fighter({ ...bubble1, id: uuid(), coords: [8, 4] });

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
    commandsPending: {}
  };
  const battle = new Battle({
    id: battleId,
    status: BATTLE_STATUS.CLEAN,
    roundDuration: ROUND_DURATION_DEFAULT,
    stateCurrent: battleStateInitial,
    stateInitial: battleStateInitial,
    commandsHistorical: []
  });
  
  battle.shiftStatus(BATTLE_STATUS.INITIALIZING);
  console.log(`battle.stateCurrent.commandsPending`, battle.stateCurrent.commandsPending);
};

export default testSandbox;