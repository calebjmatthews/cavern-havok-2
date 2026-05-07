import type Equipment from "@common/models/equipment";
import RichText from "@common/models/richText";
import { EQUIPMENTS, EQUIPMENT_SLOTS } from "@common/enums";
import { CHARACTER_CLASSES_ALL_SPRITE } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;

const equipmentsBodies: { [id: string] : Equipment } = {

  [EQU.BODY_REGULAR_SHALE]: {
    id: EQU.BODY_REGULAR_SHALE,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.HEAD,
    getDescription: () => new RichText({
      tag: 'span',
      contents: [`A dark red body color for Sprites.`]
    })
  }

};

export default equipmentsBodies;