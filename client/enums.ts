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
  ACTIONS_RESOLVED_READ = "Actions resolved read",
  INTENTIONS_READ = "Intentions read",
  EQUIPMENT_SELECT = "Equipment select",
  TARGET_SELECT = "Target select",
  CONFIRM = "Confirm",
  WAITING = "Waiting",
  CONCLUSION = "Conclusion"
};