import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

export type GlobalStatusTone = 'info' | 'error';

export type GlobalStatus = {
    message: string;
    tone: GlobalStatusTone;
};

type GlobalStatusContextValue = {
    status: GlobalStatus | null;
    setStatus: (message: string, tone?: GlobalStatusTone) => void;
    clearStatus: () => void;
    registerErrorStatus: (key: string, message: string) => void;
    unregisterErrorStatus: (key: string) => void;
    registerLoadingStatus: (key: string, message: string) => void;
    unregisterLoadingStatus: (key: string) => void;
};

const GlobalStatusContext = createContext<GlobalStatusContextValue | undefined>(undefined);

export function GlobalStatusProvider({ children }: { children: ReactNode }) {
    const [manualStatus, setManualStatus] = useState<GlobalStatus | null>(null);
    const [errorVersion, setErrorVersion] = useState(0);
    const [loadingVersion, setLoadingVersion] = useState(0);
    const errorStatusesRef = useRef(new Map<string, string>());
    const loadingStatusesRef = useRef(new Map<string, string>());

    const currentErrorStatus = useMemo<GlobalStatus | null>(() => {
        const values = Array.from(errorStatusesRef.current.values());
        if (values.length === 0) {
            return null;
        }

        return {
            message: values[values.length - 1],
            tone: 'error',
        };
    }, [errorVersion]);

    const currentLoadingStatus = useMemo<GlobalStatus | null>(() => {
        const values = Array.from(loadingStatusesRef.current.values());
        if (values.length === 0) {
            return null;
        }

        return {
            message: values[values.length - 1],
            tone: 'info',
        };
    }, [loadingVersion]);

    const status = manualStatus ?? currentErrorStatus ?? currentLoadingStatus;

    const setStatus = useCallback((message: string, tone: GlobalStatusTone = 'info') => {
        const trimmed = message.trim();
        if (!trimmed) {
            setManualStatus(null);
            return;
        }

        setManualStatus({
            message: trimmed,
            tone,
        });
    }, []);

    const clearStatus = useCallback(() => {
        setManualStatus(null);
    }, []);

    const registerErrorStatus = useCallback((key: string, message: string) => {
        const normalizedKey = key.trim();
        const normalizedMessage = message.trim();

        if (!normalizedKey || !normalizedMessage) {
            return;
        }

        errorStatusesRef.current.delete(normalizedKey);
        errorStatusesRef.current.set(normalizedKey, normalizedMessage);
        setErrorVersion((value) => value + 1);
    }, []);

    const unregisterErrorStatus = useCallback((key: string) => {
        const normalizedKey = key.trim();
        if (!normalizedKey) {
            return;
        }

        if (errorStatusesRef.current.delete(normalizedKey)) {
            setErrorVersion((value) => value + 1);
        }
    }, []);

    const registerLoadingStatus = useCallback((key: string, message: string) => {
        const normalizedKey = key.trim();
        const normalizedMessage = message.trim();

        if (!normalizedKey || !normalizedMessage) {
            return;
        }

        loadingStatusesRef.current.delete(normalizedKey);
        loadingStatusesRef.current.set(normalizedKey, normalizedMessage);
        setLoadingVersion((value) => value + 1);
    }, []);

    const unregisterLoadingStatus = useCallback((key: string) => {
        const normalizedKey = key.trim();
        if (!normalizedKey) {
            return;
        }

        if (loadingStatusesRef.current.delete(normalizedKey)) {
            setLoadingVersion((value) => value + 1);
        }
    }, []);

    useEffect(() => {
        return () => {
            errorStatusesRef.current.clear();
            loadingStatusesRef.current.clear();
        };
    }, []);

    const value = useMemo(
        () => ({
            status,
            setStatus,
            clearStatus,
            registerErrorStatus,
            unregisterErrorStatus,
            registerLoadingStatus,
            unregisterLoadingStatus,
        }),
        [
            status,
            setStatus,
            clearStatus,
            registerErrorStatus,
            unregisterErrorStatus,
            registerLoadingStatus,
            unregisterLoadingStatus,
        ],
    );

    return (
        <GlobalStatusContext.Provider value={value}>
            {children}
        </GlobalStatusContext.Provider>
    );
}

export function useGlobalStatus() {
    const context = useContext(GlobalStatusContext);

    if (!context) {
        throw new Error('useGlobalStatus must be used within a GlobalStatusProvider');
    }

    return context;
}

/**
 * The context, or `undefined` when there is no provider above.
 *
 * For chrome that wants to *display* the status if an app happens to publish
 * one — `DashboardLayout` renders for apps with and without the provider, so it
 * cannot use the throwing hook. A call site that *sets* status should keep
 * using `useGlobalStatus`: needing the provider is the right contract there.
 */
export function useGlobalStatusOptional() {
    return useContext(GlobalStatusContext);
}
