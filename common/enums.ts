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

export enum ACTION_PRIORITIES {
  FIRST = "First"
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

export enum WS_STATES {
  UNINITIALIZED = "Uninitialized",
  CONNECTING = "Connecting",
  CONNECTION_PENDING = "Connection pending",
  REQUESTING_GUEST_ACCOUNT = "Requesting guest account",
  CONNECTED = "Connected",
  DISCONNECTED = "Disconnected"
};