import type RichText from "@common/models/richText";
import "./richTextRenderer.css";
import TooltipSurface from "../TooltipSurface/TooltipSurface";

const RichTextRenderer = (props: {
  richText: RichText,
  depth?: number
}) => {
  const { richText, depth: argDepth } = props;
  const depth = argDepth || 0;
  let classNames;
 
  switch(richText.tag) {
    case 'section':
      classNames = ['rich-text-section'];
      if (richText.props?.className) classNames.push(richText.props?.className);
      return (
        <section {...richText.props}>
          {richText.contents?.map((content, index) => (
            <RichTextContent
              key={`section-${depth}-${index}`}
              content={content}
              depth={depth}
            />
          ))}
        </section>
      );

    case 'span':
      classNames = ['rich-text-span'];
      if (richText.props?.className) classNames.push(richText.props?.className);
      if (typeof richText.contents?.[0] === 'string'
        && (richText.contents || []).length === 1) {
        return (
          <span {...richText.props} className={classNames.join(' ')}>
            {richText.contents[0]}
          </span>
        );
      }
      return (
        <span {...richText.props} className={classNames.join(' ')}>
          {richText.contents?.map((content, index) => (
              <>
                <RichTextContent
                  key={`span-${depth}-${index}`}
                  content={content}
                  depth={depth}
                />
                <span>{` `}</span>
              </>
            ))}
        </span>
      );

    case 'Term':
    case 'Obstacle':
    case 'CharacterClass':
    case 'Alteration':
    case 'TooltipSurface':
      if (typeof richText.contents?.[0] === 'string') {
        return (
          <TooltipSurface surfaceRichText={richText}>
              {richText.contents[0]}
          </TooltipSurface>
        );
      };
  };

  return null;
};

const RichTextContent = (props: {
  content: RichText|string,
  depth: number
}) => {
  const { content, depth } = props;

  if (typeof content === 'string') {
    return <>{content}</>;
  };
  return <RichTextRenderer
    richText={content}
    depth={depth+1}
  />;
};

export default RichTextRenderer;