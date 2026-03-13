import { genId } from "@common/functions/utils/random";

export default class RichText implements RichTextInterface {
  id: string;
  tag: 'section' | 'p' | 'span' | 'RichText' | 'Term' | 'Obstacle' | 'CharacterClass'
    | 'Alteration' | 'TooltipSurface';
  props?: any;
  contents?: (RichText | string)[];

  constructor(richText: RichTextInterface) {
    this.id = richText.id ?? genId();
    this.tag = richText.tag;
    if (richText.props) this.props = richText.props
    if (richText.contents) this.contents = convertInterfacesToRichText(richText.contents);
  };
};

const convertInterfacesToRichText = (contents: (RichText | RichTextInterface | string)[]):
  (RichText | string)[] => (
  contents.map((content) => {
    if (typeof content === 'string') return content;
    const contentAsRichText: RichText = (content instanceof RichText)
      ? content : new RichText(content);
    return contentAsRichText;
  })
);

export interface RichTextInterface {
  id?: string;
  tag: 'section' | 'p' | 'span' | 'RichText' | 'Term' | 'Obstacle' | 'CharacterClass'
    | 'Alteration' | 'TooltipSurface';
  props?: any;
  contents?: (RichText | RichTextInterface | string)[];
}