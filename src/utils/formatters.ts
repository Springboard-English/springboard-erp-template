import dayjs from "dayjs";

const BACKEND_TIMESTAMP_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const DATETIME_LOCAL_FORMAT = "YYYY-MM-DDTHH:mm";
const BACKEND_TIME_FORMAT = "HH:mm";

function formatDateWithOffset(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absoluteOffsetMinutes / 60)).padStart(2, "0");
  const offsetRemainderMinutes = String(absoluteOffsetMinutes % 60).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetRemainderMinutes}`;
}

function parseLocalizedDateTime(value: string) {
  const nativeDate = new Date(value);
  return Number.isNaN(nativeDate.getTime()) ? undefined : nativeDate;
}

function parseLocalizedTimeValue(value: string) {
  const normalizedValue = value.trim();
  const twelveHourMatch = normalizedValue.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/,
  );

  if (twelveHourMatch) {
    const [, hoursText, minutesText, secondsText, meridiem] = twelveHourMatch;
    const rawHours = Number(hoursText);
    const minutes = Number(minutesText);
    const seconds = secondsText ? Number(secondsText) : 0;

    if (
      rawHours < 1 ||
      rawHours > 12 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      return undefined;
    }

    const normalizedHours =
      meridiem.toLowerCase() === "pm"
        ? rawHours % 12 + 12
        : rawHours % 12;

    return `${String(normalizedHours).padStart(2, "0")}:${minutesText}`;
  }

  const twentyFourHourMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!twentyFourHourMatch) {
    return undefined;
  }

  const [, hoursText, minutesText] = twentyFourHourMatch;
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return undefined;
  }

  return `${String(hours).padStart(2, "0")}:${minutesText}`;
}

export function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString() : '-';
}

export function formatUserTimestamp(value?: string) {
  if (!value) {
    return '-';
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(value).toLocaleString(undefined, { timeZone: userTimeZone });
}

export function toBackendTimestamp(value?: string | null) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = dayjs(normalizedValue);
  if (parsedValue.isValid()) {
    return parsedValue.format(BACKEND_TIMESTAMP_FORMAT);
  }

  const localizedDate = parseLocalizedDateTime(normalizedValue);
  return localizedDate ? formatDateWithOffset(localizedDate) : undefined;
}

export function toBackendBoundary(
  dateValue: string | null | undefined,
  boundary: "start" | "end",
) {
  const normalizedValue = dateValue?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue =
    boundary === "start"
      ? dayjs(normalizedValue).startOf("day")
      : dayjs(normalizedValue).endOf("day");

  return parsedValue.isValid()
    ? parsedValue.format(BACKEND_TIMESTAMP_FORMAT)
    : undefined;
}

export function toDateTimeLocalValue(value?: string | null) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return "";
  }

  const parsedValue = dayjs(normalizedValue);
  return parsedValue.isValid() ? parsedValue.format(DATETIME_LOCAL_FORMAT) : "";
}

export function toBackendTimeValue(value?: string | null) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = dayjs(normalizedValue, BACKEND_TIME_FORMAT);
  if (parsedValue.isValid()) {
    return parsedValue.format(BACKEND_TIME_FORMAT);
  }

  return parseLocalizedTimeValue(normalizedValue);
}

export function getTextareaRows(value?: string | null, minRows = 2, maxRows = 8) {
  const normalized = value ?? '';
  const newlineCount = normalized.split('\n').length;
  const wrappedLineEstimate = Math.ceil(normalized.length / 70);
  return Math.min(maxRows, Math.max(minRows, newlineCount, wrappedLineEstimate));
}
