import type Enchantment from "@common/models/enchantment";
import { ALTERATIONS, ENCHANTMENTS, TERMS } from "@common/enums";

const enchantments: { [id: string] : Enchantment } = {
  [ENCHANTMENTS.VAMPIRIC]: {
    id: ENCHANTMENTS.VAMPIRIC,
    name: 'Vampiric',
    description: `Heal 1 after successfully dealing damage.`,
    mods: [
      { kind: 'healAfterDamage', appliesTo: 'user' }
    ]
  },
  [ENCHANTMENTS.WEIGHTY]: {
    id: ENCHANTMENTS.WEIGHTY,
    name: 'Weighty',
    description: {
      tag: 'section',
      contents: [
        { tag: 'Term', contents: [TERMS.SLOW] },
        `priority, but +1 damage.`,
      ]
    },
    mods: [
      { kind: 'slow' },
      { kind: 'damage', appliesTo: 'target', extent: 1, extentKind: 'additive' }
    ]
  },
  [ENCHANTMENTS.HEAVY_DAMAGE]: {
    id: ENCHANTMENTS.HEAVY_DAMAGE,
    name: 'Heavy',
    description: {
      tag: 'section',
      contents: [
        { tag: 'Term', contents: [TERMS.SLOW] },
        `priority, but +2 damage or +1 healing,`,
        { tag: 'Term', contents: [TERMS.CURSE] },
        `, or`,
        { tag: 'Term', contents: [TERMS.BLESSING] },
        `.`
      ]
    },
    mods: [
      { kind: 'slow' },
      { kind: 'damage', appliesTo: 'target', extent: 2, extentKind: 'additive' }
    ]
  },
  [ENCHANTMENTS.HEAVY_OTHER]: {
    id: ENCHANTMENTS.HEAVY_OTHER,
    name: 'Heavy',
    description: {
      tag: 'section',
      contents: [
        { tag: 'Term', contents: [TERMS.SLOW] },
        `priority, but +2 damage or +1 healing,`,
        { tag: 'Term', contents: [TERMS.CURSE] },
        `, or`,
        { tag: 'Term', contents: [TERMS.BLESSING] },
        `.`
      ]
    },
    mods: [
      { kind: 'slow' },
      { kind: 'healingCurseBlessing', appliesTo: 'target', extent: 1, extentKind: 'additive' }
    ]
  },
  [ENCHANTMENTS.OMINOUS_DAMAGE]: {
    id: ENCHANTMENTS.OMINOUS_DAMAGE,
    name: 'Ominous',
    description: {
      tag: 'section',
      contents: [
        `+2 damage or +1 healing,`,
        { tag: 'Term', contents: [TERMS.CURSE] },
        `, or`,
        { tag: 'Term', contents: [TERMS.BLESSING] },
        `but deal 1 damage to user.`
      ]
    },
    mods: [
      { kind: 'damage', appliesTo: 'target', extent: 2, extentKind: 'additive' },
      { kind: 'damage', appliesTo: 'user', extent: 1, extentKind: 'additive' },
    ]
  },
  [ENCHANTMENTS.OMINOUS_OTHER]: {
    id: ENCHANTMENTS.OMINOUS_OTHER,
    name: 'Ominous',
    description: {
      tag: 'section',
      contents: [
        `+2 damage or +1 healing,`,
        { tag: 'Term', contents: [TERMS.CURSE] },
        `, or`,
        { tag: 'Term', contents: [TERMS.BLESSING] },
        `but deal 1 damage to user.`
      ]
    },
    mods: [
      { kind: 'healingCurseBlessing', appliesTo: 'target', extent: 1, extentKind: 'additive' },
      { kind: 'damage', appliesTo: 'user', extent: 1, extentKind: 'additive' },
    ]
  },
  
  [ENCHANTMENTS.WEIGHTLESS]: {
    id: ENCHANTMENTS.WEIGHTLESS,
    name: 'Weightless',
    description: {
      tag: 'section',
      contents: [
        { tag: 'Term', contents: [TERMS.FAST] },
        `priority.`,
      ]
    },
    mods: [
      { kind: 'fast' }
    ]
  },
  [ENCHANTMENTS.STURDY_USER]: {
    id: ENCHANTMENTS.STURDY_USER,
    name: 'Sturdy',
    description: {
      tag: 'section',
      contents: [
        `2`,
        { tag: 'Term', contents: [TERMS.DEFENSE] },
        `to user.`,
      ]
    },
    mods: [
      { kind: 'defense', appliesTo: 'user', extent: 2, extentKind: 'additive' }
    ]
  },
  [ENCHANTMENTS.STURDY_TARGET]: {
    id: ENCHANTMENTS.STURDY_TARGET,
    name: 'Sturdy',
    description: {
      tag: 'section',
      contents: [
        `2`,
        { tag: 'Term', contents: [TERMS.DEFENSE] },
        `to target.`,
      ]
    },
    mods: [
      { kind: 'defense', appliesTo: 'target', extent: 2, extentKind: 'additive' }
    ]
  },
  [ENCHANTMENTS.LACQUERED_USER]: {
    id: ENCHANTMENTS.LACQUERED_USER,
    name: 'Lacquered',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.SHELL] },
        `to user.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'user', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.SHELL }
    ]
  },
  [ENCHANTMENTS.SHINING_USER]: {
    id: ENCHANTMENTS.SHINING_USER,
    name: 'Shining',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.REGEN] },
        `to user.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'user', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.REGEN }
    ]
  },
  [ENCHANTMENTS.SHINING_TARGET]: {
    id: ENCHANTMENTS.SHINING_TARGET,
    name: 'Shining',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.REGEN] },
        `to target.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'target', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.REGEN }
    ]
  },
  [ENCHANTMENTS.WARDING_USER]: {
    id: ENCHANTMENTS.WARDING_USER,
    name: 'Warding',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.REGEN] },
        `to user.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'user', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.TALISMAN }
    ]
  },
  [ENCHANTMENTS.WARDING_TARGET]: {
    id: ENCHANTMENTS.WARDING_TARGET,
    name: 'Warding',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.REGEN] },
        `to target.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'target', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.TALISMAN }
    ]
  },
  [ENCHANTMENTS.POWERFUL_USER]: {
    id: ENCHANTMENTS.POWERFUL_USER,
    name: 'Powerful',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.POWER] },
        `to user.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'user', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.POWER }
    ]
  },
  [ENCHANTMENTS.POWERFUL_TARGET]: {
    id: ENCHANTMENTS.POWERFUL_TARGET,
    name: 'Powerful',
    description: {
      tag: 'section',
      contents: [
        `1`,
        { tag: 'Alteration', contents: [ALTERATIONS.POWER] },
        `to target.`,
      ]
    },
    mods: [
      { kind: 'giveBlessing', appliesTo: 'target', extent: 1, extentKind: 'additive', alterationId: ALTERATIONS.POWER }
    ]
  },
  [ENCHANTMENTS.DYNAMIC]: {
    id: ENCHANTMENTS.DYNAMIC,
    name: 'Dynamic',
    description: {
      tag: 'section',
      contents: [
        `1 less`,
        { tag: 'Term', contents: [TERMS.CHARGE] },
        `cost (but not less than 1).`,
      ]
    },
    mods: [
      { kind: 'chargeLess', appliesTo: 'user', extent: 1, extentKind: 'additive' }
    ]
  }
};

export default enchantments;