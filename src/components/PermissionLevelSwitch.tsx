import { animated, useSpring } from "@react-spring/web";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export interface PermissionLevelOption<T extends string> {
  value: T;
  label: string;
}

export interface PermissionLevelSwitchProps<T extends string> {
  className?: string;
  /** The two levels, left then right. */
  options: readonly [PermissionLevelOption<T>, PermissionLevelOption<T>];
  value: T;
  onChange: (value: T) => void;
}

/** A two-way switch between an app's views. Who may see it is the app's call. */
export default function PermissionLevelSwitch<T extends string>({
  className,
  options,
  value,
  onChange,
}: PermissionLevelSwitchProps<T>) {
  const { t } = useI18n();
  const pillSpring = useSpring({
    x: value === options[0].value ? 0 : 1,
    config: { tension: 320, friction: 22 },
  });

  return (
    <div
      className={cn(
        // 44px on touch: this also renders inside the mobile menu sheet, not
        // just the desktop-only header.
        "relative inline-grid h-11 shrink-0 grid-cols-2 rounded-md border border-border/70 bg-muted/45 p-0.5 md:pointer-fine:h-9",
        className,
      )}
      role="group"
      aria-label={t("permissionLevel.aria")}
    >
      <animated.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 left-0.5 rounded-[6px] bg-background shadow-xs"
        style={{
          width: "calc(50% - 2px)",
          transform: pillSpring.x.to((x) => `translateX(calc(${x * 100}% + ${x * 2}px))`),
        }}
      />

      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              "relative z-10 h-10 w-full rounded-[6px] px-2.5 text-xs font-medium transition-colors duration-150 md:pointer-fine:h-8",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
