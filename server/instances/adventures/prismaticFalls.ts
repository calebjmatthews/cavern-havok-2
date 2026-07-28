import type Adventure from "@server/models/adventure/adventure";
import type Treasure from "@common/models/treasure";
import type Fighter from "@common/models/fighter";
import Encounter from "@server/models/encounter";
import EncounterPeaceful from "@server/models/encounterPeaceful";
import generateTreasureMaker from "@server/functions/adventureLogic/generateTreasureMaker";
import equipToTreasurePool from "@server/functions/adventureLogic/equipToTreasurePool";
import getEncounter from "../encounters";
import equipments from "@common/instances/equipments";
import foods from "@common/instances/food";
import generateChestMaker from "@server/functions/adventureLogic/generateChestMaker";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
import random from "@common/functions/utils/random";
import { ENCOUNTERS, ENCOUNTERS_PEACEFUL } from "@server/enums";
import { CHEST_KINDS } from "@common/enums";
const ENC = ENCOUNTERS;
const CHK = CHEST_KINDS;

export const prismaticFallsGetChamberCount = (difficulty: number) => 5 + difficulty;

export const prismaticFallsChamberMaker
: (adventure: Adventure) => Encounter | EncounterPeaceful = (adventure: Adventure) => {
  const chamberKinds = [
    { id: ENC.BUBBLES, weight: 20},
    { id: ENC.BUBBLES_AND_BOULDERS, weight: 20 }
  ];

  if (adventure.chamberIdsFinished.length >= 1) {
    chamberKinds.push({ id: ENC.FALLS_HUNTING_PARTY, weight: 10 });
  };
  if (adventure.chamberIdsFinished.length >= 2) {
    chamberKinds.push({ id: ENC.FLYING_SNAKE_BALL, weight: 10 });
  };

  if (adventure.chamberIdsFinished.length >= adventure.chamberCount) return new EncounterPeaceful({
    id: ENCOUNTERS_PEACEFUL.FINISH_ROOM_FALLS,
    name: "Pile of Treasure",
    type: 'peaceful',
    getIntroText: () => `You've done it! You found your way to a treasure-filled pile of flotsam at the bottom of a waterfall.`,
    isFinishRoom: true,
    treasureMaker: (args) => {
      // const { adventure, fighter } = args;
      return [
        { kind: 'cinders', quantity: Math.floor((random() * 80) + 160) },
        { kind: 'cinders', quantity: Math.floor((random() * 80) + 160) },
        { kind: 'cinders', quantity: Math.floor((random() * 80) + 160) }
      ];
    }
  });

  const remainingChambers = chamberKinds.filter((ck) => !adventure.chamberIdsFinished.includes(ck.id));

  const chamberId = remainingChambers[randomFromWeighted(remainingChambers) || 0]?.id;
  return getEncounter(chamberId || ENCOUNTERS.MISSING);
};

export const prismaticFallsChestMaker:
(args: { adventure: Adventure, fighter: Fighter }) => string[] = (args) => {

  const chestPool: { id: string, weight: number }[] = [
    { id: CHK.WEAPONRY_CHEST, weight: 100 },
    ...[CHK.HATTERS_CHEST, CHK.ARMORERS_CHEST, CHK.COBBLERS_CHEST, CHK.PICNIC_BASKET].map((ckid) => (
      { id: ckid, weight: 25 }
    ))
  ];

  const chestMaker = generateChestMaker({
    chestFinal: CHK.FLOTSAM_PILE,
    chestPool
  });

  return chestMaker(args);
};

const kindFood: 'food' = 'food';

export const prismaticFallsTreasureMaker:
(args: { adventure: Adventure, fighter: Fighter, chestKindId: string }) => Treasure[] = (args) => {
  const { adventure, fighter } = args;
  const account = Object.values(adventure.accounts).find((a) => a.id === fighter.controlledBy);
  if (!account) return [];

  const treasureMaker = generateTreasureMaker({
    treasureGuaranteed: {
      kind: 'cinders', quantity: Math.floor((random() * 10) + 10), isGuaranteed: true
    },
    treasurePool: [
      ...Object.values(foods).map((food) => ({ kind: kindFood, id: food.id, quantity: 1, weight: 100 })),
      { kind: 'cinders', quantity: Math.floor((random() * 40) + 80), weight: 100 },
      ...equipToTreasurePool({
        equipIds: Object.keys(equipments),
        fighter,
        weight: 100,
        enchantmentPercentage: 33
      }),
      // ...glyphToTreasurePool({ glyphIds: glyphsSimple, account })
    ]
  });

  return treasureMaker(args);
};