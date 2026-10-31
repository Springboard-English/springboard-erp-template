import * as React from "react"
import { CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import { touchTargetHeight } from "@/lib/touchTarget"

type DateInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type: "date" | "datetime-local"
  /** Classes for the visible text field. */
  fieldClassName: string
}

/** ISO `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm` to "27/10/2026" or "27/10/2026 13:00". */
function toDisplay(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}))?/)
  if (!match) return ""
  const date = `${match[3]}/${match[2]}/${match[1]}`
  return match[4] ? `${date} ${match[4]}` : date
}

/** Typed day-first text to ISO, or null while it is not yet a real date. */
function toIso(text: string, withTime: boolean): string | null {
  const match = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/)
  if (!match || (withTime && match[4] === undefined)) return null
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const probe = new Date(Date.UTC(year, month - 1, day))
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null
  const date = `${match[3]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  if (!withTime) return date
  const [hour, minute] = [Number(match[4]), Number(match[5])]
  if (hour > 23 || minute > 59) return null
  return `${date}T${String(hour).padStart(2, "0")}:${match[5]}`
}

/**
 * A date or date-time field that always reads day first on a 24-hour clock.
 * A native input's display follows the browser's locale, so the native one
 * stays hidden as the form value and the calendar, and a text field sits over it.
 */
function DateInput({ type, value, defaultValue, onChange, fieldClassName, className, id, disabled, readOnly, placeholder, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, ref, ...props }: DateInputProps) {
  const nativeRef = React.useRef<HTMLInputElement | null>(null)
  const withTime = type === "datetime-local"
  const controlled = value !== undefined
  const [text, setText] = React.useState(() => toDisplay(String(value ?? defaultValue ?? "")))
  const [editing, setEditing] = React.useState(false)
  const shown = controlled && !editing ? toDisplay(String(value)) : text

  // Sets the native value the way a user would, so React's onChange fires with the ISO value.
  const pushNative = (iso: string) => {
    const input = nativeRef.current
    if (!input) return
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
    setter?.call(input, iso)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  }

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        data-slot="input"
        className={cn(fieldClassName, "pr-11")}
        value={shown}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder ?? (withTime ? "dd/mm/yyyy hh:mm" : "dd/mm/yyyy")}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        onFocus={() => {
          setText(shown)
          setEditing(true)
        }}
        onBlur={() => setEditing(false)}
        onChange={(event) => {
          const next = event.target.value
          setText(next)
          if (next.trim() === "") {
            pushNative("")
            return
          }
          const iso = toIso(next, withTime)
          if (iso) pushNative(iso)
        }}
      />
      <input
        {...props}
        ref={(node) => {
          nativeRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        type={type}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-3 size-0 opacity-0"
        onChange={(event) => {
          if (!editing) setText(toDisplay(event.target.value))
          onChange?.(event)
        }}
      />
      <button
        type="button"
        disabled={disabled || readOnly}
        aria-label={ariaLabel ? `${ariaLabel}: calendar` : "Open calendar"}
        className={cn(touchTargetHeight, "absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50")}
        onClick={() => nativeRef.current?.showPicker?.()}
      >
        <CalendarDays className="size-4" />
      </button>
    </div>
  )
}

export { DateInput }
