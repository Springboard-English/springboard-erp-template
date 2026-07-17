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
export declare function DetailView({ children, className, isBackground: isBackgroundProp, contentScrollable, onCloseFloating, }: {
    children: ReactNode;
    className?: string;
    isBackground?: boolean;
    contentScrollable?: boolean;
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
type DetailFieldsTableFieldRow = {
    type?: "field";
    label: ReactNode;
    value: ReactNode;
    key?: string;
    rowClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
};
type DetailFieldsTableSectionRow = {
    type: "section";
    section: ReactNode;
    key?: string;
    rowClassName?: string;
    sectionClassName?: string;
};
export type DetailFieldsTableRow = DetailFieldsTableFieldRow | DetailFieldsTableSectionRow;
export declare function DetailFieldsTable({ rows, className, tableClassName, labelColumnClassName, scrollable, scrollContainerClassName, }: {
    rows: DetailFieldsTableRow[];
    className?: string;
    tableClassName?: string;
    labelColumnClassName?: string;
    scrollable?: boolean;
    scrollContainerClassName?: string;
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
export interface DetailTabsClassNames {
    root?: string;
    list?: string;
    pill?: string;
    tab?: string;
    tabActive?: string;
}
export declare function DetailTabs<T extends string>({ tabs, activeTab, onChange, className, classNames, }: {
    tabs: Array<{
        value: T;
        label: ReactNode;
        hasPendingChanges?: boolean;
    }>;
    activeTab: T;
    onChange: (tab: T) => void;
    className?: string;
    classNames?: DetailTabsClassNames;
}): import("react/jsx-runtime").JSX.Element;
export declare function DetailTabbedSection<T extends string>({ tabs, activeTab, onChange, children, className, contentClassName, contentScrollable, scrollResetKey, }: {
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
    contentScrollable?: boolean;
    scrollResetKey?: string | number;
}): import("react/jsx-runtime").JSX.Element;
export {};
