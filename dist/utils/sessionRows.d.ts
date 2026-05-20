import { Session } from "../api_calls/UserData";
export type SessionRow = Session & {
    id: string;
    join_url?: string;
    start_url?: string;
};
export declare function toSessionRows(sessions: Session[], offset?: number): SessionRow[];
