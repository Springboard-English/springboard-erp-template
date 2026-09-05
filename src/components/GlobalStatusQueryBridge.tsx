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
        const syncQuery = (query: Query) => {
            const message =
                query.state.status === "error"
                    ? getErrorMessage(query.state.error)
                    : null;
            const key = getQueryErrorKey(query);

            if (message) {
                registerErrorStatus(key, message);
                return;
            }

            unregisterErrorStatus(key);
        };

        const syncMutation = (mutation: Mutation) => {
            const message =
                mutation.state.status === "error"
                    ? getErrorMessage(mutation.state.error)
                    : null;
            const key = getMutationErrorKey(mutation);

            if (message) {
                registerErrorStatus(key, message);
                return;
            }

            unregisterErrorStatus(key);
        };

        queryClient.getQueryCache().getAll().forEach(syncQuery);
        queryClient.getMutationCache().getAll().forEach(syncMutation);

        const unsubscribeQueries = queryClient
            .getQueryCache()
            .subscribe((event) => {
                if ("query" in event && event.query) {
                    syncQuery(event.query);
                }
            });
        const unsubscribeMutations = queryClient
            .getMutationCache()
            .subscribe((event) => {
                if ("mutation" in event && event.mutation) {
                    syncMutation(event.mutation);
                }
            });

        return () => {
            unsubscribeQueries();
            unsubscribeMutations();
        };
    }, [queryClient, registerErrorStatus, unregisterErrorStatus]);

    return null;
}
