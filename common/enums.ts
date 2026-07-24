export enum BATTLE_STATUS{
  CLEAN = "Clean",
  INITIALIZING = "Initializing",
  FIGHTER_PLACEMENT = "Fighter placement",
  ROUND_START = "Round start",
  WAITING_FOR_COMMANDS = "Waiting for commands",
  ROUND_END = "Round end",
  CONCLUSION = "Conclusion"
};

export enum CHARACTER_CLASSES {
  // Playable
  RAIDER = "Raider",
  JAVALIN = "Javalin",
  // BULWARK = "Bulwark",
  // BLUE_MAGE = "Blue Mage",
  // ORANGE_MAGE = "Orange Mage",

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
  MAIN = "Main",
  BODY = "Body",
  FACE = "Face"
};

export enum AIS {
  DEFAULT = "Default",
  BUBBLE = "Bubble"
};

export enum EQUIPMENTS {
  // Raider
  SHARD_HELMET = "Shard Helmet",
  ROOKIE_SHOULDERGUARDS = "Rookie Shoulderguards",
  HATCHET = "Hatchet",
  REVEL = "Revel",
  CRESCENT = "Crescent",
  AJAX = "Ajax",
  FEIST = "Feist",

  // Javalin
  ROGASA = "Rogasa",
  GREENHORN_PONCHO = "Greenhorn Poncho",
  SPARROW = "Sparrow",
  STARLING = "Starling",
  BLACKBIRD = "Blackbird",
  HERON = "Heron",

  // Blue Mage
  COZY_ROBE = "Cozy Robe",
  COZY_HOOD = "Cozy Hood",

  // Orange Mage
  RUFFLED_SHIRT = "Ruffled Shirt",
  CLOUDY_CAP = "Cloudy Cap",

  // All
  WALKING_BOOTS = "Walking Boots",

  // Other?
  DOWN_VEST = "Down Vest",
  FEATHER_CAP = "Feather Cap",

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

  // Bodies
  BODY_REGULAR_SHALE = "Body Regular Shale",

  // Faces
  FACE_REGULAR_TOPAZ = "Face Regular Topaz",

  // Enemy Bodies
  BUBBLE = "Bubble",
  BOULDER_MOLE = "Boulder Mole",
  FLYING_SNAKE = "Flying Snake",
  FLYING_SNAKE_BALL = "Flying Snake Ball",

  NOTHING = "Nothing",
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
  TALISMAN = "Talisman",

  FEROCITY = "Ferocity",
  TENACITY = "Tenacity",

  SHARD_HELMET = "Flint Helmet",
  ROGASA = "Rogasa",

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
};

export enum TERMS {
  DEFENSE = "Defense",
  FAST = "Fast",
  SLOW = "Slow",
  CHARGE = "Charge",
  FRONT = "Front",
  INJURY = "Injury",
  CURSE = "Curse",
  BLESSING = "Blessing",
  HEAL_AFTER_DAMAGE = "Heal After Damage",
  KNOCKED_OUT = "Knocked Out"
};

export enum ENCHANTMENTS {
  VAMPIRIC = "Vampiric",
  WEIGHTY = "Weighty",
  HEAVY_DAMAGE = "Heavy (Damage)",
  HEAVY_OTHER = "Heavy (Other)",
  FEY = "Fey",
  OMINOUS_DAMAGE = "Ominous (Damage)",
  OMINOUS_OTHER = "Ominous (Other)",
  WEIGHTLESS = "Weightless",
  STURDY_USER = "Sturdy (User)",
  STURDY_TARGET = "Sturdy (Target)",
  LACQUERED_USER = "Lacquered (User)",
  LACQUERED_TARGET = "Lacquered (Target)",
  VENOMOUS = "Venomous",
  SHINING_USER = "Shining (User)",
  SHINING_TARGET = "Shining (Target)",
  WARDING_USER = "Warding (User)",
  WARDING_TARGET = "Warding (Target)",
  POWERFUL_USER = "Powerful (User)",
  POWERFUL_TARGET = "Powerful (Target)",
  DYNAMIC = "Dynamic"
};

export enum ENCHANTMENT_GROUPS {
  GLOBAL = "Global",
  DAMAGING = "Damaging",
  UTILITY = "Utility",
  SUPPORT_TARGET = "Support (Target)",
  CHARGE = "Charge"
};

export enum CHEST_KINDS {
  WEAPONRY_CHEST = "Weaponry Chest",
  ARMORERS_CHEST = "Armorer's Chest",
  COBBLERS_CHEST = "Cobbler's Chest",
  HATTERS_CHEST = "Hatter's Chest",
  CURIO_CHEST = "Curio Chest",
  HUGE_CHEST = "Huge Chest",
  PICNIC_BASKET = "Picnic Basket",
  ENCHANTED_CHEST = "Enchanted Chest",
  SUPPLY_CACHE = "Supply Cache",
  EMERGENCY_CARE_PACKAGE = "Emergency Care Package"
};

export enum LAYERED_ANIMATED_STATES {
  RESTING = "Resting",
  WALKING = "Walking",
  SWINGING = "Swinging",
  CASTING = "Casting",
  THROWING = "Throwing",
  CLENCHING = "Clenching",
  CHEERING = "Cheering",
  DEFENDING = "Defending",
  DAMAGED = "Damaged",
  CRITICAL = "Critical",
  DOWN = "Down",

  // Debug pieces
  WALKING0 = "Walking0",
  WALKING1 = "Walking1",
  SWINGING0 = "Swinging0",
  SWINGING1 = "Swinging1",
  SWINGING2 = "Swinging2",
};

export enum ARTIST_Z_INDECES {
  BACKGROUND = 1,
  BACKGROUND_EFFECTS = 2,
  MAIN_CONTAINER = 3,
  BATTLE_SPOTS = 5,
  BODY = 10,
  FACE = 20,
  BOTTOM = 30,
  TOP = 40,
  BOTTOM_SHOWY = 50,
  HAT = 60,
  MAIN = 80,
  FOREGROUND_EFFECTS = 1000
};