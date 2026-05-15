import { getSessionActionEndpoint } from "../config/api";
import { Session } from "../api_calls/UserData";

export type SessionRow = Session & {
  id: string;
  join_url?: string;
  start_url?: string;
};

export function toSessionRows(
  sessions: Session[],
  offset = 0,
): SessionRow[] {
  return sessions.map((session, index) => {
    const appsheetKey = session.appsheet_key;

    return {
      ...session,
      id:
        appsheetKey ||
        `${session.class_name}-${session.timestamp}-${offset + index}`,
      join_url: appsheetKey
        ? getSessionActionEndpoint(appsheetKey, "join")
        : session.join_url,
      start_url: appsheetKey
        ? getSessionActionEndpoint(appsheetKey, "start")
        : session.start_url,
    };
  });
}
