import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { describe, expect, it } from "vitest";

import GlobalStatusQueryBridge from "../GlobalStatusQueryBridge";
import { GlobalStatusProvider, useGlobalStatus } from "../../context/GlobalStatusContext";

/**
 * A failed request is reported while its screen is up, and leaves with it —
 * not when the request next succeeds, which for a record that 404s is never.
 */

function StatusLine() {
    const { status } = useGlobalStatus();
    return <p data-testid="status">{status ? `${status.tone}:${status.message}` : "none"}</p>;
}

function FailingQuery() {
    useQuery({
        queryKey: ["failing"],
        queryFn: async () => {
            throw new Error("Record not found");
        },
        retry: false,
    });
    return null;
}

function FailingMutation() {
    const mutation = useMutation({
        mutationFn: async () => {
            throw new Error("Delete failed");
        },
    });
    const { mutate } = mutation;
    useEffect(() => mutate(), [mutate]);
    return null;
}

function Harness({ screen: initial }: { screen: "query" | "mutation" }) {
    const [shown, setShown] = useState(true);
    return (
        <>
            <GlobalStatusQueryBridge />
            <StatusLine />
            <button type="button" onClick={() => setShown(false)}>
                leave
            </button>
            {shown ? initial === "query" ? <FailingQuery /> : <FailingMutation /> : null}
        </>
    );
}

function renderHarness(kind: "query" | "mutation") {
    const client = new QueryClient();
    render(
        <QueryClientProvider client={client}>
            <GlobalStatusProvider>
                <Harness screen={kind} />
            </GlobalStatusProvider>
        </QueryClientProvider>,
    );
}

/** Row one's save fails only after row two's has taken the hook over. */
function OverlappingMutations() {
    const { mutate } = useMutation({
        mutationFn: (row: number) =>
            new Promise<void>((resolve, reject) =>
                row === 1
                    ? setTimeout(() => reject(new Error("Row 1 failed")), 50)
                    : setTimeout(resolve, 5),
            ),
    });
    const [settled, setSettled] = useState(false);
    useEffect(() => {
        mutate(1);
        mutate(2);
        const timer = setTimeout(() => setSettled(true), 120);
        return () => clearTimeout(timer);
    }, [mutate]);
    return settled ? <p>settled</p> : null;
}

describe("GlobalStatusQueryBridge", () => {
    it("ignores a run that fails after its hook has moved on", async () => {
        render(
            <QueryClientProvider client={new QueryClient()}>
                <GlobalStatusProvider>
                    <GlobalStatusQueryBridge />
                    <StatusLine />
                    <OverlappingMutations />
                </GlobalStatusProvider>
            </QueryClientProvider>,
        );

        await screen.findByText("settled");
        expect(screen.getByTestId("status").textContent).toBe("none");
    });

    it("shows a failed query while it is read, and drops it once nothing reads it", async () => {
        renderHarness("query");
        await waitFor(() =>
            expect(screen.getByTestId("status").textContent).toBe("error:Record not found"),
        );

        screen.getByText("leave").click();
        await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("none"));
    });

    it("shows a failed mutation until its component unmounts", async () => {
        renderHarness("mutation");
        await waitFor(() =>
            expect(screen.getByTestId("status").textContent).toBe("error:Delete failed"),
        );

        screen.getByText("leave").click();
        await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("none"));
    });
});
