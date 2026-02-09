import type RichText from "@common/models/richText";
import type { ReactNode } from "react"

const TooltipSurface = (props: {
  children: ReactNode|ReactNode[],
  surfaceRichText?: RichText
}) => {
  const { children, surfaceRichText } = props;

  const classNames = ['tooltip-surface'];
  if (surfaceRichText?.props?.className) classNames.push(surfaceRichText.props?.className);

  return (
    <span {...surfaceRichText?.props} className={classNames.join(' ')}>
      {children}
    </span>
  );
};

export default TooltipSurface;