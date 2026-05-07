import type Equipment from "@common/models/equipment";
import RichText from "@common/models/richText";
import { EQUIPMENTS, EQUIPMENT_SLOTS } from "@common/enums";
import { CHARACTER_CLASSES_ALL_SPRITE } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;

const equipmentsFaces: { [id: string] : Equipment } = {

  [EQU.FACE_REGULAR_TOPAZ]: {
    id: EQU.FACE_REGULAR_TOPAZ,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.FACE,
    getDescription: () => new RichText({
      tag: 'span',
      contents: [`A shining yellow eye color for Sprites.`]
    }),
    isStyle: true
  }

};

export default equipmentsFaces;