import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDetailEditor, type DetailEditorQuery } from "../useDetailEditor";

/**
 * The editor replaces hand-written form/original/edited_at/outdated state in
 * the apps' detail views, so these pin the parts a view relied on: what is
 * sent, with which `edited_at`, and what a refetch or a conflict does to edits.
 */

interface Post {
    key: string;
    title: string;
    seats: number;
    edited_at: string;
}
interface PostForm {
    title: string;
    seats: string;
}
type PostPatch = Partial<{ title: string; seats: number }>;

const CONFLICT = new Error(
    "edited_at is older than the current value. Refresh data and retry with a newer edited_at",
);

const post = (over: Partial<Post> = {}): Post => ({
    key: "p1",
    title: "Brief",
    seats: 2,
    edited_at: "2026-01-01T00:00:00Z",
    ...over,
});

const toForm = (record: Post): PostForm => ({ title: record.title, seats: String(record.seats) });
const buildPatch = (form: PostForm, original: PostForm): PostPatch => {
    const out: PostPatch = {};
    if (form.title.trim() !== original.title.trim()) out.title = form.title.trim();
    if (form.seats !== original.seats) out.seats = Number(form.seats);
    return out;
};

function setup(initial: Post, patch: (body: PostPatch & { edited_at: string }) => Promise<Post | void>) {
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    let server = initial;
    const refetch = vi.fn(async () => ({ data: server }));
    const onSaved = vi.fn();
    const hook = renderHook(
        ({ data }: { data: Post | undefined }) => {
            const query: DetailEditorQuery<Post> = { data, refetch };
            return useDetailEditor({
                query,
                toForm,
                buildPatch,
                patch,
                onSaved,
                section: "Post",
                fieldLabels: { title: "Title" },
            });
        },
        { wrapper, initialProps: { data: initial as Post | undefined } },
    );
    return {
        ...hook,
        refetch,
        onSaved,
        setServer: (next: Post) => {
            server = next;
        },
    };
}

describe("useDetailEditor", () => {
    it("seeds the form from the query and reports no changes", () => {
        const { result } = setup(post(), vi.fn());
        expect(result.current.form).toEqual({ title: "Brief", seats: "2" });
        expect(result.current.original).toEqual(result.current.form);
        expect(result.current.isDirty).toBe(false);
        expect(result.current.pendingBarProps.pendingCount).toBe(0);
        expect(result.current.outdatedDialogProps.open).toBe(false);
    });

    it("is empty until the record loads", () => {
        const { result } = setup(undefined as unknown as Post, vi.fn());
        expect(result.current.form).toBeNull();
        expect(result.current.record).toBeNull();
    });

    it("derives the patch and Review rows from the edits", () => {
        const { result } = setup(post(), vi.fn());
        act(() => result.current.setField("title", "New brief"));
        act(() => result.current.setForm((form) => ({ ...form, seats: "3" })));
        expect(result.current.changes).toEqual({ title: "New brief", seats: 3 });
        expect(result.current.isFieldPending("title")).toBe(true);
        expect(result.current.pendingItems).toEqual([
            { section: "Post", key: "Title", value: "New brief" },
            { section: "Post", key: "seats", value: "3" },
        ]);
        act(() => result.current.pendingBarProps.onCancel());
        expect(result.current.isDirty).toBe(false);
        expect(result.current.form).toEqual({ title: "Brief", seats: "2" });
    });

    it("sends only the changes with the record's edited_at and re-seeds from the answer", async () => {
        const saved = post({ title: "New brief", edited_at: "2026-01-02T00:00:00Z" });
        const patch = vi.fn(async () => saved);
        const { result, onSaved, refetch } = setup(post(), patch);
        act(() => result.current.setField("title", "New brief"));
        let ok = false;
        await act(async () => {
            ok = await result.current.save();
        });
        expect(ok).toBe(true);
        expect(patch).toHaveBeenCalledWith(
            { title: "New brief", edited_at: "2026-01-01T00:00:00Z" },
            expect.objectContaining({ key: "p1" }),
        );
        expect(refetch).not.toHaveBeenCalled();
        expect(onSaved).toHaveBeenCalledWith(saved);
        expect(result.current.record).toBe(saved);
        expect(result.current.isDirty).toBe(false);
    });

    it("refetches when the PATCH answers with nothing", async () => {
        const { result, refetch, setServer } = setup(post(), vi.fn(async () => undefined));
        setServer(post({ title: "New brief", edited_at: "2026-01-02T00:00:00Z" }));
        act(() => result.current.setField("title", "New brief"));
        await act(async () => {
            await result.current.save();
        });
        expect(refetch).toHaveBeenCalledTimes(1);
        expect(result.current.record?.edited_at).toBe("2026-01-02T00:00:00Z");
    });

    it("sends nothing when nothing changed", async () => {
        const patch = vi.fn();
        const { result } = setup(post(), patch);
        await act(async () => {
            expect(await result.current.save()).toBe(true);
        });
        expect(patch).not.toHaveBeenCalled();
    });

    it("submits another body with the same edited_at", async () => {
        const patch = vi.fn(async () => post({ edited_at: "2026-01-03T00:00:00Z" }));
        const { result } = setup(post(), patch);
        await act(async () => {
            await result.current.submit({ seats: 9 });
        });
        expect(patch).toHaveBeenCalledWith({ seats: 9, edited_at: "2026-01-01T00:00:00Z" }, expect.anything());
    });

    it("re-seeds on a refetch only while there are no edits", () => {
        const { result, rerender } = setup(post(), vi.fn());
        rerender({ data: post({ title: "Theirs", edited_at: "2026-01-05T00:00:00Z" }) });
        expect(result.current.form?.title).toBe("Theirs");

        act(() => result.current.setField("seats", "5"));
        rerender({ data: post({ title: "Later", edited_at: "2026-01-06T00:00:00Z" }) });
        // The edits stay, against the record they were made on.
        expect(result.current.form).toEqual({ title: "Theirs", seats: "5" });
        expect(result.current.record?.edited_at).toBe("2026-01-05T00:00:00Z");
    });

    it("opens the outdated dialog on a conflict, and Refresh re-seeds from the server", async () => {
        const patch = vi.fn(async () => {
            throw CONFLICT;
        });
        const { result, refetch, setServer } = setup(post(), patch);
        act(() => result.current.setField("title", "Mine"));
        let ok = true;
        await act(async () => {
            ok = await result.current.save();
        });
        expect(ok).toBe(false);
        expect(result.current.outdatedDialogProps.open).toBe(true);
        // The dialog reports it; the mutation error is cleared for the status bar.
        expect(result.current.error).toBeNull();
        expect(result.current.form?.title).toBe("Mine");

        setServer(post({ title: "Theirs", edited_at: "2026-01-09T00:00:00Z" }));
        await act(async () => {
            await result.current.outdatedDialogProps.onRefreshData();
        });
        expect(refetch).toHaveBeenCalled();
        expect(result.current.outdatedDialogProps.open).toBe(false);
        expect(result.current.form?.title).toBe("Theirs");
        expect(result.current.isDirty).toBe(false);
    });

    it("keeps the edits when the outdated dialog is dismissed", async () => {
        const { result } = setup(
            post(),
            vi.fn(async () => {
                throw CONFLICT;
            }),
        );
        act(() => result.current.setField("title", "Mine"));
        await act(async () => {
            await result.current.save();
        });
        act(() => result.current.outdatedDialogProps.onCancelAction());
        expect(result.current.outdatedDialogProps.open).toBe(false);
        expect(result.current.form?.title).toBe("Mine");
    });

    it("leaves any other failure on error and keeps the edits", async () => {
        const failure = new Error("Server unavailable");
        const { result } = setup(
            post(),
            vi.fn(async () => {
                throw failure;
            }),
        );
        act(() => result.current.setField("title", "Mine"));
        await act(async () => {
            expect(await result.current.save()).toBe(false);
        });
        await waitFor(() => expect(result.current.error).toBe(failure));
        expect(result.current.outdatedDialogProps.open).toBe(false);
        expect(result.current.isDirty).toBe(true);
    });
});
