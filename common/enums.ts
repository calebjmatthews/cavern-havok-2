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
  // BULWARK = "Bulwark",
  // BLUE_MAGE = "Blue Mage",
  // RED_MAGE = "Red Mage",

  // Monsters
  BUBBLE = "Bubble",
  BOULDER_MOLE = "Boulder Mole",
  FLYING_SNAKE = "Flying Snake",
  FLYING_SNAKE_BALL = "Flying Snake Ball",

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
  SCRAPPY_AX = "Scrappy Ax",

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

  // Flying Snake
  CURL_UP = "Curl Up",
  GLIDING_SLITHER = "Gliding Slither",
  HEADBONK = "Headbonk",
  VENOMOUS_FANGS = "Venomous Fangs",

  // Flying Snake Ball
  TIGHTEN_UP = "Tighten Up",
  SQUIRMING_HEADS = "Squirming Heads",
  WIGGLE_OUT = "Wiggle Out",

  DEBUG = "Debug",
  MISSING = "Equipment missing"
};

export enum ACTION_PRIORITIES {
  FIRST = "First",
  SECOND = "Second",
  PENULTIMATE = "Penultimate",
  LAST = "Last"
};

export enum MESSAGE_KINDS {
  MESSAGE_RECEIVED_BY_CLIENT = "Message received by client",
  MESSAGE_RECEIVED_BY_SERVER = "Message received by server",
  BATTLE_CONCLUSION = "Battle conclusion",
  CLIENT_CONNECT = "Client connect",
  SERVER_CONNECT = "Server connect",
  COMMAND_SEND = "Command send",
  COMMAND_ACCEPTED = "Command accepted",
  COMMANDS_UPDATED = "Commands updated",
  ROUND_START = "Round start",
  REQUEST_GUEST_ACCOUNT = "Request guest account",
  GRANT_GUEST_ACCOUNT = "Grant guest account",
  CLAIM_GUEST_ACCOUNT = "Claim guest account",
  CLAIMED_GUEST_ACCOUNT = "Claimed guest account",
  ROOM_CREATION_REQUEST = "Room creation request",
  ROOM_JOIN_REQUEST = "Room join request",
  ROOM_UPDATE = "Room update",
  ROOM_CLOSURE_REQUEST = "Room closure request",
  ROOM_CLOSED = "Room closed",
  ADVENTURE_REQUEST_NEW = "Adventure request new",
  CHAMBER_READY_FOR_NEW = "Chamber ready for new",
  TREASURE_SELECTED = "Treasure selected",
  TREASURE_APPLIED = "Treasure applied",
  FIGHTER_PLACEMENT = "Fighter placement",
  FIGHTER_PLACED = "Fighter placed",
  SCENE_START = "Encounter peaceful start",
  ADVENTURE_OVER = "Adventure over",
  KIND_MISSING = "Kind missing"
};

export enum ALTERATIONS {
  VENOM = "Venom",
  REGEN = "Regen",
  POWER = "Power",
  WEAKNESS = "Weakness",
  SHELL = "Shell",
  FRAGILE = "Fragile",
  QUICK = "Quick",
  SLOW = "Slow",

  FEROCITY = "Ferocity",
  TENACITY = "Tenacity",

  FLINT_HELMET = "Flint Helmet",
  FEATHER_CAP = "Feather Cap",

  // RED_PEPPER_TRUFFLES = "Red Pepper Truffles",
  // GINGERSNAP_COOKIES = "Gingersnap Cookies"
};

export enum OBSTACLE_KINDS {
  BOULDER = "Boulder",
  KIND_MISSING = "Kind missing"
};

export enum ADVENTURE_KINDS {
  PRISMATIC_FALLS = "Prismatic Falls",
  KIND_MISSING = "Kind missing"
};

export enum FOODS {
  CAYENNE_POT_PIE = "Cayenne Pot Pie",
  SPICY_LAYER_CAKE = "Spicy Layer Cake",
  RED_PEPPER_TRUFFLES = "Red Pepper Truffles",
  HEART_SHAPED_BUN = "Heart-Shaped Bun",
  LEMON_MERINGUE_TART = "Lemon Meringue Tart",
  GINGERSNAP_COOKIES = "Gingersnap Cookies"
};

export enum GLYPHS {
  VITALITY = "Vitality",
  ALACRITY = "Alacrity",
  FEROCITY = "Ferocity",
  TENACITY = "Tenacity"
};

export enum SPRITE_STATES {
  RESTING = "Resting",
  DOWNED = "Downed"
}