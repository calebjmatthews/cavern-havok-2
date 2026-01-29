import type Glyph from '@common/models/glyph';
import { ALTERATIONS, GLYPHS } from '../enums';

/**
 * Ideas:
 * Glyphs are initially impossible to read, some mechanic for gaining knowledge about them?
 * - Health
 * - Speed
 * - Begin with Power
 * - Begin with Shell
 * - Gain more cinders
 * - Elemental affinity
 * - Increased choice of rewards
 * - Decrease of health with doubled benefit
 * - Decrease of speed with doubled benefit
 * - Enchant a gear every three chambers
 */

const glyphs: { [id: string] : Glyph } = {
  [GLYPHS.VITALITY]: {
    id: GLYPHS.VITALITY,
    name: `Vitality`,
    kind: 'simple',
    description: `Maximum health +3 (this adventure).`,
    healthMax: 3
  },
  [GLYPHS.ALACRITY]: {
    id: GLYPHS.ALACRITY,
    name: `Alacrity`,
    kind: 'simple',
    description: `Speed +2 (this adventure).`,
    speed: 2
  },
  [GLYPHS.FEROCITY]: {
    id: GLYPHS.FEROCITY,
    name: `Ferocity`,
    kind: 'simple',
    description: `Begin battles Blessed with 2 Power, making most moves stronger.`,
    blessing: { alterationId: ALTERATIONS.FEROCITY, extent: 2 }
  },
  [GLYPHS.TENACITY]: {
    id: GLYPHS.TENACITY,
    name: `Tenacity`,
    kind: 'simple',
    description: `Begin battles Blessed with 2 Shell, giving you instant defense.`,
    blessing: { alterationId: ALTERATIONS.TENACITY,  extent: 2 }
  }
};

export const glyphsSimple = Object.keys(glyphs).filter((glyphId) => glyphs[glyphId]?.kind === 'simple');

export default glyphs;