import sitemarkUrl from '../assets/sitemark.svg';
import logoUrl from '../assets/logo.svg';

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

/** The square lockup: the mark above the two-line name. */
export function LogoIcon({ className }: LogoProps) {
  return <img src={logoUrl} alt="Springboard English" className={className}/>;
}
