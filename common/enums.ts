export enum BATTLE_STATUS{
  CLEAN = "Clean",
  INITIALIZING = "Initializing",
  ROUND_START = "Round start",
  WAITING_FOR_COMMANDS = "Waiting for commands",
  ROUND_END = "Round end",
  CONCLUSION = "Conclusion"
}

export enum CHARACTER_CLASSES {
  // Playable
  RAIDER = "Raider",
  BULWARK = "Bulwark",
  BLUE_MAGE = "Blue Mage",
  RED_MAGE = "Red Mage",

  // Monsters
  BUBBLE = "Bubble",
  BOULDER_MOLE = "Boulder Mole",

  MISSING = "Missing"
};

export enum EQUIPMENT_SLOTS {
  HEAD = "Head",
  TOP = "Top",
  BOTTOM = "Bottom",
  MAIN = "Main"
};

export enum EQUIPMENTS {
  // Raider
  FLINT_HEMLET = "Flint Helmet",
  FLINT_SHOULDERGUARDS = "Flint Shoulderguards",
  FLINT_BOOTS = "Flint Boots",
  HATCHET = "Hatchet",
  SWEEP_AX = "Sweep Ax",
  CLEAVING_AX = "Cleaving Ax",

  // Bubble
  WOBBLY_MEMBRANE = "Wobbly Membrane",
  DRIFTING_ON_THE_BREEZE = "Drifting on the Breeze",
  FOAMY_DASH = "Foamy Dash",
  GOODBYE = "Goodbye!",

  // Boulder Mole
  ROCKY_HIDE = "Rocky Hide",
  SCRABBLING_LEGS = "Scrabbling Legs",
  RUBBLE_TOSS = "Rubble Toss",
  STONY_DEFENSE = "Stony Defense",
  BOULDER_DROP = "Boulder Drop",

  MISSING = "Equipment missing"
};

export enum ACTION_PRIORITIES {
  FIRST = "First",
  SECOND = "Second",
  LAST = "Last"
};

export enum MESSAGE_KINDS {
  BATTLE_CONCLUSION = "Battle conclusion",
  CLIENT_CONNECT = "Client connect",
  COMMAND_ACCEPTED = "Command accepted",
  COMMAND_SEND = "Command send",
  MESSAGE_RECEIVED_BY_CLIENT = "Message received by client",
  MESSAGE_RECEIVED_BY_SERVER = "Message received by server",
  ROUND_START = "Round start",
  REQUEST_GUEST_ACCOUNT = "Request guest account",
  GRANT_GUEST_ACCOUNT = "Grant guest account",
  REQUEST_NEW_BATTLE = "Request new battle",
  KIND_MISSING = "Kind missing"
};

export enum ALTERATIONS {
  FLINT_HELMET = "Flint Helmet"
};