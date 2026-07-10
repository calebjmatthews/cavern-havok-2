import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import RichText from "@common/models/richText";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import createActions from "@common/functions/battleLogic/createActions";
import moveIntoPixiEvents from "@common/functions/pixiEvents/moveIntoPixiEvents";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import {
  EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES } from "@common/enums";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsCommon: { [id: string] : Equipment } = {
  // Walking Boots (Bottom): Move 1-2
  [EQU.WALKING_BOOTS]: {
    id: EQU.WALKING_BOOTS,
    equippedBy: [CHC.RAIDER, CHC.JAVALIN],
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
    getPixiEvents: (args) => ({
      pixiEvents: moveIntoPixiEvents(args),
      duration: OUTCOME_DURATION_DEFAULT
    })
  },
};

export default equipmentsCommon;