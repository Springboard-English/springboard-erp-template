// In public/ rather than assets/ because the boot screen (public/vite-boot.mjs)
// ships it as a file too; this import still inlines it into the bundle.
import sitemarkUrl from '../../public/sitemark.svg';
import logoUrl from '../assets/logo.svg';
import markUrl from '../../public/favicon.svg';

interface LogoProps {
  className?: string;
}

/** The horizontal badge: the mark and the two-line name inside a rose pill. */
export function SitemarkIcon({ className }: LogoProps) {
  // Without a className it keeps the fixed 150px width the sign-in screens were laid out for.
  return className
    ? <img src={sitemarkUrl} alt="Springboard English" className={className}/>
    : <img src={sitemarkUrl} width="150" alt="Springboard English"/>;
}

/** The sidebar's brand: the mark, plus the company and app name unless the sidebar is collapsed. */
export function SpringboardBrand({ app, collapsed }: { app: string; collapsed?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img src={markUrl} alt={collapsed ? `Springboard English ${app}` : ''} className="size-9 shrink-0" />
      {collapsed ? null : (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Springboard English</p>
          <p className="truncate text-xs text-muted-foreground">{app}</p>
        </div>
      )}
    </div>
  );
}

/** The square lockup: the mark above the two-line name. */
export function LogoIcon({ className }: LogoProps) {
  return <img src={logoUrl} alt="Springboard English" className={className}/>;
}
