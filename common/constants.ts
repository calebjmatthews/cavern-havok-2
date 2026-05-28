import { CHARACTER_CLASSES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from './enums';

const CHC = CHARACTER_CLASSES;
const LAS = LAYERED_ANIMATED_STATES;
const EQU = EQUIPMENTS;

export const FIGHTER_CONTROL_AUTO = 'Auto';
export const ALTERATION_SUB_COMMAND_RESOLVED = 'From alteration';
export const ROUND_DURATION_DEFAULT = 100000000;
export const OUTCOME_DURATION_DEFAULT = 200;
export const OUTCOME_ALTERATION_DURATION_DEFAULT = 50;
export const HEALTH_DANGER_THRESHOLD = 0.333;
export const CHARGE_DISPLAY_MAX = 5;

export const PIXEL_SCALE_DEFAULT = 2;
export const SPRITE_SHEET_PATHS = [
  '/public/sprites/sprite_body_regular.json',
  '/public/sprites/chests.json',
  '/public/sprites/backgrounds.json',
  '/public/sprites/particles.json',
  '/public/sprites/tops.json',
  '/public/sprites/hats.json',
  '/public/sprites/terrain.json',
  '/public/sprites/obstacles.json',
  '/public/sprites/monsters.json',
  '/public/sprites/weapons.json'
];
export const CHARACTER_CLASSES_ALL_SPRITE = [CHC.JAVALIN, CHC.RAIDER];
export const EQUIPMENTS_ALL_SPRITE = [
  EQU.FLINT_HEMLET, EQU.FLINT_SHOULDERGUARDS, EQU.FLINT_BOOTS, EQU.HATCHET, EQU.SWEEP_AX,
  EQU.CLEAVING_AX, EQU.SCRAPPY_AX, EQU.FEATHER_CAP, EQU.DOWN_VEST, EQU.TUFTED_SANDALS,
  EQU.SWALLOW, EQU.BLACKBIRD, EQU.HERON, EQU.COZY_ROBE, EQU.COZY_HOOD
]
export const LAYERED_ANIMATED_STATES_ALL = [
  LAS.RESTING, LAS.WALKING, LAS.SWINGING, LAS.THROWING, LAS.CLENCHING, LAS.CHEERING, LAS.DAMAGED,
  LAS.CRITICAL, LAS.DOWN
];
export const LAYERED_ANIMATED_STATES_DEBUG = [
  LAS.RESTING, LAS.WALKING, LAS.WALKING0, LAS.WALKING1, LAS.SWINGING, LAS.SWINGING0, LAS.SWINGING1,
  LAS.SWINGING2, LAS.CASTING, LAS.THROWING, LAS.CLENCHING, LAS.CHEERING, LAS.DAMAGED, LAS.CRITICAL,
  LAS.DOWN
];
export const LAYERED_ANIMATED_STATE_DEFAULT = LAS.RESTING;
export const ANIMATION_DEFAULT_INTERVAL = 16;
export const ANIMATION_DELETION_BUFFER = 200;
export const ANIMATION_SPEED = 0.075;

export const WS_HOST = 'ws://localhost:3000/';
export const COMMUNICATOR_CHECK_INTERVAL = 200;

export const MODE: 'development' | 'production' = 'development';