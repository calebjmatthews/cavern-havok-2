import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import RichText from "@common/models/richText";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import createActions from "@common/functions/battleLogic/createActions";
import actionIntoPixiEvents from "@common/functions/pixiEvents/actionIntoPixiEvents";
import { CHARACTER_CLASSES_ALL_SPRITE, OUTCOME_DURATION_DEFAULT } from "@common/constants";
import { EQUIPMENTS, EQUIPMENT_SLOTS, LAYERED_ANIMATED_STATES } from "@common/enums";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsShoes: { [id: string] : Equipment } = {
  // Walking Boots (Bottom): Move 1-2
  [EQU.WALKING_SHOES]: {
    id: EQU.WALKING_SHOES,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.BOTTOM,
    getDescription: (_args: GetDescriptionArgs) => new RichText({
      tag: 'span',
      contents: [`Move 1-2`]
    }),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 2,
        onlyInSide: user.side,
        onlyOpenSpaces: true
      });
    },
    targetType: 'coords',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, moveTo: args.target }
      ])
    }),
    getPixiEvents: (args) => actionIntoPixiEvents(args),
    commandReadyState: LAYERED_ANIMATED_STATES.WALKING
  },


};

export default equipmentsShoes;