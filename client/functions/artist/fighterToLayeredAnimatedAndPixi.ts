import type Fighter from "@common/models/fighter";
import type CycleLayer from "@client/models/artist/cycleLayer";
import type EquipmentPiece from "@common/models/equipmentPiece";
import LayeredAnimated from "@client/models/artist/layeredAnimated";
import cycleLayers from "@client/instances/artist/cycleLayers";
import cycleLayersToPixis from './cycleLayersToPixis';
import { LAYERED_ANIMATED_STATE_DEFAULT } from "@common/constants";

const fighterToLayeredAnimatedAndPixis = (args: {
  fighter: Fighter,
  equipOrder: string[]
}) => {
  const { fighter } = args;
  const cycleLayerArray = createCycleLayerArray(args);

  const { pixiContainer, pixiAnimatedSpriteMap } = cycleLayersToPixis(
    { cycleLayerArray, containerId: fighter.id, state: LAYERED_ANIMATED_STATE_DEFAULT }
  );

  return {
    layeredAnimated: new LayeredAnimated({
      id: fighter.id,
      state: LAYERED_ANIMATED_STATE_DEFAULT,
      stateDefault: LAYERED_ANIMATED_STATE_DEFAULT,
      cycleLayers: cycleLayerArray
    }),
    pixiContainer,
    pixiAnimatedSpriteMap
  };
};

export const createCycleLayerArray = (args: {
  fighter: Fighter,
  equipOrder: string[]
}) => {
  const { fighter, equipOrder } = args;
  const cycleLayerArray: CycleLayer[] = [];
  const slotsFilled: { [slot: string] : boolean } = {};
  const equippedMap: { [id: string] : EquipmentPiece } = {};
  fighter.equipped.forEach((e) => equippedMap[e.id] = e);
  equipOrder.forEach((id) => {
    const piece = equippedMap[id];
    if (!piece) return;
    const cycleLayer = cycleLayers[piece.equipmentId];
    // ToDo: Handle arrays of cycleLayers
    if (cycleLayer && !slotsFilled[cycleLayer.slot]) {
      cycleLayerArray.push(cycleLayer);
      slotsFilled[cycleLayer.slot] = true;
    };
  });

  return cycleLayerArray;
};

export default fighterToLayeredAnimatedAndPixis;