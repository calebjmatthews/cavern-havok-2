import { ADVENTURE_KINDS } from "@common/enums";
import type AdventureKind from "@common/models/adventureKind";

const prismaticFalls: AdventureKind = {
  id: ADVENTURE_KINDS.PRISMATIC_FALLS,
  name: "Prismatic Falls",
  description: `Diaphanous sheets of many-colored water fall from cracks in the All-Cavern roof. All kinds of floatsam and treasure can be found being buoyed down the waterfalls. Expect to fight off bubbles, moles, and other treasure hunters to get your hands on it.`,
};

export default prismaticFalls;