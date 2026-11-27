import { describe, expect, it } from "vitest";

import { chainsBy } from "./save-chains";

describe("chainsBy", () => {
  it("keeps each key's items together, in their order", () => {
    const items = [
      { id: 1, key: "a" },
      { id: 2, key: "b" },
      { id: 3, key: "a" },
      { id: 4, key: "b" },
      { id: 5, key: "a" },
    ];
    expect(chainsBy(items, (item) => item.key).map((chain) => chain.map((item) => item.id))).toEqual([
      [1, 3, 5],
      [2, 4],
    ]);
  });

  it("gives an item with no key a chain of its own", () => {
    const items = [{ id: 1 }, { id: 2, key: "a" }, { id: 3 }];
    expect(
      chainsBy(items, (item: { id: number; key?: string }) => item.key).map((chain) => chain.map((item) => item.id)),
    ).toEqual([[1], [2], [3]]);
  });
});
