import TooltipSurface from "../TooltipSurface/TooltipSurface";
import RichText from "@common/models/richText";
import terms from "@common/instances/terms";
import alterations from "@common/instances/alterations";
import { Fragment } from "react/jsx-runtime";
import { obstacleKinds } from "@common/instances/obstacle_kinds";
import { characterClasses } from "@common/instances/character_classes";
import "./richTextRenderer.css";

const RichTextRenderer = (props: {
  richText: RichText | string,
  depth?: number
}) => {
  const { richText, depth: argDepth } = props;
  const depth = argDepth ?? 0;
  let classNames;

  if (typeof richText === 'string') return (
    <>{richText}</>
  );
 
  switch(richText.tag) {
    case 'section':
      classNames = ['rich-text-section'];
      if (richText.props?.className) classNames.push(richText.props?.className);
      return (
        <section {...richText.props}>
          {richText.contents?.map((content, index) => (
            <RichTextContent
              key={`${richText.id}-${depth}-${index}`}
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
            <Fragment key={`${richText.id}-${depth}-${index}`}>
              <RichTextContent
                content={content}
                depth={depth}
              />
              {(
                (index < ((richText.contents?.length ?? 0) - 1)
                && !followingCharacterIsComma(richText, index)
              )) && (
                <span>{` `}</span>
              )}
            </Fragment>
          ))}
        </span>
      );

    case 'Term':
    case 'Obstacle':
    case 'CharacterClass':
    case 'Alteration':
      if (typeof richText.contents?.[0] === 'string') {
        let description: (RichText | string)[] = [];
        if (richText.tag === 'Term') {
          description = terms[richText.contents[0]] ?? ['Term missing!'];
        }
        else if (richText.tag === 'Obstacle') {
          description = obstacleKinds[richText.contents[0]]?.description ?? ['Obstacle missing!'];
        }
        else if (richText.tag === 'CharacterClass') {
          description = [characterClasses[richText.contents[0]]?.description
            ?? 'Character class missing!'];
        }
        else if (richText.tag === 'Alteration') {
          description = alterations[richText.contents[0]]?.getDescription()
            ?? ['Alteration missing!'];
        };

        const tooltipRichText = new RichText({
          tag: 'section',
          props: {
            className: 'term-tooltip'
          },
          contents: [
            {
              tag: 'span',
              props: { className: 'text-large' },
              contents: [richText.contents[0]]
            }, {
              tag: 'span',
              contents: description
            }
          ]
        });

        return (
          <Fragment key={`${richText.id}-${depth}`}>
            <TooltipSurface surfaceRichText={richText} tooltipContents={tooltipRichText}>
              {richText.contents[0]}
            </TooltipSurface>
            {(
              (0 < ((richText.contents?.length ?? 0) - 1)
              && !followingCharacterIsComma(richText, 0)
            )) && (
              <span>{` `}</span>
            )}
          </Fragment>

        );
      };
      return null;

    case 'TooltipSurface':
      return (
        <TooltipSurface
          surfaceRichText={richText}
          tooltipContents={richText.props?.tooltipRichText ?? ''}
        >
          {richText.contents?.map((content, index) => (
            <Fragment key={`${richText.id}-${depth}-${index}`}>
              <RichTextContent
                content={content}
                depth={depth}
              />
              {(
                (index < ((richText.contents?.length ?? 0) - 1)
                && !followingCharacterIsComma(richText, index)
              )) && (
                <span>{` `}</span>
              )}
            </Fragment>
          ))}
        </TooltipSurface>
      );
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

const followingCharacterIsComma = (richText: RichText, index: number) => {
  const followingContent = (richText.contents ?? [])[index + 1];
  if (!followingContent) return false;
  if (typeof followingContent === 'string' && followingContent.slice(0) === ',') return true;
  if (!(typeof followingContent === 'string') && 'contents' in followingContent) {
    const firstNestedContent = followingContent.contents?.[0];
    if (typeof firstNestedContent === 'string' && firstNestedContent.slice(0) === ',') return true;
  };
  return false;
};

export default RichTextRenderer;