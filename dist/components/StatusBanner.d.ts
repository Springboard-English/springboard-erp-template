import type { ReactNode } from 'react';
type StatusVariant = 'error' | 'success' | 'info';
interface StatusBannerProps {
    children: ReactNode;
    className?: string;
    variant?: StatusVariant;
}
export default function StatusBanner({ children, className, variant, }: StatusBannerProps): import("react/jsx-runtime").JSX.Element;
export {};
