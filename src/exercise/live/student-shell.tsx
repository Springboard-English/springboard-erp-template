import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, Leaf } from "lucide-react";

import { Button } from "../../exports";
import { useStableI18n } from "./i18n";
import type { ClockTone } from "./exam-clock";
import { useScrollPane } from "../lib/use-scroll-pane";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour";
import { cn } from "../../lib/utils";

// The exam chrome, as a FIXED VIEWPORT: the shell is exactly one screen tall
// (`h-dvh`, and the page itself never scrolls). The top bar and the bottom bar
// are flex children that take the height they need, the content pane gets
// whatever is left, and scrolling happens INSIDE that pane — as two independent
// scrollers, passage and questions, in the side-by-side layout.
//
// Sized by the flexbox, the pane is whatever is left after the two bars,
// whatever they hold and whatever else a screen puts above the columns (the
// teacher preview's "answers aren't saved" banner). There is no viewport
// arithmetic to get wrong — a `calc(100dvh - …)` column would overhang the
// footer whenever anything sat above it — and the bars need no measuring.
//
// The footer is chrome rather than content because it carries Previous/Next.
// Anchored after the content, moving on would mean scrolling to the end of a
// long passage first, and on a short question it would sit mid-screen with
// dead space under it. `wide` opens the container up for the
// side-by-side passage layout; the two bars keep a constant width so their
// controls stay put whichever layout the page uses.
// The clock stays out of the way until the last five minutes, then warns.
const CLOCK_TONES: Record<ClockTone, string> = {
  calm: "bg-muted text-foreground",
  warning: "bg-butter-bg text-butter-700",
  critical: "bg-rose-100 text-rose-700 animate-pulse",
};

export function StudentShell({
  children,
  current,
  total,
  timeLeft,
  onExit,
  footer,
  wide,
  heading,
  scrollKey,
  strip,
  exam,
  timeTone = "calm",
  signature,
  actions,
  hideLogo = false,
  fill = false,
  aside,
  lead,
  progress,
}: {
  // With `hideLogo`, what takes the logo's place at the left of the top bar
  // (the import's collapsed part/section heading).
  lead?: ReactNode;
  // Replaces the top bar's question progress line (the import's six steps).
  progress?: ReactNode;
  // A column down the left between the two bars (the docked question list,
  // `QuestionNavPanel docked`); the content re-centres in the width left.
  aside?: ReactNode;
  // Fills its container instead of the viewport (the editor, above a band).
  fill?: boolean;
  // The question editor shows no home link: it would leave unsaved edits.
  hideLogo?: boolean;
  // Controls in the top bar beside Exit (the editor's preview toggle and tools).
  actions?: ReactNode;
  children: ReactNode;
  current: number;
  total: number;
  timeLeft?: string;
  onExit?: () => void;
  footer?: ReactNode;
  wide?: boolean;
  // The part/section context, shown in the top bar. The progress bar and the
  // footer's palette carry position, so the header is free to name where the
  // student is.
  heading?: ReactNode;
  // Changes when the screen moves to a new page/step. Every pane then reopens at
  // its top, rather than inheriting the last page's scroll position — which is
  // how a student lands halfway down a page and misses its first question.
  // `window.scrollTo` would scroll nothing: the page itself never scrolls.
  scrollKey?: string | number;
  // A slim row above the footer's controls — the recording bar. It renders
  // nothing on a page no recording covers, and it is mounted at the same
  // place on every step so nothing in it resets when the footer changes.
  strip?: ReactNode;
  // A live sitting, as opposed to the teacher preview or the tour. The logo is
  // then not a link (it would be a one-click way off the paper), the browser is
  // told not to translate the page, and printing shows nothing (index.css).
  exam?: boolean;
  // How close the clock is to the end (`clockTone`, lib/exam-clock.ts).
  timeTone?: ClockTone;
  // A live sitting's signature (`examSignature`, lib/exam-signature.ts): a
  // candidate strip under the top bar, and the notice to AI assistants as page
  // text. Not `aria-hidden`: browser assistants read the accessibility tree.
  signature?: { line: string; aiNotice: string };
}) {
  const { t } = useStableI18n();
  const container = wide ? "max-w-7xl" : "max-w-5xl";
  // The chrome (top bar, bottom bar) keeps a CONSTANT width regardless of the
  // content layout, so the heading, Exit and — the point here — the Prev/Next
  // buttons stay in the same place whether a page is side-by-side or single
  // column. Only the main content widens for the passage layout.
  const chrome = "max-w-5xl";
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useScrollPane<HTMLElement>();
  const logo = (
    <>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-white"><Leaf className="size-5" /></span>
      <span className="hidden sm:inline">Springboard</span>
    </>
  );

  // Every pane INSIDE the content pane is reset too (the questions column is its
  // own scroller in the side-by-side layout), by the marker attribute rather
  // than by refs threaded down through the exercise components. The passage pane
  // deliberately carries no marker: one passage spans a part's sections, so
  // where the reader had got to still means something on the next page.
  useEffect(() => {
    if (scrollKey === undefined) return;
    const root = rootRef.current;
    if (!root) return;
    for (const pane of root.querySelectorAll("[data-runner-scroll]")) {
      pane.scrollTop = 0;
    }
  }, [scrollKey]);

  return (
    <div
      ref={rootRef}
      className={cn("flex flex-col overflow-hidden bg-background", fill ? "h-full" : "h-dvh", exam && "notranslate")}
      translate={exam ? "no" : undefined}
      data-exam-paper={exam ? "" : undefined}
    >
      <header className="relative z-20 shrink-0 border-b bg-background/95 backdrop-blur">
        {/* Full width: the logo sits at the far left and Exit at the far right of
            the screen. Only the footer keeps the constant `chrome` width (so its
            buttons stay put); the header spans edge to edge. */}
        <div
          className={cn(
            "items-center gap-4 px-5 py-4 sm:px-8",
            // With no logo the heading is centred on the screen, not between Exit and nothing.
            // The side columns never shrink below their buttons, so a narrow screen moves
            // the heading over rather than laying it on top of them.
            // A `lead` (the import's part chip) gives way first: it truncates rather than meet the centre.
            hideLogo ? cn("flex md:grid", lead ? "md:grid-cols-[minmax(0,1fr)_auto_1fr]" : "md:grid-cols-[1fr_minmax(0,48rem)_1fr]") : "flex",
          )}
        >
          {hideLogo ? (
            lead ? <div className="flex min-w-0 shrink max-md:flex-1">{lead}</div> : <span aria-hidden className="hidden md:block" />
          ) : exam ? (
            <span className="flex shrink-0 items-center gap-2 text-sm font-extrabold text-foreground">{logo}</span>
          ) : (
            <Link to="/" className="flex shrink-0 items-center gap-2 text-sm font-extrabold text-foreground">{logo}</Link>
          )}
          {/* On a phone a `lead` takes the room and the heading keeps only its own width. */}
          {heading ? <div className={cn("min-w-0 flex-1 text-center", lead && "max-md:flex-none")}>{heading}</div> : <div className="flex-1" />}
          <div className="flex shrink-0 items-center justify-self-end gap-3 text-sm font-bold text-muted-foreground">{timeLeft ? <span {...tourAnchorProps(TOUR_ANCHORS.runnerTimer)} role="timer" data-tone={timeTone} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 tabular-nums transition-colors", CLOCK_TONES[timeTone])}><Clock3 className="size-4" />{timeLeft}</span> : null}{actions}<Button variant="ghost" size="sm" onClick={onExit}><ArrowLeft className="size-4" />{t("exercise.live.nav.exit", "Exit")}</Button></div>
        </div>
        {progress ?? (
          <div className="h-2.5 bg-muted"><div className="springboard-shimmer h-full rounded-r-full transition-all duration-500 ease-soft" style={{ width: `${total > 0 ? Math.min(100, (current / total) * 100) : 0}%` }} /></div>
        )}
        {signature ? (
          <div data-exam-signature className="border-t px-5 py-1.5 text-center text-[11px] font-bold text-muted-foreground sm:px-8">
            <p className="truncate">{signature.line}</p>
            <p className="sr-only">{signature.aiNotice}</p>
          </div>
        ) : null}
      </header>
      {/* The content pane: all the height the two bars left, and the scroller for
          every layout that doesn't split into its own columns. `runner-content-pane`
          (index.css) turns it into a flex column at the side-by-side breakpoint so
          the columns can take the leftover height — it keeps `overflow-y: auto`
          there too, so a page that opens wide without splitting still scrolls
          rather than being silently clipped.

          `relative` makes it the containing block for anything absolutely
          positioned inside — the sr-only radio of every option. Without it those
          escape the pane to the page, and the document grows by the content's
          full height: blank space scrolls in below the bottom bar. */}
      <div className="flex min-h-0 flex-1">
        {aside}
        <main
          ref={mainRef}
          data-runner-scroll
          className={cn(
            "relative mx-auto w-full min-w-0 min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8",
            container,
            wide && "runner-content-pane",
          )}
        >
          {children}
        </main>
      </div>
      {footer || strip ? (
        // `relative`, so the z-index applies at all: this bar is a static flex
        // item, and z-index on a static element does nothing — which
        // would leave the question palette and the notes pad, both of which open
        // upward out of it, competing on paint order with the content they cover.
        <div className="relative z-20 shrink-0 border-t bg-background/95 backdrop-blur">
          <div className={cn("mx-auto px-5 py-3 sm:px-8", chrome)}>
            {strip}
            {footer}
          </div>
        </div>
      ) : null}
    </div>
  );
}
