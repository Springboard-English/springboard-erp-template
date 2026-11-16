import type { CollectionStub } from "../types";
import type { ExerciseNode } from "./exercises";

/** One run of questions in the navigator: its part, its section, and their indices. */
export interface NavGroup {
  key: string;
  /** Set on the first group of a part, so its title prints once. */
  part: CollectionStub | null;
  section: CollectionStub | null;
  indices: number[];
}

/**
 * The paper's questions as the navigator lists them: consecutive runs that
 * share a section (or, outside sections, a part), each carrying its part only
 * where a new part starts.
 */
export function navGroups(
  nodes: ExerciseNode[],
  collectionByNode: Map<string, CollectionStub | null> | undefined,
): NavGroup[] {
  const groups: NavGroup[] = [];
  let lastPart: string | null | undefined;
  nodes.forEach((node, index) => {
    const stub = collectionByNode?.get(node.id) ?? null;
    const section = stub?.kind === "section" ? stub : null;
    const part = stub?.kind === "part" ? stub : (stub?.parent ?? null);
    const key = section?.appsheet_key ?? part?.appsheet_key ?? "";
    const current = groups[groups.length - 1];
    if (current && current.key === key) {
      current.indices.push(index);
      return;
    }
    const partKey = part?.appsheet_key ?? null;
    groups.push({ key, part: partKey !== lastPart ? part : null, section, indices: [index] });
    lastPart = partKey;
  });
  return groups;
}

/**
 * `ids` with the ids in `ordered` rearranged into that order, each landing in
 * one of the slots those ids held; every other id keeps its place, and an id
 * not in `ids` is ignored. How a section reordered in the navigator becomes
 * the paper's new order.
 */
export function placeInOrder(ids: string[], ordered: string[]): string[] {
  // An id no longer in the list drops out, so the run fills exactly its slots.
  const present = new Set(ids);
  const run = ordered.filter((id) => present.has(id));
  const moving = new Set(run);
  let next = 0;
  return ids.map((id) => (moving.has(id) ? run[next++] : id));
}
