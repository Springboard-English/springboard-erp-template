import { animated, useSpring } from "@react-spring/web";
import type { ReactNode } from "react";
import { User } from "lucide-react";
import { cn } from "../lib/utils";
import { useI18n } from "@/context/I18nContext";

export interface MobileBottomBarItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface MobileBottomBarProps {
  activeTab?: string;
  items: MobileBottomBarItem[];
  onTabSelect?: (tabId: string) => void;
  onMenuOpen: () => void;
  menuButtonLabel?: string;
  menuButtonAriaLabel?: string;
  menuButtonIcon?: ReactNode;
  className?: string;
}

export default function MobileBottomBar({
  activeTab,
  items,
  onTabSelect,
  onMenuOpen,
  menuButtonLabel,
  menuButtonAriaLabel,
  menuButtonIcon,
  className,
}: MobileBottomBarProps) {
  const { t } = useI18n();
  const resolvedMenuButtonLabel = menuButtonLabel ?? t("mobileBottomBar.menu");
  const resolvedMenuButtonAriaLabel = menuButtonAriaLabel ?? t("mobileBottomBar.openMenu");
  const itemCount = items.length;
  const activeIndex = items.findIndex((item) => item.id === activeTab);
  const indicatorSpring = useSpring({
    leftPct: activeIndex >= 0 && itemCount > 0 ? (activeIndex / itemCount) * 100 : 0,
    opacity: activeIndex >= 0 && itemCount > 0 ? 1 : 0,
    config: { tension: 300, friction: 26 },
  });
  const navWidthPct = "calc(100% - 4rem)";

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 h-16 border-t border-border/70 bg-card/95 backdrop-blur md:hidden",
        className,
      )}
    >
      <nav className="relative flex h-full items-stretch">
        <animated.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-0.5 rounded-full bg-primary"
          style={{
            left: indicatorSpring.leftPct.to(
              (value) => `calc(${navWidthPct} * ${value / 100})`,
            ),
            width: indicatorSpring.leftPct.to(
              () => (itemCount > 0 ? `calc(${navWidthPct} / ${itemCount})` : "0px"),
            ),
            opacity: indicatorSpring.opacity,
          }}
        />

        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onTabSelect?.(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="w-16 shrink-0 border-l border-border/40">
          <button
            type="button"
            className="flex h-full w-full flex-col items-center justify-center gap-1 px-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={onMenuOpen}
            aria-label={resolvedMenuButtonAriaLabel}
          >
            {menuButtonIcon ?? <User className="size-5" />}
            <span className="text-[10px] font-medium leading-none">
              {resolvedMenuButtonLabel}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
