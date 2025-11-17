import type Fighter from "./fighter";
import type Treasure from "./treasure";

export default interface SceneState {
  sceneId: string;
  name: string;
  fighters: { [key: string]: Fighter };
  texts: { introText: string; };
  treasures?: { [accountId: string] : Treasure[] };
};

export const sceneStateEmpty: SceneState = {
  sceneId: '',
  name: '',
  fighters: {},
  texts: { introText: '' }
};