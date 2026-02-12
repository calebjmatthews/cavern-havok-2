import type RichText from "@common/models/richText";
import { TERMS } from "@common/enums";

const terms: { [id: string] : (RichText | string)[] } = {
  [TERMS.DEFENSE]: [`Protects against damage, but expires at the end of the round.`],
  [TERMS.FAST]: [`Typically occurrs at the beginning of the round, before other actions.`],
  [TERMS.SLOW]: [`Typically occurrs at the end of the round, after other actions.`],
  [TERMS.CHARGE]: [`Fighters gain one Charge at the end of each round. Charge is used up by certain powerful moves.`],
  [TERMS.FRONT]: [`The first target in each row on the opposing side, excluding downed fighters.`],
  [TERMS.INJURY]: [`The amount of damage taken, i.e. maximum health minus current health.`],
  [TERMS.CURSE]: [`A lasting negative effect, most decline by one point at the end of each round.`],
  [TERMS.BLESSING]: [`A lasting positive effect, most decline by one point at the end of each round.`],
};

export default terms;