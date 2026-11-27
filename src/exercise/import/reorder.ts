// Collection-aware reordering for a test's exercises.
//
// A test's questions render as a flat, ordered list, but the student runner
// groups a *section*'s questions onto one page by walking contiguous runs of the
// same section key (see buildPages in lib/exercise-pages.ts). So a section's
// members must stay together and in order: a reorder that interleaved them would
// split one passage across several pages.
//
// This models the flat order as top-level BLOCKS — a standalone question, or a
// whole section (all its questions) — so a section only ever moves as a unit and
// its members reorder within it. Both operations return a new flat id order that
// preserves contiguity by construction. Pure and UI-agnostic: the drag handlers
// in the teacher screen and the AI-import review both drive it (dnd-kit yields
// from/to indices, which is exactly what these take).

/** One orderable question: its stable id and the section it belongs to. */
export interface Orderable {
  id: string;
  // The section's key when this question is part of one; null for a standalone
  // question (no collection, or one that sits directly under a part). Only a
  // section groups — matching the runner's paging.
  sectionKey: string | null;
}

/** A contiguous top-level unit: a standalone question, or a whole section. */
export interface OrderBlock {
  sectionKey: string | null;
  ids: string[];
}

/**
 * Group a flat ordered list into top-level blocks. Consecutive items sharing a
 * non-null section key collapse into one section block; everything else is a
 * singleton. Input order is otherwise preserved.
 */
export function toBlocks(items: Orderable[]): OrderBlock[] {
  const blocks: OrderBlock[] = [];
  for (const item of items) {
    const last = blocks[blocks.length - 1];
    if (item.sectionKey !== null && last && last.sectionKey === item.sectionKey) {
      last.ids.push(item.id);
    } else {
      blocks.push({ sectionKey: item.sectionKey, ids: [item.id] });
    }
  }
  return blocks;
}

/** Flatten blocks back to a flat id order. */
export function flattenBlocks(blocks: OrderBlock[]): string[] {
  return blocks.flatMap((block) => block.ids);
}

/** Immutable arrayMove — out-of-range or no-op returns a copy unchanged. */
function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  if (from < 0 || from >= next.length || to < 0 || to >= next.length) return next;
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/**
 * Reorder the top-level blocks, moving the block at `from` to `to`. A section
 * block carries all its questions, so sections always move as a unit and never
 * interleave. Returns the new flat id order.
 */
export function reorderBlocks(
  items: Orderable[],
  from: number,
  to: number,
): string[] {
  return flattenBlocks(arrayMove(toBlocks(items), from, to));
}

/**
 * Reorder the questions inside one section, moving the item at `from` to `to`
 * within that section's block only. Indices are positions within the section, so
 * a question can never leave it this way (move the whole section with
 * `reorderBlocks`) — contiguity always holds. Returns the new flat id order.
 */
export function reorderWithinSection(
  items: Orderable[],
  sectionKey: string,
  from: number,
  to: number,
): string[] {
  const blocks = toBlocks(items);
  const block = blocks.find((b) => b.sectionKey === sectionKey);
  if (!block) return items.map((item) => item.id);
  block.ids = arrayMove(block.ids, from, to);
  return flattenBlocks(blocks);
}

/**
 * Where a question lands once it has JOINED a group: directly after the group's
 * last other member, with every other question keeping its place.
 *
 * Two things put a question into a group without putting it next to the group:
 * `test_key` on a create appends the new link to the end of the test, and moving
 * a question to another section changes its collection but not its link's order.
 * Either way the section is left split in two, and the runner pages the stray
 * question away from the passage it belongs to.
 *
 * Membership is a predicate rather than a section key because a PART is a group
 * too: a question filed on the part itself belongs after the part's sections,
 * which is where the rail draws it. A group with no other member leaves the
 * order as it is — for a link just created that is the end of the test, which
 * is right for a group that is new.
 */
export function placeAfterGroup(
  order: string[],
  movedId: string,
  inGroup: (id: string) => boolean,
): string[] {
  const rest = order.filter((id) => id !== movedId);
  let last = -1;
  rest.forEach((id, index) => {
    if (inGroup(id)) last = index;
  });
  if (last < 0) return order.slice();
  rest.splice(last + 1, 0, movedId);
  return rest;
}
