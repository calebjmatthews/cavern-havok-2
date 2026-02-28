import type { EnchantmentMod } from "@common/models/enchantment";

const applyMod = (value: number, mod: EnchantmentMod) => {
  if (mod.extentKind === 'multiplicative') {
    return value * (mod.extent ?? 2);
  }
  return value + (mod.extent ?? 1);
};

export default applyMod;