import { cn } from "../../lib/utils";
import { CategoryPill } from "../components/category-pill";
import type { SpringboardTest } from "../lib/exercises";

// In-page section anchors for mixed tests. Chips jump to the first exercise of
// each skill section (Reading / Vocabulary & Grammar / Writing / Listening).
export function SectionNav({ test, currentIndex, onJump }: { test: SpringboardTest; currentIndex: number; onJump: (index: number) => void }) {
  // First node index per skill, in order of appearance.
  const sections: { skill: SpringboardTest["nodes"][number]["skillTag"]; index: number }[] = [];
  test.nodes.forEach((node, index) => {
    if (!sections.some((s) => s.skill === node.skillTag)) sections.push({ skill: node.skillTag, index });
  });
  const activeSkill = test.nodes[currentIndex]?.skillTag;

  if (sections.length < 2) return null;
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {sections.map((section) => (
        <button
          key={section.skill}
          type="button"
          onClick={() => onJump(section.index)}
          className={cn("inline-flex min-h-11 items-center rounded-full transition-opacity md:pointer-fine:min-h-9", section.skill === activeSkill ? "opacity-100" : "opacity-55 hover:opacity-100")}
        >
          <CategoryPill skill={section.skill} />
        </button>
      ))}
    </div>
  );
}
