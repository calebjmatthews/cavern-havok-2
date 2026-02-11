import { useState, useRef, useEffect, type RefObject, type CSSProperties } from 'react';

import type RichText from '@common/models/richText';
import RichTextRenderer from '../RichTextRenderer/RichTextRenderer';
import "./tooltip.css";

function Tooltip(props: {
  surfaceRef: RefObject<HTMLButtonElement | null>,
  contents: RichText | string,
  isOpen: boolean,
  setIsOpen: (isOpenNext: boolean) => void,
  preferredSide?: Side
}) {
  const { surfaceRef, contents, isOpen, setIsOpen, preferredSide: argPreferredSide } = props;
  const preferredSide: Side = argPreferredSide ?? 'top';
  const tooltipRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [position, setPosition] = useState<CSSProperties>({ top: 0, left: 0, visibility: 'hidden' });
  const [arrowSide, setArrowSide] = useState(preferredSide);

  useEffect(() => {
    if (!isOpen || !surfaceRef.current || !tooltipRef.current) return;

    const trigger = surfaceRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 0; // spacing between trigger and tooltip
    const arrowSize = 6; // arrow height/width

    // Define position strategies in priority order
    const positions: Positions = {
      top: {
        top: trigger.top - tooltip.height - gap - arrowSize,
        left: trigger.left + (trigger.width - tooltip.width) / 2,
        side: 'top'
      },
      bottom: {
        top: trigger.bottom + gap + arrowSize,
        left: trigger.left + (trigger.width - tooltip.width) / 2,
        side: 'bottom'
      },
      left: {
        top: trigger.top + (trigger.height - tooltip.height) / 2,
        left: trigger.left - tooltip.width - gap - arrowSize,
        side: 'left'
      },
      right: {
        top: trigger.top + (trigger.height - tooltip.height) / 2,
        left: trigger.right + gap + arrowSize,
        side: 'right'
      }
    };

    // Check if position fits in viewport
    const fitsInViewport = (pos: { top: number, left: number }) => {
      return pos.top >= 0 &&
             pos.left >= 0 &&
             pos.top + tooltip.height <= window.innerHeight &&
             pos.left + tooltip.width <= window.innerWidth;
    };

    // Try preferred position first, then others
    const tryOrder: Side[] = [preferredSide, 'top', 'bottom', 'left', 'right'];
    let finalPos = positions[preferredSide];

    for (const side of tryOrder) {
      const pos = positions[side];
      if (fitsInViewport(pos)) {
        finalPos = pos;
        break;
      }
    }

    // Clamp to viewport as fallback if nothing fits perfectly
    const clampedPos: CSSProperties = {
      top: Math.max(0, Math.min(finalPos.top, window.innerHeight - tooltip.height)),
      left: Math.max(0, Math.min(finalPos.left, window.innerWidth - tooltip.width)),
      visibility: 'visible'
    };

    setPosition(clampedPos);
    setArrowSide(finalPos.side);
  }, [isOpen, preferredSide, surfaceRef]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className='tooltip-background'
        onClick={() => setIsOpen(false)}
      />
      <div
        ref={tooltipRef}
        className='tooltip'
        style={{ ...position }}
      >
        <RichTextRenderer richText={contents} />
        <div
          className={`tooltip-arrow ${arrowSide}`}
        />
      </div>
    </>
  );
};

type Side = 'top' | 'bottom' | 'left' | 'right';
type Positions = {
  [side in Side]: {
    top: number;
    left: number;
    side: Side;
  };
};

export default Tooltip;