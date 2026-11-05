// In-app feedback surveys through Springboard's Formbricks. The only module
// that imports `@formbricks/js`, loaded on the first report rather than at app
// start. Which survey shows, how often and to whom is set in Formbricks; an app
// only reports moments.

import { useEffect } from "react";

import { issueRespondentPass } from "./respondentPass";
import { embeddedData, feedbackActionName, mayAsk, type FeedbackContext } from "./rules";

type Formbricks = (typeof import("@formbricks/js"))["default"];

/** How an app turns feedback on. Not configured (or `null`) = off: no script, no requests. */
export interface FeedbackOptions {
  appUrl: string;
  workspaceId: string;
  /** Prefix of every action this app reports, e.g. `leap` → `leap_run_submitted`. */
  app: string;
  /** Only a production build fires real actions; everything else fires the `dev_` twins. */
  isProduction: boolean;
  /** Every context key the app sends; unset ones are cleared on each report. */
  contextKeys: readonly string[];
  /** Ask guests on public links too. */
  askGuests?: boolean;
  /** Sent as `app_version` unless a report sets its own. */
  appVersion?: string;
}

// The SDK's survey container (js-core CONTAINER_ID). Hidden by CSS while an app
// says it is busy, whatever opened it: a no-code trigger set in the dashboard
// runs on every route, not only on the moments the app reports.
const CONTAINER_ID = "formbricks-modal-container";
const SUPPRESSED_ATTRIBUTE = "data-feedback-suppressed";
const STYLE_ID = "feedback-suppression-style";
// The embedded field the Formbricks fork reads a respondent pass from.
const PASS_FIELD = "sb_pass";

let options: FeedbackOptions | null = null;
let sdk: Promise<Formbricks | null> | null = null;
let suppressions = 0;
let warned = false;

/** Turn feedback on (or off with `null`) for this app. Call once at boot. */
export function configureFeedback(next: FeedbackOptions | null): void {
  options = next;
}

function warnOnce(error: unknown): void {
  if (warned) return;
  warned = true;
  console.warn("Feedback surveys are unavailable:", error);
}

function ensureSuppressionStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `html[${SUPPRESSED_ATTRIBUTE}] #${CONTAINER_ID}{display:none!important}`;
  document.head.appendChild(style);
}

/** Load and set up the SDK once. Resolves `null` (and stays off) on any failure. */
function loadSdk(config: FeedbackOptions): Promise<Formbricks | null> {
  sdk ??= import("@formbricks/js")
    .then(async ({ default: formbricks }) => {
      ensureSuppressionStyle();
      // A survey that opens while the app is busy is dropped outright, so it
      // cannot appear the moment the busy screen closes either.
      formbricks.on("formbricks_survey_shown", () => {
        if (suppressions > 0) document.getElementById(CONTAINER_ID)?.remove();
      });
      await formbricks.setup({ workspaceId: config.workspaceId, appUrl: config.appUrl });
      return formbricks;
    })
    .catch((error: unknown) => {
      warnOnce(error);
      return null;
    });
  return sdk;
}

/**
 * Report one moment. A no-op when feedback is off, while the app is busy, or
 * for someone `mayAsk` excludes. Never throws: feedback must never break the
 * screen that reports it. With `identify` (the default) a respondent pass rides
 * along so the answer is tied to the account; if the pass call fails the answer
 * is still recorded, unattributed.
 */
export async function trackFeedback(
  moment: string,
  context: FeedbackContext,
  { identify = true }: { identify?: boolean } = {},
): Promise<void> {
  const config = options;
  if (!config || suppressions > 0 || !mayAsk(context.role, config.askGuests ?? false)) return;
  try {
    const formbricks = await loadSdk(config);
    if (!formbricks) return;
    const pass = identify ? await issueRespondentPass().then((issued) => issued.token, () => null) : null;
    await formbricks.setEmbeddedData({
      ...embeddedData(
        { ...context, app_version: context.app_version ?? config.appVersion },
        [...config.contextKeys, "role", "app_version"],
      ),
      [PASS_FIELD]: pass,
    });
    await formbricks.track(feedbackActionName(config.app, moment, config.isProduction));
  } catch (error) {
    warnOnce(error);
  }
}

// No sign-out hook: every report rewrites every context key and the pass, and
// the SDK's bag lives in memory only, which a sign-out's full-page redirect
// discards.

/**
 * Hide and block every survey while `active`: an exam, a tour, a live class —
 * anything a popup must not cover. Survives nesting; the last one out lifts it.
 */
export function useFeedbackSuppressed(active: boolean): void {
  useEffect(() => {
    if (!active || !options) return;
    ensureSuppressionStyle();
    suppressions += 1;
    document.documentElement.setAttribute(SUPPRESSED_ATTRIBUTE, "");
    // Already open when the busy screen appeared: take it down now.
    document.getElementById(CONTAINER_ID)?.remove();
    return () => {
      suppressions -= 1;
      if (suppressions === 0) document.documentElement.removeAttribute(SUPPRESSED_ATTRIBUTE);
    };
  }, [active]);
}
