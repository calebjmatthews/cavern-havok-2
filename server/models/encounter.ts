import { v4 as uuid } from 'uuid';
import type Account from "@common/models/account";
import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import { ROUND_DURATION_DEFAULT } from "@common/constants";
import { BATTLE_STATUS } from "@common/enums";

export default class Encounter implements EncounterInterface {
  id: string = '';
  type: 'battle' = 'battle';
  getIntroText: (args: EncounterGetArgs) => string = () => '';
  victoryText: string = '';
  defeatText: string = '';
  battlefieldSize?: [number, number] = [5, 5];
  getFoes: (args: EncounterGetArgs) => { [key: string]: Fighter; } = () => ({});
  getObstacles: (args: EncounterGetArgs) => { [key: string]: Obstacle; } = () => ({});

  constructor(encounter: EncounterInterface) {
    Object.assign(this, encounter);
    if (!encounter.battlefieldSize) this.battlefieldSize = [5, 5];
  };

  toBattleArgs(args: EncounterGetArgs) {
    const { accounts, fighters } = args;

    const battleState: BattleState = {
      battleId: uuid(),
      size: [5, 5],
      round: 0,
      // terrain: 
      fighters: {},
      obstacles: {},
      creations: {},
      commandsPending: {},
      alterationsActive: {},
      texts: {
        introText: this.getIntroText(args),
        victoryText: this.victoryText,
        defeatText: this.defeatText
      }
    };
    
    const playerFighters: { [fighterId: string] : Fighter } = fighters ?? {};
    if (fighters) {
      Object.values(playerFighters).forEach((fighter, index) => {
        fighter.coords = [index, -1];
      });
    }
    else {
      Object.values(accounts).forEach((account, index) => {
        const playerFighter = account.character?.toFighter({
          name: account.name || '',
          ownedBy: account.id,
          controlledBy: account.id,
          side: 'A',
          coords: [index, -1]
        });
        if (playerFighter) playerFighters[playerFighter.id] = playerFighter;
      });
    };
    const foes = this.getFoes({ ...args, battleState });
    battleState.fighters = { ...playerFighters, ...foes };

    const obstacles = this.getObstacles({ ...args, battleState });
    battleState.obstacles = obstacles;
 
    return {
      id: battleState.battleId,
      chamberKind: args.chamberKind,
      chamberIndex: args.chamberIndex,
      status: BATTLE_STATUS.CLEAN,
      participants: accounts,
      roundDuration: ROUND_DURATION_DEFAULT,
      stateCurrent: battleState,
      stateInitial: battleState,
      commandsHistorical: []
    };
  };
};

interface EncounterInterface {
  id: string;
  type: 'battle';
  getIntroText: (args: EncounterGetArgs) => string;
  victoryText: string;
  defeatText: string;
  battlefieldSize?: [number, number];
  getFoes: (args: EncounterGetArgs) => { [key: string]: Fighter };
  getObstacles: (args: EncounterGetArgs) => { [key: string]: Obstacle };
};

interface EncounterGetArgs {
  chamberKind: string;
  chamberIndex: number;
  battleState: BattleState;
  difficulty: number;
  accounts: { [accountId: string] : Account };
  fighters?: { [fighterId: string] : Fighter };
};