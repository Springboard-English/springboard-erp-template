import { useEffect } from "react";
import { useQueryClient, type Mutation, type Query } from "@tanstack/react-query";
import { useGlobalStatus } from "@/context/GlobalStatusContext";

function getErrorMessage(error: unknown): string | null {
    if (error instanceof Error) {
        const message = error.message.trim();
        return message || null;
    }

    if (typeof error === "string") {
        const message = error.trim();
        return message || null;
    }

    return null;
}

function getQueryErrorKey(query: Query): string {
    return `query:${query.queryHash}`;
}

function getMutationErrorKey(mutation: Mutation): string {
    return `mutation:${String(mutation.mutationId)}`;
}

export default function GlobalStatusQueryBridge() {
    const queryClient = useQueryClient();
    const { registerErrorStatus, unregisterErrorStatus } = useGlobalStatus();

    useEffect(() => {
        const syncQuery = (query: Query, removed = false) => {
            // Only a query something on screen still reads: a failed detail
            // left behind must not keep the bar red on every later page.
            const message =
                !removed &&
                query.state.status === "error" &&
                query.getObserversCount() > 0
                    ? getErrorMessage(query.state.error)
                    : null;
            const key = getQueryErrorKey(query);

            if (message) {
                registerErrorStatus(key, message);
                return;
            }

            unregisterErrorStatus(key);
        };

        const syncMutation = (mutation: Mutation, detached = false) => {
            const message =
                !detached && mutation.state.status === "error"
                    ? getErrorMessage(mutation.state.error)
                    : null;
            const key = getMutationErrorKey(mutation);

            if (message) {
                registerErrorStatus(key, message);
                return;
            }

            unregisterErrorStatus(key);
        };

        // Mutations are not synced on mount: one that failed before the bridge
        // mounted belongs to a screen that is gone, and they expose no
        // observer count to tell otherwise.
        queryClient.getQueryCache().getAll().forEach((query) => syncQuery(query));

        const unsubscribeQueries = queryClient
            .getQueryCache()
            .subscribe((event) => {
                if ("query" in event && event.query) {
                    syncQuery(event.query, event.type === "removed");
                }
            });
        // useMutation detaches when its component unmounts or it mutates
        // again. A detached run that fails afterwards (several rows saved at
        // once) has nobody to show it to, so it stays out of the bar.
        const detached = new WeakSet<Mutation>();
        const unsubscribeMutations = queryClient
            .getMutationCache()
            .subscribe((event) => {
                if (!("mutation" in event) || !event.mutation) {
                    return;
                }
                if (event.type === "observerRemoved") {
                    detached.add(event.mutation);
                } else if (event.type === "observerAdded") {
                    detached.delete(event.mutation);
                }
                syncMutation(
                    event.mutation,
                    event.type === "removed" || detached.has(event.mutation),
                );
            });

        return () => {
            unsubscribeQueries();
            unsubscribeMutations();
        };
    }, [queryClient, registerErrorStatus, unregisterErrorStatus]);

    return null;
}
