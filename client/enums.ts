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
  ACTIONS_RESOLVED_READ = "Actions resolved read",
  EQUIPMENT_SELECT = "Equipment select",
  TARGET_SELECT = "Target select",
  CONFIRM = "Confirm",
  WAITING = "Waiting",
  CONCLUSION = "Conclusion"
};