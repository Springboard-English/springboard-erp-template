import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePersistentSearch } from "../viewFilterState";

beforeEach(() => sessionStorage.clear());

describe("usePersistentSearch", () => {
  it("applies the trimmed draft on submit and reports it", () => {
    const onSearch = vi.fn();
    const { result } = renderHook(() => usePersistentSearch("cases", { onSearch }));

    act(() => result.current.setDraft("  ca27 "));
    expect(result.current.query).toBe("");
    expect(result.current.pending).toBe(true);
    expect(onSearch).not.toHaveBeenCalled();

    act(() => result.current.submit());
    expect(result.current.query).toBe("ca27");
    expect(result.current.pending).toBe(false);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("clears the applied search the moment the box is emptied", () => {
    const onSearch = vi.fn();
    const { result } = renderHook(() => usePersistentSearch("cases", { onSearch }));
    act(() => result.current.fieldProps.onChange("x"));
    act(() => result.current.fieldProps.onSubmit());
    act(() => result.current.fieldProps.onChange(""));
    expect(result.current.query).toBe("");
    expect(result.current.draft).toBe("");
    expect(onSearch).toHaveBeenCalledTimes(2);
  });

  it("restores draft and search per scope, under the keys the apps already store", () => {
    const first = renderHook(() => usePersistentSearch("classes"));
    act(() => first.result.current.setDraft("abc"));
    act(() => first.result.current.submit());
    act(() => first.result.current.setDraft("abcd"));
    first.unmount();

    expect(JSON.parse(sessionStorage.getItem("view_filters:classes") ?? "{}")).toEqual({ q: "abc", qd: "abcd" });

    const again = renderHook(() => usePersistentSearch("classes"));
    expect(again.result.current.query).toBe("abc");
    expect(again.result.current.draft).toBe("abcd");

    const other = renderHook(() => usePersistentSearch("groups"));
    expect(other.result.current.query).toBe("");
  });

  it("clear empties both", () => {
    const { result } = renderHook(() => usePersistentSearch("s"));
    act(() => result.current.setDraft("q"));
    act(() => result.current.submit());
    act(() => result.current.clear());
    expect(result.current.draft).toBe("");
    expect(result.current.query).toBe("");
  });
});
