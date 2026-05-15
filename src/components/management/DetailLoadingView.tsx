import { DetailView } from '@/components/management/DetailLayout';

interface DetailLoadingViewProps {
  title?: string;
}

export default function DetailLoadingView({ title = 'Loading details...' }: DetailLoadingViewProps) {
  return (
    <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
      <div className="rounded-2xl border border-border/70 bg-card px-4 py-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
        <div className="h-5 w-48 animate-pulse rounded bg-muted/60" />
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`detail-loading-row-${index}`} className="h-9 w-full animate-pulse rounded bg-muted/60" />
          ))}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">{title}</div>
    </DetailView>
  );
}
