import { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// Split out of UserGuide.tsx so that `react-markdown` is reached through a
// dynamic import, and therefore is NOT in the package's import graph until a
// guide is actually rendered.
//
// It has to be this way round. `react-markdown` pulls in
// `decode-named-character-reference`, whose *browser* build decodes HTML
// entities with the DOM — `const element = document.createElement('i')`, at
// module scope. A bundler building for the browser resolves that build, so
// merely importing the package root executed it, and any Node-side import (an
// app's pure-logic test, a script) died with "document is not defined" before
// running a line. That is what the separate `/transport` entry point existed to
// work around; with this boundary the root barrel is Node-safe and the second
// entry point is unnecessary.

type GuideImagePreview = { src: string; alt: string };

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

export default function SectionMarkdown({
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
  const { t } = useI18n();
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
              <span className="mt-2 block text-xs text-muted-foreground">{t("guides.clickToExpand")}</span>
            </button>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
