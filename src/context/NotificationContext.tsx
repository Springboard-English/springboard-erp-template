import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { fetchUserNotifications, dismissNotification } from "../api_calls/notifications";
import type { UserNotification } from "../api_calls/notifications";

const POLL_INTERVAL_MS = 5 * 60 * 1000;

function isActive(n: UserNotification): boolean {
    const now = Date.now();
    if (n.start_time && new Date(n.start_time).getTime() > now) return false;
    if (n.end_time && new Date(n.end_time).getTime() < now) return false;
    return true;
}

export interface NotificationContextValue {
    immediate: UserNotification[];
    urgent: UserNotification[];
    informative: UserNotification[];
    unreadCount: number;
    dismiss: (key: string) => void;
    refetch: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [allNotifications, setAllNotifications] = useState<UserNotification[]>([]);
    const [dismissedKeys, setDismissedKeys] = useState<Set<string>>(new Set());
    const fetchingRef = useRef(false);

    const doFetch = useCallback(async () => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        try {
            const data = await fetchUserNotifications();
            setAllNotifications(data);
        } catch {
            // swallow — don't surface notification fetch errors to UI
        } finally {
            fetchingRef.current = false;
        }
    }, []);

    const refetch = useCallback(() => {
        void doFetch();
    }, [doFetch]);

    useEffect(() => {
        if (!isAuthenticated) {
            setAllNotifications([]);
            setDismissedKeys(new Set());
            return;
        }

        void doFetch();
        const interval = setInterval(refetch, POLL_INTERVAL_MS);
        const onFocus = () => { void doFetch(); };
        window.addEventListener("focus", onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [isAuthenticated, doFetch, refetch]);

    const dismiss = useCallback((key: string) => {
        setDismissedKeys((prev) => new Set([...prev, key]));
        void dismissNotification(key);
    }, []);

    const activeVisible = allNotifications.filter(
        (n) => isActive(n) && !dismissedKeys.has(n.appsheet_key),
    );

    const immediate = activeVisible.filter((n) => n.priority === "IMMEDIATE");
    const urgent = activeVisible.filter((n) => n.priority === "URGENT");
    const informative = activeVisible.filter((n) => n.priority === "INFORMATIVE");
    const unreadCount = activeVisible.length;

    return (
        <NotificationContext.Provider
            value={{ immediate, urgent, informative, unreadCount, dismiss, refetch }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications(): NotificationContextValue {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
    return ctx;
}
