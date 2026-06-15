import type Outcome from "@common/models/outcome";
import type EquipmentPiece from "@common/models/equipmentPiece";
import type { GetActionsArgs } from "@common/models/equipment";
import type { GetOutcomesArgs } from "@common/models/action";
import type { ModKind } from "@common/models/enchantment";
import Action from "@common/models/action";
import enchantments from "@common/instances/enchantments";
import applyLevel from "./applyLevel";
import { ACTION_PRIORITIES } from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";

const duration = OUTCOME_DURATION_DEFAULT;

const createActions = (args: CreateActionsArgs) => {
  const { piece } = args;

  const hasModsSlow = (getMods(piece, 'slow') ?? []).length > 0;
  const hasModsFast = (getMods(piece, 'fast') ?? []).length > 0;
  let priority = args.priority;
  if (hasModsSlow) priority = ACTION_PRIORITIES.PENULTIMATE;
  if (hasModsFast) priority = ACTION_PRIORITIES.SECOND;

  const actions = [new Action({ ...args, ...args.command, priority })];

  return addDefenseModsIfApplicable(actions, args);
};

const getMods = (piece: EquipmentPiece, modKind: ModKind) => (
  piece.enchantments?.flatMap((enchantmentId) => {
    const enchantment = enchantments[enchantmentId];
    return enchantment?.mods.filter((mod) => mod.kind === modKind)
  }).filter((mod) => mod !== undefined)
);

const addDefenseModsIfApplicable = (actionsArg: Action[], args: CreateActionsArgs) => {
  const { battleState, piece, command } = args;
  const { fromId: userId } = command;

  const actions = actionsArg;
  const modsDefense = getMods(piece, 'defense');
  modsDefense?.forEach((mod) => {
    let targetId: string | undefined;
    let targetCoords: [number, number] | undefined;
    const anyDefenseActions = actions.filter((action) => action.givesDefenseOutcome).length > 0;
    if (anyDefenseActions) return;

    actions.unshift(new Action({
      battleState,
      piece,
      ...command,
      command: { ...command, targetId, targetCoords },
      priority: ACTION_PRIORITIES.FIRST,
      getOutcomes: (goArgs) => [{
        userId,
        duration,
        affectedId: userId,
        defense: applyLevel((mod.extent ?? 1), goArgs),
        defenseFromEnchantment: true
      }]
    }))
  });

  return actions;
};

type CreateActionsArgs = GetActionsArgs & {
  priority?: ACTION_PRIORITIES;
  givesDefenseOutcome?: boolean;
  duration: number;
  getOutcomes: (args: GetOutcomesArgs) => Outcome[];
};

export default createActions; 