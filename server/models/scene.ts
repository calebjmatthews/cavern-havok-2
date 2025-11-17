import type Account from "@common/models/account";
import type SceneState from "@common/models/sceneState";
import type { PayloadSceneStart } from "@common/communicator/payload";
import MessageServer from "@common/communicator/message_server";
import { sceneStateEmpty } from "@common/models/sceneState";
import { MESSAGE_KINDS } from "@common/enums";
const MEK = MESSAGE_KINDS;

export default class Scene implements SceneInterface {
  id: string = '';
  chamberKind: string = '';
  chamberIndex: number = 0;
  accounts: { [id: string] : Account } = {};
  state: SceneState = sceneStateEmpty;
  isFinishRoom?: boolean;
  sendMessage?: (message: MessageServer) => void;
  concludeScene?: (scene: Scene) => void;

  constructor(scene: SceneInterface) {
    Object.assign(this, scene);
  };

  beginScene() {
    const payload: PayloadSceneStart = {
      kind: MEK.SCENE_START,
      sceneState: this.state
    };
    const messages = Object.values(this.accounts).map((account) => (
      new MessageServer({ accountId: account.id, payload })
    ));
    messages.forEach((message) => this.sendMessage?.(message));
  };

  attachSendMessage(sendMessageFunction: (message: MessageServer) => void) {
    this.sendMessage = sendMessageFunction;
  };

  attachConcludeScene(concludeSceneFunction: (scene: Scene) => void) {
    this.concludeScene = concludeSceneFunction;
  };
};

export interface SceneInterface {
  id: string;
  chamberKind: string;
  chamberIndex: number;
  accounts: { [id: string] : Account };
  state: SceneState;
  isFinishRoom?: boolean;
  sendMessage?: (message: MessageServer) => void;
  concludeScene?: (scene: Scene) => void;
};