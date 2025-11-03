import type Equipment from "@common/models/equipment";
import equipmentRaider from "./raider";
import equipmentBubble from "./bubble";
import equipmentBoulderMole from "./boulder_mole";

const equipments: { [id: string] : Equipment } = {
  ...equipmentRaider,
  ...equipmentBubble,
  ...equipmentBoulderMole
};

export default equipments;