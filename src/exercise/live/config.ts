// Where the live runner sends people, set once by the app at boot with
// `configureLiveRunner`, as `configureApi` sets the API's base URL. The routes
// are the app's own; the runner only needs to build them.

import { useAuth } from "../../context/AuthContext";
import { isGuestAccountType } from "./roles";

export interface LiveRunnerOptions {
  /** Where the play routes live; the join screen is `<base>/<code>`, the runner `<base>/<code>/run`. */
  playBase: string;
  /** Home for a signed-in account, or null to show no home link. */
  homeHref: string | null;
  /** The product a sitting names in the tab title and the notice to AI assistants. */
  productName: string;
}

const options: LiveRunnerOptions = { playBase: "/play", homeHref: "/", productName: "Springboard Leap" };

/** The product name a sitting is signed with. */
export function liveRunnerProductName(): string {
  return options.productName;
}

/** Set the play routes' base and home before the runner renders. */
export function configureLiveRunner(next: Partial<LiveRunnerOptions>): void {
  Object.assign(options, next);
}

/** The join screen for a run's code. */
export function playJoinRoute(code: string): string {
  return `${options.playBase}/${encodeURIComponent(code)}`;
}

/** The runner for a run's code. */
export function playRunRoute(code: string): string {
  return `${playJoinRoute(code)}/run`;
}

/** Home for whoever is signed in; the waiting room's "Leave for now". */
export function homeRouteForAccountType(accountType?: string | null): string {
  void accountType;
  return options.homeHref ?? "/";
}

/**
 * Where "home" is for whoever is looking, or null when they have none: a
 * signed-out visitor, or a guest on a public link, whose account belongs to
 * no workspace. Callers omit the link then.
 */
export function useHomeHref(): string | null {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return null;
  if (isGuestAccountType(user?.account_type as string | undefined)) return null;
  return options.homeHref;
}
