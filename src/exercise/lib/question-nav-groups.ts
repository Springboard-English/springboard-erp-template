import type { CollectionStub } from "../types";
import type { ExerciseNode } from "./exercises";

/** One run of questions in the navigator: its part, its section, and their indices. */
export interface NavGroup {
  key: string;
  /** Set on the first group of a part, so its title prints once. */
  part: CollectionStub | null;
  /** The part this run sits in, on every group of it; null outside any part. */
  partKey: string | null;
  section: CollectionStub | null;
  indices: number[];
}

/** A part's runs as the editor's list draws them: its own questions, then its section cards. */
export interface NavPartBlock {
  partKey: string | null;
  /** The runs outside any section (the part's own questions), drawn before the cards. */
  loose: NavGroup[];
  /** One run per section, in paper order. */
  sections: NavGroup[];
}

/** `groups` split into consecutive part blocks, each with its own runs before its sections. */
export function navPartBlocks(groups: NavGroup[]): NavPartBlock[] {
  const blocks: NavPartBlock[] = [];
  for (const group of groups) {
    let block = blocks[blocks.length - 1];
    // A new block where the part changes, or where loose questions follow sections.
    if (!block || block.partKey !== group.partKey || (!group.section && block.sections.length > 0)) {
      block = { partKey: group.partKey, loose: [], sections: [] };
      blocks.push(block);
    }
    (group.section ? block.sections : block.loose).push(group);
  }
  return blocks;
}

/**
 * The node ids of `sections` after moving the section at `from` to `to`, each
 * section's questions kept together and in order. Handed to `onReorder` as the
 * part's run, so `placeInOrder` lays it into the slots those sections held.
 */
export function moveSection(nodes: ExerciseNode[], sections: NavGroup[], from: number, to: number): string[] {
  const next = sections.slice();
  const [moved] = next.splice(from, 1);
  if (moved) next.splice(to, 0, moved);
  return next.flatMap((group) => group.indices.map((index) => nodes[index].id));
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
    groups.push({ key, part: partKey !== lastPart ? part : null, partKey, section, indices: [index] });
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

/** A part's blocks together (a part can split into several when loose questions follow its sections). */
export interface NavPartUnit {
  partKey: string | null;
  blocks: NavPartBlock[];
  /** Every section run in the part, in paper order. */
  sections: NavGroup[];
}

/** `blocks` gathered into one unit per consecutive part. */
export function navPartUnits(blocks: NavPartBlock[]): NavPartUnit[] {
  const units: NavPartUnit[] = [];
  for (const block of blocks) {
    const last = units[units.length - 1];
    if (last && last.partKey === block.partKey) {
      last.blocks.push(block);
      last.sections.push(...block.sections);
    } else {
      units.push({ partKey: block.partKey, blocks: [block], sections: [...block.sections] });
    }
  }
  return units;
}

/**
 * A part or section dropped somewhere new in the editor's list: a part to
 * `index` among the parts, or a section to `index` among `toPartKey`'s sections
 * (its own part or another). The host moves the collection; the list redraws
 * from the paper it gets back.
 */
export type CollectionMove =
  | { kind: "part"; key: string; index: number }
  | { kind: "section"; key: string; toPartKey: string; index: number };

/** The drag id of a part's card in the editor's list. */
export const partDragId = (partKey: string) => `part:${partKey}`;
/** The drag id of a section's card (its first index keeps a repeated section's runs apart). */
export const sectionDragId = (group: NavGroup) => `section:${group.key}:${group.indices[0]}`;

/**
 * The move a drop makes: `active` dragged onto `over` (both drag ids), or null
 * when it moves nothing. A part lands at the dropped-on part's place; a section
 * lands at the dropped-on section's place, or at the end of a dropped-on part.
 */
export function collectionDrop(units: NavPartUnit[], active: string, over: string): CollectionMove | null {
  if (active === over) return null;
  const parts = units.filter((unit) => unit.partKey !== null);
  const partAt = (id: string) => parts.findIndex((unit) => partDragId(unit.partKey!) === id);
  if (active.startsWith("part:")) {
    const from = partAt(active);
    const to = partAt(over);
    if (from < 0 || to < 0 || from === to) return null;
    return { kind: "part", key: parts[from].partKey!, index: to };
  }
  const findSection = (id: string) => {
    for (const unit of parts) {
      const index = unit.sections.findIndex((group) => sectionDragId(group) === id);
      if (index >= 0) return { unit, index };
    }
    return null;
  };
  const from = findSection(active);
  if (!from || !from.unit.sections[from.index].section) return null;
  const key = from.unit.sections[from.index].key;
  const target = findSection(over);
  if (target) {
    if (target.unit === from.unit && target.index === from.index) return null;
    return { kind: "section", key, toPartKey: target.unit.partKey!, index: target.index };
  }
  const part = partAt(over);
  if (part < 0) return null;
  const unit = parts[part];
  // Onto its own part's card: to the end of that part.
  const index = unit === from.unit ? unit.sections.length - 1 : unit.sections.length;
  if (unit === from.unit && from.index === index) return null;
  return { kind: "section", key, toPartKey: unit.partKey!, index };
}
