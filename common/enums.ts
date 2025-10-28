export enum BATTLE_STATUS{
  CLEAN = "Clean",
  INITIALIZING = "Initializing",
  GEN_AUTO_COMMANDS = "Generate auto commands",
  WAITING_FOR_COMMANDS = "Waiting for commands",
  ROUND_END = "Round end",
}

export enum CHARACTER_CLASSES {
  // Playable
  RAIDER = "Raider",
  BULWARK = "Bulwark",
  BLUE_MAGE = "Blue Mage",
  RED_MAGE = "Red Mage",

  // Monsters
  BUBBLE = "Bubble",

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
  HORNED_HELMET = "Horned Helmet",
  HIDE_VEST = "Hide Vest",
  HOB_NAILED_BOOTS = "Hob-nailed Boots",
  HATCHET = "Hatchet",
  SWEEP_AX = "Sweep Ax",
  CLEAVING_AX = "Cleaving Ax",

  // Bubble
  WOBBLY_MEMBRANE = "Wobbly Membrane",
  DRIFTING_ON_THE_BREEZE = "Drifting on the Breeze",
  FOAMY_DASH = "Foamy Dash",
  GOODBYE = "Goodbye!"
};