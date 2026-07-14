import type Equipment from "@common/models/equipment";
import RichText from "@common/models/richText";
import { EQUIPMENTS, EQUIPMENT_SLOTS } from "@common/enums";
import { CHARACTER_CLASSES_ALL_SPRITE } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;

const equipmentsStyleMain: { [id: string] : Equipment } = {

  [EQU.NOTHING]: {
    id: EQU.NOTHING,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.MAIN,
    getDescription: () => new RichText({
      tag: 'span',
      contents: [`There's nothing here. Nothing here.`]
    }),
    isStyle: true
  }

};

export default equipmentsStyleMain;