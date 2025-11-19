import type Equipment from "@common/models/equipment";
import equipmentRaider from "./raider";
import equipmentsJavalin from "./javalin";
import equipmentBubble from "../equipments_monster/bubble";
import equipmentBoulderMole from "../equipments_monster/boulder_mole";
import equipmentsFlyingSnake from "../equipments_monster/flying_snake";
import equipmentsFlyingSnakeBall from "../equipments_monster/flying_snake_ball";

const equipments: { [id: string] : Equipment } = {
  ...equipmentRaider,
  ...equipmentsJavalin,

  ...equipmentBubble,
  ...equipmentBoulderMole,
  ...equipmentsFlyingSnake,
  ...equipmentsFlyingSnakeBall
};

export default equipments;