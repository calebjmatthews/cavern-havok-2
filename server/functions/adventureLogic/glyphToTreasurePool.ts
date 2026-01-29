import type Account from "@common/models/account";
import randomFrom from "@common/functions/utils/randomFrom";
import range from "@common/functions/utils/range";
import type { TreasurePoolOption } from "@server/models/treasurePoolOption";
import glyphs from "@common/instances/glyphs";

const kindGlyph: 'glyph' = 'glyph';
const kindGlyphUnknown: 'glyphUnknown' = 'glyphUnknown';

const glyphToTreasurePool = (args: {
  glyphIds: string[],
  account: Account
}) : TreasurePoolOption[] => {
  const { glyphIds, account } = args;

  return glyphIds
  .map((glyphId) => {
    const unknownToAccount = !((account.glyphsSeen ?? []).includes(glyphId));
    const glyph = glyphs[glyphId];
    if (!glyph) return;

    const glyphRoot = { kind: kindGlyph, id: glyphId, quantity: 1, weight: 100 };
    
    return unknownToAccount
      ? { ...glyphRoot, kind: kindGlyphUnknown, nameUnknown: getGlyphNameUnknown(glyph.name) }
      : glyphRoot;
  }).filter((g) => !!g);
};

const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

const unknownConsonants = [ 'Ÿ', 'š', 'þ', 'Ý', '‰', 'ƒ', 'Ŀ', 'ŀ' ];

const unknownVowels = [ 'å', 'ø', 'º', 'ú', 'û', 'ĳ', 'Ô', '°', '˜', '~' ];

const getGlyphNameUnknown = (name: string) => (
  range(0, name.length).map((index) => (
    (vowels.includes(name[index] ?? 'a')
    ? randomFrom(unknownVowels)
    : randomFrom(unknownConsonants))
    ?? '‰'
  )).join('')
);

export default glyphToTreasurePool;