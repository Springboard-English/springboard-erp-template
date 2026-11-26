import { Leaf } from "lucide-react";

/**
 * The runner header's Leap mark: the leaf on a primary-coloured tile. Lucide's
 * leaf sits up and to the right of its box (the stem pulls the box left), so it
 * is nudged back to look centred in the tile.
 */
export function LeapMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-primary text-white">
      <Leaf className="size-5 -translate-x-px translate-y-[1.5px]" aria-hidden />
    </span>
  );
}
