import { type ReactNode } from "react";
export declare const DETAIL_LAYOUT_MOTION_DEFAULTS: {
    readonly tabPillSpring: {
        readonly tension: 300;
        readonly friction: 26;
    };
    readonly tabContentFadeOutMs: 100;
    readonly tabContentFadeInMs: 200;
};
export type DetailLayoutMotionConfig = {
    tabPillSpring: {
        tension: number;
        friction: number;
    };
    tabContentFadeOutMs: number;
    tabContentFadeInMs: number;
};
export type DetailLayoutMotionConfigInput = Partial<{
    tabPillSpring: Partial<DetailLayoutMotionConfig["tabPillSpring"]>;
    tabContentFadeOutMs: number;
    tabContentFadeInMs: number;
}>;
export declare function getDetailLayoutMotionConfig(): DetailLayoutMotionConfig;
export declare function setDetailLayoutMotionConfig(nextConfig: DetailLayoutMotionConfigInput): DetailLayoutMotionConfig;
export declare function resetDetailLayoutMotionConfig(): DetailLayoutMotionConfig;
type BreadcrumbItem = {
    label: string;
    onClick?: () => void;
};
type DetailStat = {
    label: string;
    value: ReactNode;
};
export declare const BackgroundDetailViewContext: import("react").Context<boolean>;
export declare function DetailView({ children, className, isBackground: isBackgroundProp, onCloseFloating, }: {
    children: ReactNode;
    className?: string;
    isBackground?: boolean;
    onCloseFloating?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailBreadcrumbs({ items, current, }: {
    items: BreadcrumbItem[];
    current: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailHeader({ breadcrumbs, actions, className, }: {
    breadcrumbs: ReactNode;
    actions?: ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailSummaryGrid({ children, className, }: {
    children: ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailSummaryItem({ label, value }: DetailStat): import("react/jsx-runtime").JSX.Element;
export declare function DetailCard({ children, className, }: {
    children: ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailTextBlock({ label, value, }: {
    label: string;
    value?: string | null;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailFieldsTable({ rows, className, tableClassName, labelColumnClassName, }: {
    rows: Array<{
        label: ReactNode;
        value: ReactNode;
        key?: string;
        rowClassName?: string;
        labelClassName?: string;
        valueClassName?: string;
    }>;
    className?: string;
    tableClassName?: string;
    labelColumnClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailClassLinkValue({ className, classKey, onOpenClass, buttonLabel, }: {
    className?: string | null;
    classKey?: string | null;
    onOpenClass: () => void;
    buttonLabel?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailClassHeaderLabel({ label, classKey, onOpenClass, }: {
    label?: string;
    classKey?: string | null;
    onOpenClass: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailActionPanel({ title, children, }: {
    title: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailTabs<T extends string>({ tabs, activeTab, onChange, }: {
    tabs: Array<{
        value: T;
        label: ReactNode;
        hasPendingChanges?: boolean;
    }>;
    activeTab: T;
    onChange: (tab: T) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailTabbedSection<T extends string>({ tabs, activeTab, onChange, children, className, contentClassName, scrollResetKey, }: {
    tabs: Array<{
        value: T;
        label: ReactNode;
        hasPendingChanges?: boolean;
    }>;
    activeTab: T;
    onChange: (tab: T) => void;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    scrollResetKey?: string | number;
}): import("react/jsx-runtime").JSX.Element;
export {};
