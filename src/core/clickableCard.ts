import type { KeyboardEvent } from "react";

/** The props that make a mobile card's `div` act as a button. */
export interface ClickableCardProps {
  role: "button";
  tabIndex: 0;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Button behaviour for a mobile card that holds a record chevron. A `div` is
 * needed because a link or button can't nest inside a real `button`.
 */
export function clickableCardProps(onOpen: () => void): ClickableCardProps {
  return {
    role: "button",
    tabIndex: 0,
    onClick: onOpen,
    onKeyDown: (event) => {
      // A key pressed on the chevron inside bubbles here and must not open the card too.
      if (event.target !== event.currentTarget) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen();
      }
    },
  };
}
