import { createContext, useContext, type ReactNode } from "react";

import type { RequestTiming, WindowTimes } from "./media-window";

// Who controls a recording, and where its URL comes from, for whatever screen
// hosts a recording deck. A context rather than a prop because the deck, the
// bar and every page's status line all read it, and the screen alone knows
// whether this is a live sitting or a teacher listening.

/** A playable URL, plus the window it is valid in when the server controls it. */
export interface ResolvedMedia {
  url: string;
  startedAt?: string;
  endsAt?: string;
  /** The server's clock mid-request; a sharper offset than the Date header. */
  serverNow?: string;
  /** When the request carrying `serverNow` left and came back, on this device. */
  timing?: RequestTiming;
  /** Server minus device (ms) by the best reading so far; when set, used over `serverNow`. */
  offsetMs?: number;
}

export interface MediaPlayback {
  /** The server decides when it plays (a live sitting). False: play at will. */
  controlled: boolean;
  /** Each student opens their own window with Play (a share room). */
  selfPaced: boolean;
  /** By recording key. `fresh` asks past any cache — sent after a URL failed. */
  resolve: (recordingKey: string, fresh?: boolean) => Promise<ResolvedMedia>;
  /** Class runs only: every window the teacher opened for the room, by recording key. */
  roomWindows: Record<string, WindowTimes>;
  /** Server time minus device time, in ms. */
  serverOffsetMs: number;
  /** Self-paced: this student's own windows, by recording key. */
  ownWindows: Record<string, WindowTimes>;
  /** A seek the player snapped back, for the teacher's risk breakdown. */
  reportSeek?: (recordingKey: string, fromS: number, toS: number) => void;
}

/** Nothing to fetch from. */
export const NO_MEDIA_PLAYBACK: MediaPlayback = {
  controlled: false,
  selfPaced: false,
  resolve: () => Promise.reject(new Error("This recording can’t be played here.")),
  roomWindows: {},
  serverOffsetMs: 0,
  ownWindows: {},
};

const MediaPlaybackContext = createContext<MediaPlayback>(NO_MEDIA_PLAYBACK);

export function MediaPlaybackProvider({
  value,
  children,
}: {
  value: MediaPlayback;
  children: ReactNode;
}) {
  return <MediaPlaybackContext.Provider value={value}>{children}</MediaPlaybackContext.Provider>;
}

export function useMediaPlayback(): MediaPlayback {
  return useContext(MediaPlaybackContext);
}

/** Teacher playback: unlimited plays, scrubbing allowed, by recording key. */
export function teacherPlayback(
  fetchUrl: (recordingKey: string, fresh?: boolean) => Promise<{ url: string }>,
): MediaPlayback {
  return {
    ...NO_MEDIA_PLAYBACK,
    resolve: async (recordingKey, fresh) => {
      const { url } = await fetchUrl(recordingKey, fresh);
      return { url };
    },
  };
}
