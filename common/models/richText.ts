export default interface RichText {
  tag: 'section' | 'p' | 'span' | 'RichText' | 'Term' | 'Obstacle' | 'CharacterClass'
    | 'Alteration' | 'TooltipSurface';
  props?: any;
  contents?: (RichText | string)[];
};