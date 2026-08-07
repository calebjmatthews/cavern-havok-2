import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type Action from "@common/models/action";
import type ActionResolved from "../../../models/actionResolved";
import type AlterationActive from '@common/models/alterationActive';
import type { PixiEvent } from "@common/models/pixiEvent";
import Fighter from "@common/models/fighter";
import resolveDamageAndHealing from "./resolveDamageAndHealing";
import getObstacleKind from "@common/instances/obstacle_kinds";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import cloneOccupant from "@common/functions/cloneOccupant";
import cloneBattleState from "@common/functions/cloneBattleState";
import getAlterationActive from '../getAlterationActive';
import getCharacterClass from '@common/instances/character_classes';
import applyEnchantments from "../applyEnchantments";
import equipments from "@common/instances/equipments";
import alterations from "@common/instances/alterations";
import { genId } from "@common/functions/utils/random";
import { FIGHTER_CONTROL_AUTO } from '@common/constants';
import { ELEMENTS } from "@common/enums";
const ELE = ELEMENTS;

interface ResolveActionResult {
  battleState: BattleState;
  actionResolved: ActionResolved;
  durationTotal: number;
  pixiEvents: PixiEvent[]
};

const resolveAction = (args: {
  battleState: BattleState,
  action: Action,
  delayFromRoot: number
}): ResolveActionResult => {
  const { battleState, action, delayFromRoot } = args;
  const { userId } = action;
  const commandId = action.fromCommand;

  const outcomeDefault = { userId: action.userId, duration: 0 };
  const resolvedDefault = { commandId, delayFromRoot };

  const user = battleState.fighters[action.userId];
  if (!user) throw Error(`resolveAction error: user ID${action.userId} not found.`);
  if (user.health <= 0) {
    return { battleState, actionResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseDowned: true
    }] }, durationTotal: 0, pixiEvents: [] };
  };
  if (user.isStunned) {
    return { battleState, actionResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseStunned: true
    }] }, durationTotal: 0, pixiEvents: [] };
  };

  if (!action.getOutcomes) {
    throw Error(`resolveAction error: equipment or getOutcomes for ID${userId} not found.`);
  };

  let target = action.targetCoords;
  if (action.targetId) {
    const occupantTargeted = getOccupantById({ battleState, occupantId: action.targetId });
    if (occupantTargeted) {
      target = occupantTargeted.coords;
    };
  };
  const pieceId = action.pieceId;
  const getOutcomesArgs = { battleState, userId, pieceId, target };
  const outcomesBeforeEnchantments = [...(action.getOutcomes(getOutcomesArgs))];
  const outcomesInitial = applyEnchantments({
    ...getOutcomesArgs,
    outcomesOriginal: outcomesBeforeEnchantments
  });

  const newBattleState = cloneBattleState(battleState);
  const outcomesPerformed = outcomesInitial.map((outcome) => {
    let outcomePerformed: Outcome = { ...outcome };

    const mods = new OutcomegMods();
    Object.values(battleState.alterationsActive).forEach((aa) => {
      const alteration = alterations[aa.alterationId];
      if (!alteration) return;
      const fighterId = (alteration.appliesDuring === 'usingAction')
        ? outcome.userId
        : outcome.affectedId;
      if (!fighterId) return;
      const extent = alteration.getExtent({
        battleState,
        userId: (outcome.userId ?? ''),
        affectedId: outcome.affectedId,
        alterationActive: aa,
        outcome
      });
      if (extent && alteration.declinesOnApplication) aa.extent -= 1;
      if (extent && alteration.expiresOnApplication) aa.extent = 0;
      if (extent && (alteration.modKind === 'defense' || alteration.modKind === 'defenseOrHealing')) {
        if (alteration.extentKind === 'additive') { mods.defenseModAdd += extent; return; }
        if (alteration.extentKind === 'subtractive') { mods.defenseModAdd -= extent; return; }
        if (alteration.extentKind === 'multiplicative') { mods.defenseModMult *= extent; return; }
        if (alteration.extentKind === 'divisive') { mods.defenseModMult /= extent; return; }
      };
    });
    const defenseInitial = outcome.defense;
    let defense = outcome.defense;
    if (defense) defense = ((defense + mods.defenseModAdd) * mods.defenseModMult);
    if (defenseInitial && (defense ?? 0) < 1) defense = 1;

    if (outcome.makeObstacle) {
      let highestObstacleNumber = 1;
      Object.values(newBattleState.obstacles).forEach((obstacle) => {
        const nameSplit = obstacle.name.split(" ");
        const obstacleNumberFromName = parseInt(nameSplit[nameSplit.length - 1] || "");
        if (obstacleNumberFromName >= highestObstacleNumber) {
          highestObstacleNumber = (obstacleNumberFromName + 1);
        };
      });
      const obstacleKind = getObstacleKind(outcome.makeObstacle.kind);
      if (target) {
        const newObstacle = obstacleKind.makeObstacle({
          name: `${obstacleKind.id} ${highestObstacleNumber}`,
          createdBy: (outcome.userId ?? ''),
          side: user.side,
          coords: target
        });
        newBattleState.obstacles = { ...newBattleState.obstacles, [newObstacle.id]: newObstacle };
        outcomePerformed.madeObstacle = newObstacle;
      };
    };

    if (outcome.makeFighter) {
      let highestFighterNumber = 1;
      Object.values(newBattleState.fighters).forEach((fighter) => {
        const nameSplit = fighter.name.split(" ");
        const fighterNumberFromName = parseInt(nameSplit[nameSplit.length - 1] || "");
        if (fighterNumberFromName >= highestFighterNumber) {
          highestFighterNumber = (fighterNumberFromName + 1);
        };
      });
      const characterClass = getCharacterClass(outcome.makeFighter.className);
      if (target) {
        const newFighter = characterClass.toFighter({
          name: `${characterClass.id} ${highestFighterNumber}`,
          ownedBy: FIGHTER_CONTROL_AUTO,
          controlledBy: FIGHTER_CONTROL_AUTO,
          side: user.side,
          coords: target
        });
        newBattleState.fighters = { ...newBattleState.fighters, [newFighter.id]: newFighter };
        outcomePerformed.madeFighter = newFighter;
      };
    };

    if (outcome.affectedId) {
      const affectedOriginal: Fighter | Obstacle | Creation | undefined = getOccupantById({
        battleState: newBattleState,
        occupantId: outcome.affectedId
      });
      if (!affectedOriginal) {
        throw Error(`resolveAction error: affected occupant not found for command ID${action.id}.`);
      };
      let affected = cloneOccupant(affectedOriginal);

      if (defense) {
        if ((outcome.elements ?? []).includes(ELE.WATER)) {
          affected.defenseWater += defense;
        }
        else if ((outcome.elements ?? []).includes(ELE.FIRE)) {
          affected.defenseFire += defense;
        }
        else if ((outcome.elements ?? []).includes(ELE.BIO)) {
          affected.defenseBio += defense;
        }
        else {
          affected.defense += defense;
        };
        outcomePerformed.defense = defense;
      };
      if (outcome.charge && "charge" in affected) {
        affected.charge += outcome.charge;
      };
      if (outcome.moveTo) {
        affected.coords = [...outcome.moveTo];
      };
      if (outcome.becameStunned && "isStunned" in affected) {
        affected.isStunned = true;
      };

      if (outcome.damage || outcome.healing || outcome.damageEqualToUsersInjury) {
        const result = resolveDamageAndHealing({
          battleState, affected, user, outcome, outcomePerformed
        });
        affected = result.affected;
        outcomePerformed = result.outcomePerformed;
      };

      const blessingOrCurse = outcome.bless || outcome.curse;
      if (blessingOrCurse) {
        const existingAA = getAlterationActive({
          battleState,
          alterationId: blessingOrCurse.alterationId,
          occupantId: outcome.affectedId
        });
        if (existingAA) {
          const extent = existingAA.extent + blessingOrCurse.extent;
          newBattleState.alterationsActive[existingAA.id]  = { ...existingAA, extent };
        }
        else {
          const alteractionActive: AlterationActive = {
            id: genId(),
            alterationId: blessingOrCurse.alterationId,
            extent: blessingOrCurse.extent,
            ownedBy: outcome.affectedId,
            appliedDuringRound: battleState.round
          };
          newBattleState.alterationsActive[alteractionActive.id]  = alteractionActive;
        };
      };

      // ToDo: Implement healAfterDamage
      if (outcome.healAfterDamage) {

      };

      if (affected.occupantKind === "fighter") {
        newBattleState.fighters[affected.id] = affected;
      }
      // affected is an Obstacle, destroy if no health
      else if (affected.occupantKind === "obstacle") {
        if (affected.health > 0) {
          newBattleState.obstacles[affected.id] = affected;
        }
        else {
          delete newBattleState.obstacles[affected.id];
        };
      };
    };

    return outcomePerformed;
  });
  const actionResolved: ActionResolved = { ...resolvedDefault, outcomes: outcomesPerformed };

  const piece = [...user.equipped, ...user.inventory].filter((p) => p.id === pieceId)?.[0];
  const equipment = equipments[piece?.equipmentId ?? ''];
  if (equipment?.getPixiEvents) {
    const { pixiEvents, duration } = equipment.getPixiEvents({
      actionResolved, battleState, battleStateNew: newBattleState, delayFromRoot
    });
    return {
      battleState: newBattleState,
      actionResolved,
      durationTotal: duration,
      pixiEvents
    };
  };

  return {
    battleState: newBattleState,
    actionResolved,
    durationTotal: 0,
    pixiEvents: []
  };
};

class OutcomegMods {
  defenseModAdd: number = 0;
  defenseModMult: number = 1;
};

export default resolveAction;