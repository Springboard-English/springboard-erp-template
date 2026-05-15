import { LoaderCircle } from 'lucide-react';

export default function LazyViewFallback() {
  return (
    <div className="flex min-h-[240px] w-full items-center justify-center">
      <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
}
