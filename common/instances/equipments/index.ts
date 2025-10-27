import equipmentRaider from "./raider";
import equipmentBubble from "./bubble";
import type Equipment from "@common/models/equipment";

const equipments: { [id: string] : Equipment } = {
  ...equipmentRaider,
  ...equipmentBubble
};

export default equipments;