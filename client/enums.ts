export enum WS_STATES {
  UNINITIALIZED = "Uninitialized",
  CONNECTING = "Connecting",
  CONNECTION_PENDING = "Connection pending",
  REQUESTING_GUEST_ACCOUNT = "Requesting guest account",
  CONNECTED = "Connected",
  DISCONNECTED = "Disconnected"
};

export enum BATTLE_UI_STATES {
  INACTIVE = "Inactive",
  INTRO_TEXT_READING = "Intro text reading",
  FIGHTER_PLACEMENT = "Fighter placement",
  ACTIONS_RESOLVED_READING = "Actions resolved reading",
  INTENTIONS_READING = "Intentions reading",
  EQUIPMENT_SELECT = "Equipment select",
  TARGET_SELECT = "Target select",
  CONFIRM = "Confirm",
  WAITING = "Waiting",
  OUTRO_TEXT_READING = "Outro text reading",
  TREASURE_CLAIMING = "Treasure claiming",
  TREASURE_OUTCOMES = "Treasure outcomes",
  CONCLUSION = "Conclusion",
  POST_CONCLUSION = "Post conclusion"
};