import type Equipment from "@common/models/equipment";
import type { GetDescriptionArgs } from "@common/models/equipment";
import RichText from "@common/models/richText";
import { ALTERATIONS, EQUIPMENTS, EQUIPMENT_SLOTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { CHARACTER_CLASSES_ALL_SPRITE } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;

const equipmentsArtifacts: { [id: string] : Equipment } = {
  // Red Scarf (Ubiquitous): Gain 3 Maximum Health
  [EQU.RED_SCARF]: {
    id: EQU.RED_SCARF,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.ARTIFACT,
    getDescription: (_args: GetDescriptionArgs) => new RichText({
      tag: 'span',
      contents: [`Gain 3 Maximum Health`]
    }),
    statChanges: [{
      stat: 'health',
      getExtent: () => 3,
      extentKind: 'additive',
      getExtentDuring: 'equip'
    }]
  },

  // Red Scroll (Common): Gain 1 Maximum Health at the end of each battle
  [EQU.RED_SCROLL]: {
    id: EQU.RED_SCROLL,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.ARTIFACT,
    getDescription: (args: GetDescriptionArgs) => {
      const contents = [`Gain 1 Maximum Health at the end of each battle`];
      const extentCurrent = (args.piece.artifactExtentCurrent ?? 0);
      if (extentCurrent > 0) contents.push(`(currently ${extentCurrent})`);
      return new RichText({
        tag: 'span',
        contents
      });
    },
    statChanges: [{
      stat: 'health',
      getExtent: (args) => ((args.piece.artifactExtentCurrent ?? 0) + 1),
      extentKind: 'additive',
      getExtentDuring: 'battleEnd'
    }]
  },

  // Green Scarf (Ubiquitous): Gain 3 Speed
  [EQU.GREEN_SCARF]: {
    id: EQU.GREEN_SCARF,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.ARTIFACT,
    getDescription: (_args: GetDescriptionArgs) => new RichText({
      tag: 'span',
      contents: [`Gain 3 Speed`]
    }),
    statChanges: [{
      stat: 'speed',
      getExtent: () => 3,
      extentKind: 'additive',
      getExtentDuring: 'equip'
    }]
  },

  // Green Scroll (Common): Gain 1 Speed at the end of each battle
  [EQU.GREEN_SCROLL]: {
    id: EQU.GREEN_SCROLL,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.ARTIFACT,
    getDescription: (args: GetDescriptionArgs) => {
      const contents = [`Gain 1 Speed at the end of each battle`];
      const extentCurrent = (args.piece.artifactExtentCurrent ?? 0);
      if (extentCurrent > 0) contents.push(`(currently ${extentCurrent})`);
      return new RichText({
        tag: 'span',
        contents
      });
    },
    statChanges: [{
      stat: 'speed',
      getExtent: (args) => ((args.piece.artifactExtentCurrent ?? 0) + 1),
      extentKind: 'additive',
      getExtentDuring: 'battleEnd'
    }]
  },

  // Black Scarf (Common): Gain 2 Maximum Health and 1 Starting Power
  [EQU.BLACK_SCARF]: {
    id: EQU.BLACK_SCARF,
    equippedBy: CHARACTER_CLASSES_ALL_SPRITE,
    slot: EQS.ARTIFACT,
    getDescription: (_args: GetDescriptionArgs) => new RichText({
      tag: 'span',
      contents: [`Gain 2 Maximum Health and 1 Starting Power`]
    }),
    statChanges: [{
      stat: 'health',
      getExtent: () => 1,
      extentKind: 'additive',
      getExtentDuring: 'equip'
    }],
    blessing: { alterationId: ALTERATIONS.STARTING_POWER, extent: 1 }
  },
};

// - [ ] Blue Scarf (Common): Gain 2 Maximum Health and 3 Starting Shell
// - [ ] Orange Scarf (Common): Gain 2 Maximum Health and 3 Starting Weightless

export default equipmentsArtifacts;