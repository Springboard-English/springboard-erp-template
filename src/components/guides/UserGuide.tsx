import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, BookOpenText, ChevronRight, Clock, Hash, ListTree } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export type RawGuides = Record<string, string>;

export type GuideSection = {
  id: string;
  title: string;
  markdown: string;
  subHeadings: Array<{ id: string; title: string }>;
};

export type GuideRecord = {
  slug: string;
  title: string;
  description: string;
  sections: GuideSection[];
};

type GuideImagePreview = {
  src: string;
  alt: string;
};

type UserGuideBaseProps = {
  rawGuides: RawGuides;
  guidesDirectoryLabel?: string;
};

export type UserGuideViewProps = UserGuideBaseProps;

export type GuidesSidebarContentProps = UserGuideBaseProps & {
  collapsed: boolean;
};

type GuideRouteButtonSharedProps = {
  guideRoute: string;
  fallbackRoute: string;
  fallbackUnauthenticatedRoute?: string;
  openLabel?: string;
  closeLabel?: string;
  onAfterNavigate?: () => void;
};

export type GuideIconButtonProps = GuideRouteButtonSharedProps & Omit<React.ComponentProps<typeof Button>, "children">;

export type GuideMenuButtonProps = GuideRouteButtonSharedProps & Omit<React.ComponentProps<"button">, "children">;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function toTitleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseGuide(markdown: string, slug: string): GuideRecord {
  const lines = markdown.split(/\r?\n/);
  const firstH1 = lines.find((line) => line.startsWith("# "));
  const title = firstH1 ? firstH1.replace(/^#\s+/, "").trim() : toTitleFromSlug(slug);
  const withoutH1 = markdown.replace(/^# .+$/m, "").trim();
  const firstSectionStart = withoutH1.search(/^##\s+/m);
  const descriptionBlock = firstSectionStart >= 0 ? withoutH1.slice(0, firstSectionStart) : withoutH1;
  const description = descriptionBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line !== "---")
    .join(" ");
  const sectionsSource = firstSectionStart >= 0 ? withoutH1.slice(firstSectionStart).trim() : "";
  const rawBlocks = sectionsSource
    ? sectionsSource.split(/\n(?=##\s+)/g).filter((block) => block.trim().length > 0)
    : [];

  const sections: GuideSection[] = rawBlocks.map((block, index) => {
    const h2Match = block.match(/^##\s+(.+)$/m);
    const sectionTitle = h2Match?.[1]?.trim() ?? `Section ${index + 1}`;
    const sectionId = `section-${slugify(sectionTitle)}-${index + 1}`;
    const sectionMarkdown = block.replace(/^##\s+.+$/m, "").trim();
    const subHeadings = Array.from(sectionMarkdown.matchAll(/^###\s+(.+)$/gm)).map((match, subIndex) => ({
      title: match[1].trim(),
      id: `${sectionId}-sub-${slugify(match[1])}-${subIndex + 1}`,
    }));

    return { id: sectionId, title: sectionTitle, markdown: sectionMarkdown, subHeadings };
  });

  return { slug, title, description, sections };
}

export function buildGuides(rawGuides: RawGuides): GuideRecord[] {
  return Object.entries(rawGuides)
    .map(([path, content]) => {
      const slug = path.split("/").pop()?.replace(/\.md$/i, "") ?? "guide";
      return parseGuide(content, slug);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function extractPlainText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractPlainText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

function parseCalloutMarker(value: string): { type: "TIP" | "NOTE" | "WARNING"; content: string } | null {
  const match = value.match(/^\s*\[\!(TIP|NOTE|WARNING)\]\s*(.+)\s*$/i);
  if (!match) return null;

  return {
    type: match[1].toUpperCase() as "TIP" | "NOTE" | "WARNING",
    content: match[2].trim(),
  };
}

function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = document.querySelector<HTMLElement>("[data-guides-scroll-container]");
    if (!container) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    };

    update();
    container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, []);

  return progress;
}

function getGuideAccent(slug: string) {
  const accents = [
    { gradient: "from-primary/15", ring: "ring-primary/30", dot: "bg-primary/60" },
    { gradient: "from-sky-500/15", ring: "ring-sky-500/30", dot: "bg-sky-500/60" },
    { gradient: "from-emerald-500/15", ring: "ring-emerald-500/30", dot: "bg-emerald-500/60" },
    { gradient: "from-violet-500/15", ring: "ring-violet-500/30", dot: "bg-violet-500/60" },
    { gradient: "from-amber-500/15", ring: "ring-amber-500/30", dot: "bg-amber-500/60" },
  ];
  const index = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % accents.length;
  return accents[index];
}

function useGuides(rawGuides: RawGuides): GuideRecord[] {
  return useMemo(() => buildGuides(rawGuides), [rawGuides]);
}

function useSelectedGuide(guides: GuideRecord[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedSlug = searchParams.get("guide")?.trim() ?? "";
  const selectedGuide = guides.find((guide) => guide.slug === selectedSlug) ?? guides[0] ?? null;

  useEffect(() => {
    if (!selectedGuide || selectedSlug === selectedGuide.slug) return;

    const nextSearchParams = new URLSearchParams(location.search);
    nextSearchParams.set("guide", selectedGuide.slug);
    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearchParams.toString()}`,
        hash: location.hash,
      },
      { replace: true, state: location.state },
    );
  }, [location.hash, location.pathname, location.search, location.state, navigate, selectedGuide, selectedSlug]);

  const setSelectedGuide = (slug: string) => {
    const nextSearchParams = new URLSearchParams(location.search);
    nextSearchParams.set("guide", slug);
    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearchParams.toString()}`,
        hash: location.hash,
      },
      { state: location.state },
    );
  };

  return { selectedGuide, selectedSlug, setSelectedGuide };
}

function SectionMarkdown({
  markdown,
  sectionId,
  subHeadingIds,
  onImageClick,
}: {
  markdown: string;
  sectionId: string;
  subHeadingIds: string[];
  onImageClick?: (image: GuideImagePreview) => void;
}) {
  let subHeadingCursor = 0;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h3: ({ children }) => {
          const id = subHeadingIds[subHeadingCursor] ?? `${sectionId}-sub-${subHeadingCursor + 1}`;
          subHeadingCursor += 1;
          return (
            <h3 id={id} className="mt-7 scroll-mt-24 flex items-center gap-2.5 text-base font-semibold text-foreground">
              <span className="inline-block h-[1em] w-[3px] shrink-0 rounded-full bg-primary/50" />
              {children}
            </h3>
          );
        },
        h4: ({ children }) => <h4 className="mt-5 text-sm font-semibold text-foreground/80">{children}</h4>,
        p: ({ children }) => {
          const plain = extractPlainText(children);
          const callout = parseCalloutMarker(plain);
          if (!callout) {
            return <p className="mt-3 text-sm leading-7 text-foreground/85">{children}</p>;
          }

          const toneClass =
            callout.type === "TIP"
              ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : callout.type === "WARNING"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300";

          return (
            <div className={cn("mt-4 rounded-xl border px-3 py-3 text-sm leading-6", toneClass)}>
              <span className="mr-2 inline-flex rounded border border-current/30 px-1.5 py-0.5 text-[10px] font-bold tracking-wide">
                {callout.type}
              </span>
              <span>{callout.content}</span>
            </div>
          );
        },
        ul: ({ children }) => <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary/50">{children}</ul>,
        ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary/60 marker:font-medium">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic text-foreground/75">{children}</em>,
        a: ({ href, children }) => (
          <a href={href} className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <div className="mt-4 rounded-r-xl border-l-[3px] border-primary/50 bg-primary/[0.06] px-4 py-3 text-sm italic text-foreground/70">
            {children}
          </div>
        ),
        hr: () => (
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/50" />
            <div className="size-1 rounded-full bg-border" />
            <div className="h-px flex-1 bg-border/50" />
          </div>
        ),
        pre: ({ children }) => (
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border/50 bg-muted/60 p-4 text-xs leading-6 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
            {children}
          </pre>
        ),
        code: ({ children, className }) => (
          <code className={cn("rounded-md bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground/90", className)}>
            {children}
          </code>
        ),
        table: ({ children }) => (
          <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
            <Table>{children}</Table>
          </div>
        ),
        thead: ({ children }) => <TableHeader>{children}</TableHeader>,
        tbody: ({ children }) => <TableBody>{children}</TableBody>,
        tr: ({ children }) => <TableRow>{children}</TableRow>,
        th: ({ children }) => <TableHead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wide">{children}</TableHead>,
        td: ({ children }) => <TableCell>{children}</TableCell>,
        img: ({ src, alt }) => {
          const resolvedSrc = typeof src === "string" ? src.trim() : "";
          if (!resolvedSrc) return null;

          const resolvedAlt = alt ?? "";
          return (
            <button
              type="button"
              onClick={() => onImageClick?.({ src: resolvedSrc, alt: resolvedAlt })}
              className="mt-4 block w-full rounded-xl border border-border/50 bg-muted/15 p-1.5 text-left transition-colors hover:bg-muted/30"
            >
              <img src={resolvedSrc} alt={resolvedAlt} className="max-h-[28rem] w-full rounded-lg object-contain" />
              <span className="mt-2 block text-xs text-muted-foreground">Click to expand</span>
            </button>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

function GuideImageDialog({
  image,
  onClose,
}: {
  image: GuideImagePreview | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(image)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex w-[94vw] max-w-none flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-[94vw]">
        <DialogHeader className="border-b border-border/70 px-6 py-4 text-left">
          <DialogTitle>{image?.alt?.trim() || "Image Preview"}</DialogTitle>
        </DialogHeader>
        {image ? (
          <div className="p-3">
            <img src={image.src} alt={image.alt} className="max-h-[calc(100dvh-10rem)] w-full rounded-md object-contain" />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function GuideHero({ guide }: { guide: GuideRecord }) {
  const totalWords = guide.sections.reduce((acc, section) => acc + section.markdown.split(/\s+/).length, 0);
  const readMinutes = Math.max(1, Math.round(totalWords / 200));
  const accent = getGuideAccent(guide.slug);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card px-7 py-7 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent", accent.gradient)} />
      <div className="pointer-events-none absolute -right-12 -top-12 size-52 rounded-full bg-primary/[0.04]" />
      <div className="pointer-events-none absolute -right-5 -top-5 size-28 rounded-full bg-primary/[0.05]" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-1.5">
          <BookOpenText className="size-3.5 text-primary/70" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">User Guide</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{guide.title}</h1>
        {guide.description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/75">{guide.description}</p> : null}
        <div className="mt-4 flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hash className="size-3" />
            <span>{guide.sections.length} {guide.sections.length === 1 ? "section" : "sections"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>{readMinutes} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidesEmptyState({ guidesDirectoryLabel = "src/content/guides" }: { guidesDirectoryLabel?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]">
      <BookOpenText className="mx-auto mb-3 size-9 text-muted-foreground/30" />
      <p className="text-sm font-semibold text-foreground/70">No guides found</p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Add <code className="rounded-md bg-muted px-1.5 py-0.5">*.md</code> files to{" "}
        <code className="rounded-md bg-muted px-1.5 py-0.5">{guidesDirectoryLabel}</code>
      </p>
    </div>
  );
}

export function UserGuideView({ rawGuides, guidesDirectoryLabel }: UserGuideViewProps) {
  const readingProgress = useReadingProgress();
  const [previewImage, setPreviewImage] = useState<GuideImagePreview | null>(null);
  const guides = useGuides(rawGuides);
  const { selectedGuide } = useSelectedGuide(guides);

  if (!selectedGuide) {
    return <GuidesEmptyState guidesDirectoryLabel={guidesDirectoryLabel} />;
  }

  return (
    <section className="min-w-0 space-y-5">
      <div className="sticky top-0 z-10 -mx-4 md:-mx-6">
        <div className="h-[3px] w-full bg-border/30">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary/75 to-primary/40 transition-[width] duration-75 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      <GuideHero guide={selectedGuide} />

      {selectedGuide.sections.map((section, index) => (
        <article
          key={section.id}
          id={section.id}
          className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/55 via-primary/20 to-transparent" />
          <span
            className="pointer-events-none absolute right-5 top-1 select-none font-bold leading-none text-foreground/[0.035]"
            style={{ fontSize: "82px" }}
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative border-b border-border/50 px-7 py-5">
            <div className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold tabular-nums text-primary/80">
                {index + 1}
              </span>
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
            </div>
          </div>

          <div className="px-7 py-6">
            <SectionMarkdown
              markdown={section.markdown}
              sectionId={section.id}
              subHeadingIds={section.subHeadings.map((subHeading) => subHeading.id)}
              onImageClick={setPreviewImage}
            />
          </div>
        </article>
      ))}

      <GuideImageDialog image={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  );
}

export function GuidesSidebarContent({ rawGuides, collapsed }: GuidesSidebarContentProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<"files" | "toc">("files");
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const guides = useGuides(rawGuides);
  const { selectedGuide, setSelectedGuide } = useSelectedGuide(guides);

  useEffect(() => {
    let rafId = 0;
    let cancelled = false;

    const resolveContainer = () => {
      if (cancelled) return;

      const nextContainer = document.querySelector<HTMLElement>("[data-guides-scroll-container]");
      if (nextContainer) {
        setScrollContainer(nextContainer);
        return;
      }

      rafId = requestAnimationFrame(resolveContainer);
    };

    resolveContainer();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!selectedGuide || !scrollContainer) return;

    let frame = 0;
    let mutationFrame = 0;

    const update = () => {
      const nextProgress: Record<string, number> = {};
      const rootRect = scrollContainer.getBoundingClientRect();
      const activeThresholdViewportY = 140;
      let nextActiveId: string | null = null;
      let firstVisibleId: string | null = null;
      let hasAnySectionElement = false;

      for (const section of selectedGuide.sections) {
        const element = document.getElementById(section.id);
        if (!element) {
          nextProgress[section.id] = 0;
          continue;
        }

        hasAnySectionElement = true;

        const rect = element.getBoundingClientRect();
        const sectionHeight = Math.max(rect.height, 1);
        const overlapTop = Math.max(rect.top, rootRect.top);
        const overlapBottom = Math.min(rect.bottom, rootRect.bottom);
        const visible = Math.max(0, overlapBottom - overlapTop);
        const passed = Math.max(0, activeThresholdViewportY - rect.top);
        const pct = Math.min(100, Math.max(0, ((passed + visible) / sectionHeight) * 100));
        nextProgress[section.id] = pct;

        if (firstVisibleId === null && rect.bottom > rootRect.top && rect.top < rootRect.bottom) {
          firstVisibleId = section.id;
        }

        if (rect.top <= activeThresholdViewportY) {
          nextActiveId = section.id;
        }
      }

      if (!hasAnySectionElement) return;

      const resolvedActiveId = nextActiveId ?? firstVisibleId ?? selectedGuide.sections[0]?.id ?? null;
      setSectionProgress(nextProgress);
      setActiveSectionId(resolvedActiveId);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    const scheduleMutationUpdate = () => {
      if (mutationFrame) return;
      mutationFrame = requestAnimationFrame(() => {
        mutationFrame = 0;
        scheduleUpdate();
      });
    };

    const mutationObserver = new MutationObserver(scheduleMutationUpdate);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    scrollContainer.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      mutationObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (mutationFrame) cancelAnimationFrame(mutationFrame);
      scrollContainer.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [scrollContainer, selectedGuide]);

  if (!selectedGuide) return null;

  return (
    <div className="space-y-4">
      <div className={cn("flex items-center gap-2 px-2", collapsed && "justify-center")}>
        <BookOpenText className="size-4 text-muted-foreground" />
        {!collapsed ? <span className="text-sm font-semibold text-foreground">Guides</span> : null}
      </div>

      {(sidebarView === "files" || collapsed) && (
        <div className="space-y-1.5">
          {!collapsed ? (
            <div className="px-2 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">All files</span>
            </div>
          ) : null}

          {collapsed ? (
            <div className="flex justify-center py-1">
              <div className={cn("size-2 rounded-full", getGuideAccent(selectedGuide.slug).dot)} />
            </div>
          ) : (
            <div className="space-y-1.5">
              {guides.map((guide) => {
                const isActive = guide.slug === selectedGuide.slug;
                const accent = getGuideAccent(guide.slug);

                return (
                  <button
                    key={guide.slug}
                    type="button"
                    onClick={() => {
                      setSelectedGuide(guide.slug);
                      setSidebarView("toc");
                    }}
                    className={cn(
                      "group relative w-full overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-all duration-150",
                      isActive
                        ? "border-border/70 bg-secondary shadow-sm"
                        : "border-border/40 bg-card hover:border-border/60 hover:bg-muted/30",
                    )}
                  >
                    {isActive ? (
                      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-50", accent.gradient)} />
                    ) : null}

                    <div className="relative flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium leading-snug",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {guide.title}
                      </span>
                      {isActive ? <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" /> : null}
                    </div>

                    <div className="relative mt-1 text-[11px] text-muted-foreground/60">
                      {guide.sections.length} {guide.sections.length === 1 ? "section" : "sections"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {sidebarView === "toc" && !collapsed ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSidebarView("files")}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All guides
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <ListTree className="size-3 text-muted-foreground/60" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Contents</span>
          </div>

          <div className="space-y-1">
            {selectedGuide.sections.map((section, index) => {
              const isActive = activeSectionId === section.id;
              const progress = sectionProgress[section.id] ?? 0;

              return (
                <div
                  key={section.id}
                  className={cn(
                    "overflow-hidden rounded-xl border transition-colors duration-150",
                    isActive ? "border-border/60 bg-secondary/50" : "border-transparent hover:border-border/40 hover:bg-muted/20",
                  )}
                >
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors",
                        isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className={cn("text-xs font-medium leading-snug transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {section.title}
                    </span>
                  </a>

                  <div className="mx-3 mb-2 h-[2px] overflow-hidden rounded-full bg-border/40">
                    <div
                      className={cn("h-full rounded-full transition-[width] duration-150", isActive ? "bg-primary/70" : "bg-border/80")}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {section.subHeadings.length > 0 ? (
                    <div className="mb-2.5 ml-10 space-y-px border-l border-border/40 pl-3">
                      {section.subHeadings.map((subHeading) => (
                        <a
                          key={subHeading.id}
                          href={`#${subHeading.id}`}
                          onClick={(event) => {
                            event.preventDefault();
                            document.getElementById(subHeading.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="block py-1 text-[11px] leading-snug text-muted-foreground/65 transition-colors hover:text-foreground"
                        >
                          {subHeading.title}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function useGuideRouteNavigation({
  guideRoute,
  fallbackRoute,
  fallbackUnauthenticatedRoute,
  onAfterNavigate,
}: GuideRouteButtonSharedProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inGuidesView = location.pathname === guideRoute;

  const handleNavigate = () => {
    if (inGuidesView) {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(
        from && from !== location.pathname
          ? from
          : isAuthenticated
            ? fallbackRoute
            : fallbackUnauthenticatedRoute ?? fallbackRoute,
      );
      onAfterNavigate?.();
      return;
    }

    navigate(guideRoute, {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
      },
    });
    onAfterNavigate?.();
  };

  return { handleNavigate, inGuidesView };
}

export function GuideIconButton({
  guideRoute,
  fallbackRoute,
  fallbackUnauthenticatedRoute,
  openLabel = "Open guides",
  closeLabel = "Close guides",
  onAfterNavigate,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: GuideIconButtonProps) {
  const { handleNavigate, inGuidesView } = useGuideRouteNavigation({
    guideRoute,
    fallbackRoute,
    fallbackUnauthenticatedRoute,
    onAfterNavigate,
  });

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("rounded-full", className)}
      aria-current={inGuidesView ? "page" : undefined}
      aria-label={inGuidesView ? closeLabel : openLabel}
      title={inGuidesView ? closeLabel : openLabel}
      onClick={handleNavigate}
      {...props}
    >
      <BookOpenText className="size-4" />
    </Button>
  );
}

export function GuideMenuButton({
  guideRoute,
  fallbackRoute,
  fallbackUnauthenticatedRoute,
  openLabel = "User guide",
  closeLabel = "Close guides",
  onAfterNavigate,
  className,
  type = "button",
  ...props
}: GuideMenuButtonProps) {
  const { handleNavigate, inGuidesView } = useGuideRouteNavigation({
    guideRoute,
    fallbackRoute,
    fallbackUnauthenticatedRoute,
    onAfterNavigate,
  });

  return (
    <button
      type={type}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60",
        className,
      )}
      aria-current={inGuidesView ? "page" : undefined}
      onClick={handleNavigate}
      {...props}
    >
      <BookOpenText className="size-4 text-muted-foreground" />
      {inGuidesView ? closeLabel : openLabel}
    </button>
  );
}
