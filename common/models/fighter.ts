import { CHARACTER_CLASSES } from "@common/enums";

export default class Fighter implements FighterInterface {
  id: string = '';
  name: string = '';
  ownedBy: string = '';
  class: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  healthStat: number = 10;
  speedStat: number = 3;
  charmStat: number = 3;
  equipment: string[] = [];
  controlledBy: string = '';
  side: 'A'|'B' = 'A';
  coords: [number, number] = [0, 0];
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
};

interface FighterInterface {
  id: string;
  name: string;
  ownedBy: string;
  class: CHARACTER_CLASSES;
  healthStat: number;
  speedStat: number;
  charmStat: number;
  equipment: string[];
  controlledBy: string;
  side: 'A'|'B';
  coords: [number, number];
  health: number;
  speed: number;
  charm: number;
};