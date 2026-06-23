import { type ReactNode } from "react";

export default function QuestionSectionCard({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
      <span
        className="pointer-events-none absolute right-5 top-0 select-none font-bold leading-none text-foreground/[0.035]"
        style={{ fontSize: "82px" }}
        aria-hidden
      >
        {String(index).padStart(2, "0")}
      </span>
      <div className="relative border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold tabular-nums text-primary">
            {index}
          </span>
          <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </article>
  );
}
