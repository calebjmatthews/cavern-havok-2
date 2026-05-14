import type CycleLayer from './cycleLayer';

export default class LayeredAnimated implements LayeredAnimatedInterface {
  id: string = '';
  state: string = '';
  // ToDo: Create a changeable stateDefault, so temporary states like being damaged can return to something like clenched or critical.
  stateDefault: string = '';
  cycleLayers: CycleLayer[] = [];

  constructor(layeredAnimated: LayeredAnimatedInterface) {
    Object.assign(this, layeredAnimated);
  };
};

interface LayeredAnimatedInterface {
  id: string;
  state: string;
  stateDefault: string;
  cycleLayers: CycleLayer[];
};