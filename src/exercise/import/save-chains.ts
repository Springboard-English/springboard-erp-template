/**
 * Split `items` into chains that must be saved one after another: the items
 * sharing a key form one chain, in their order in `items`, and an item with no
 * key is a chain of its own. Chains are independent of each other.
 *
 * The import saves a collection's questions as one chain because the API reads
 * `collection_order` as "insert here", clamped to the questions already saved,
 * so the stored order only matches when they arrive in order.
 */
export function chainsBy<T>(items: readonly T[], keyOf: (item: T) => string | undefined): T[][] {
  const chains: T[][] = [];
  const byKey = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    if (key === undefined) {
      chains.push([item]);
      continue;
    }
    let chain = byKey.get(key);
    if (!chain) {
      chain = [];
      byKey.set(key, chain);
      chains.push(chain);
    }
    chain.push(item);
  }
  return chains;
}
