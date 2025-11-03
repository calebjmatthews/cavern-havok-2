import type Equipment from "@common/models/equipment";
import equipmentRaider from "./raider";
import equipmentBubble from "../equipments_monster/bubble";
import equipmentBoulderMole from "../equipments_monster/boulder_mole";

const equipments: { [id: string] : Equipment } = {
  ...equipmentRaider,
  
  ...equipmentBubble,
  ...equipmentBoulderMole
};

export default equipments;