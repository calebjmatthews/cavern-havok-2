import type CycleLayer from './cycleLayer';

export default class LayeredAnimated implements LayeredAnimatedInterface {
  id: string = '';
  state: string = '';
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