import Encounter from "@server/models/encounter";
import { ENCOUNTERS } from "@server/enums";

const encounterEmpty = new Encounter({
  id: ENCOUNTERS.MISSING,
  type: 'battle',
  getIntroText: (() => "Intro text missing."),
  victoryText: "Victory text missing.",
  defeatText: `Defeat text missing.`,
  battlefieldSize: [5, 5],
  getFoes: (() => ({})),
  getObstacles: (() => ({}))
});

export default encounterEmpty;