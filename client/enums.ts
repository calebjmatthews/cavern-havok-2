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
  CONFIRM = "Confirm",
  WAITING = "Waiting",
  OUTRO_TEXT_READING = "Outro text reading",
  TREASURE_CLAIMING = "Treasure claiming",
  TREASURE_OUTCOMES = "Treasure outcomes",
  CONCLUSION = "Conclusion",
  POST_CONCLUSION = "Post conclusion"
};

export enum MODAL_KINDS {
  OCCUPANT_DETAIL = "Occupant detail",
  EQUIPMENT_DETAIL = "Equipment detail"
};

// ToDo: Move to common enums
export enum ANIMATION_TYPES {
  WOBBLE = "Wobble",
  DROP_FROM_ABOVE = "Drop from above",
  FADE_AWAY = "Fade away",
  PULSE_OPACITY = "Pulse opacity",
  DRIFT_AND_FADE = "Drift and fade",
  MOVE = "Move",
  REGRESS = "Regress",
  LUNGE = "Lunge",
  PULSE_TINT = "Pulse tint",
  HOVER = "Hover",

  CINDERS_TREASURE_SPILL = "Cinders treasure spill",
  DAMAGE_NUMBERS = "Damage numbers",
  DEFENSE_NUMBERS = "Defense numbers",
  HEALING_NUMBERS = "Healing numbers",

  CINDER_TREASURE = "Cinder treasure",
  DAMAGE_NUMBER = "Damage number",
  DEFENSE_NUMBER = "Defense number",
  HEALING_NUMBER = "Healing number"
};

export enum PARTICLE_KINDS {
  CINDER_TREASURE = "Cinder treasure"
};

export enum SPRITE_NAMES {
  SBR_RESTING = "SBR Resting",
  SBR_WALKING_0 = "SBR Walking 0",
  SBR_WALKING_1 = "SBR Walking 1",
  SBR_SWINGING_0 = "SBR Swinging 0",
  SBR_SWINGING_1 = "SBR Swinging 1",
  SBR_SWINGING_2 = "SBR Swinging 2",
  SBR_CHEERING = "SBR Cheering",
  SBR_CASTING = "SBR Casting",
  SBR_CRITICAL = "SBR Critical",
  SBR_DAMAGED = "SBR Damaged",
  SBR_CLENCHING = "SBR Clenching",
  FACE_RESTING = "Face Resting",
  FACE_CASTING_0 = "Face Casting 0",
  FACE_CASTING_1 = "Face Casting 1",
  FACE_CLOSED = "Face Closed",
  FACE_CRITICAL = "Face Critical",
  FACE_DAMAGED = "Face Damaged",
  FACE_DOWN = "Face Down"
};

export enum FRAME_NAMES {
  RESTING = "Resting",
  WALKING_0 = "Walking 0",
  WALKING_1 = "Walking 1",
  SWINGING_0 = "Swinging 0",
  SWINGING_1 = "Swinging 1",
  SWINGING_2 = "Swinging 2",
  CHEERING = "Cheering",
  CASTING = "Casting",
  CRITICAL = "Critical",
  DAMAGED = "Damaged",
  CLENCHING = "Clenching",
  DOWN = "Down",

  DEFAULT = "Default",
  ONE_LOWER = "One Lower"
};

export enum CYCLE_LAYER_SLOTS {
  MAIN = "Main",
  OFFHAND = "Offhand",
  HEAD = "Head",
  LAPEL = "Lapel",
  NECK = "Neck",
  BELT = "Belt",
  TOP = "Top", // I.e. clothes
  BOTTOM = "Bottom", // I.e. shoes
  BACK = "Back",
  FACE = "Face", // If hat covers face, this should be NOTHING
  BODY = "Body"
};