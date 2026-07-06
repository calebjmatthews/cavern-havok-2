import type RichText from "@common/models/richText";
import { TERMS } from "@common/enums";

const terms: { [id: string] : (RichText | string)[] } = {
  [TERMS.DEFENSE]: [`Protects against damage, but expires at the end of the round.`],
  [TERMS.FAST]: [`Typically occurrs at the beginning of the round, before other actions.`],
  [TERMS.SLOW]: [`Typically occurrs at the end of the round, after other actions.`],
  [TERMS.CHARGE]: [`Fighters gain one Charge at the end of each round. Charge is used up by certain powerful moves.`],
  [TERMS.FRONT]: [`The closest target in each row on the enemy side, excluding downed fighters.`],
  [TERMS.INJURY]: [`How much a fighter is currently wounded, i.e. maximum health minus current health.`],
  [TERMS.CURSE]: [`A lasting negative effect, most decline by one point at the end of each round.`],
  [TERMS.BLESSING]: [`A lasting positive effect, most decline by one point at the end of each round.`],
  [TERMS.KNOCKED_OUT]: [`A fighter's health has hit zero or lower. They can be healed like normal, but can't act until their health is raised above zero.`]
};

export default terms;