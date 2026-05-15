import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder,
  className = 'relative min-w-0 flex-1',
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit?.();
          }
        }}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
