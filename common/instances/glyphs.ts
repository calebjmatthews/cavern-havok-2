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
    description: `Maximum health +3 (this adventure).`,
    healthMax: 3
  },
  [GLYPHS]
};

export default glyphs;