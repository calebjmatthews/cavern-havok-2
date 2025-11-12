export default class EncounterPeaceful implements EncounterPeacefulInterface {
  id: string = '';
  type: 'peaceful' = 'peaceful';
  getIntroText: () => string = () => '';
};

interface EncounterPeacefulInterface {
  id: string;
  type: 'peaceful';
  getIntroText: () => string;
};