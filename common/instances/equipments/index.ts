import type Equipment from "@common/models/equipment";
import RichText from "@common/models/richText";

import equipmentsShoes from "./shoes";
import equipmentsArtifacts from "./artifacts";
import equipmentRaider from "./raider";
import equipmentsJavalin from "./javalin";
import equipmentsBlueMage from "./blueMage";

import equipmentBubble from "../equipments_monster/bubble";
import equipmentBoulderMole from "../equipments_monster/boulder_mole";
import equipmentsFlyingSnake from "../equipments_monster/flying_snake";
import equipmentsFlyingSnakeBall from "../equipments_monster/flying_snake_ball";

import equipmentsBodies from "../equipments_style/bodies";
import equipmentsFaces from "../equipments_style/faces";
import equipmentsStyleMain from "../equipments_style/main";
import { EQUIPMENT_SLOTS, EQUIPMENTS } from "@common/enums";

const equipments: { [id: string] : Equipment } = {
  ...equipmentsShoes,
  ...equipmentsArtifacts,
  ...equipmentRaider,
  ...equipmentsJavalin,
  ...equipmentsBlueMage,

  ...equipmentBubble,
  ...equipmentBoulderMole,
  ...equipmentsFlyingSnake,
  ...equipmentsFlyingSnakeBall,
  ...equipmentsBodies,
  ...equipmentsFaces,
  ...equipmentsStyleMain
};

export const equipmentMissing: Equipment = {
  id: EQUIPMENTS.MISSING,
  equippedBy: [],
  slot: EQUIPMENT_SLOTS.MAIN,
  getDescription: () => new RichText({
    tag: 'span',
    contents: ['The equipment is somehow missing. This should never happen.']
  })
};

export default equipments;