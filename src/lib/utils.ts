import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge only knows Tailwind's own easings, so without this a preset's
// `ease-spring-*` and a primitive's `ease-bounce` would both survive and the
// stylesheet's order would pick the winner.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      ease: [
        'soft',
        'bounce',
        'spring-fast-spatial',
        'spring-default-spatial',
        'spring-slow-spatial',
        'spring-fast-effects',
        'spring-default-effects',
        'emphasized-accelerate',
        'emphasized-decelerate',
      ],
    },
  },
});

/** Joins class names and lets a later Tailwind class replace an earlier one it conflicts with. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
