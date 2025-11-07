export enum BATTLE_STATUS{
  CLEAN = "Clean",
  INITIALIZING = "Initializing",
  FIGHTER_PLACEMENT = "Fighter placement",
  ROUND_START = "Round start",
  WAITING_FOR_COMMANDS = "Waiting for commands",
  ROUND_END = "Round end",
  CONCLUSION = "Conclusion"
}

export enum CHARACTER_CLASSES {
  // Playable
  RAIDER = "Raider",
  JAVALIN = "Javalin",
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

export enum AIS {
  DEFAULT = "Default",
  BUBBLE = "Bubble"
};

export enum EQUIPMENTS {
  // Raider
  FLINT_HEMLET = "Flint Helmet",
  FLINT_SHOULDERGUARDS = "Flint Shoulderguards",
  FLINT_BOOTS = "Flint Boots",
  HATCHET = "Hatchet",
  SWEEP_AX = "Sweep Ax",
  CLEAVING_AX = "Cleaving Ax",

  // Javalin
  FEATHER_CAP = "Feather Cap",
  DOWN_VEST = "Down Vest",
  TUFTED_SANDALS = "Tufted Sandals",
  SWALLOW = "Swallow",
  BLACKBIRD = "Blackbird",
  HERON = "Heron",

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
  PENULTIMATE = "Penultimate",
  LAST = "Last"
};

export enum MESSAGE_KINDS {
  BATTLE_CONCLUSION = "Battle conclusion",
  CLIENT_CONNECT = "Client connect",
  SERVER_CONNECT = "Server connect",
  COMMAND_ACCEPTED = "Command accepted",
  COMMAND_SEND = "Command send",
  MESSAGE_RECEIVED_BY_CLIENT = "Message received by client",
  MESSAGE_RECEIVED_BY_SERVER = "Message received by server",
  ROUND_START = "Round start",
  REQUEST_GUEST_ACCOUNT = "Request guest account",
  GRANT_GUEST_ACCOUNT = "Grant guest account",
  CLAIM_GUEST_ACCOUNT = "Claim guest account",
  CLAIMED_GUEST_ACCOUNT = "Claimed guest account",
  ROOM_CREATION_REQUEST = "Room creation request",
  ROOM_JOIN_REQUEST = "Room join request",
  ROOM_JOINED = "Room joined",
  REQUEST_NEW_BATTLE = "Request new battle",
  FIGHTER_PLACEMENT = "Fighter placement",
  FIGHTER_PLACED = "Fighter placed",
  KIND_MISSING = "Kind missing"
};

export enum ALTERATIONS {
  FLINT_HELMET = "Flint Helmet",
  FEATHER_CAP = "Feather Cap"
};

export enum OBSTACLE_KINDS {
  BOULDER = "Boulder",
  KIND_MISSING = "Kind missing"
};