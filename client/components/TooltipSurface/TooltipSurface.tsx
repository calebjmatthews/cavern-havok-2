import { useRef, useState, type ReactNode, type RefObject } from "react";

import type RichText from "@common/models/richText";
import Tooltip from "./Tooltip";

const TooltipSurface = (props: {
  children: ReactNode|ReactNode[],
  tooltipContents: RichText | string
  surfaceRichText?: RichText,
}) => {
  const { children, surfaceRichText, tooltipContents } = props;

  const surfaceRef: RefObject<HTMLButtonElement | null> = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const classNames = ['btn-text tooltip-surface'];
  if (surfaceRichText?.props?.className) classNames.push(surfaceRichText.props?.className);

  const surfaceClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={surfaceRef}
        {...surfaceRichText?.props}
        className={classNames.join(' ')}
        onClick={surfaceClick}
      >
        {children}
      </button>
      <Tooltip
        surfaceRef={surfaceRef}
        contents={tooltipContents}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default TooltipSurface;