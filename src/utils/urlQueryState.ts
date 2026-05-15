export function getQueryParam(params: URLSearchParams, key: string, fallback = ""): string {
  const value = params.get(key);
  return value ?? fallback;
}

export function getQueryNumber(
  params: URLSearchParams,
  key: string,
  fallback: number,
  min = 0,
): number {
  const rawValue = params.get(key);
  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsedValue) || parsedValue < min) {
    return fallback;
  }

  return parsedValue;
}

export function getQueryBoolean(
  params: URLSearchParams,
  key: string,
  fallback: boolean,
): boolean {
  const value = params.get(key);
  if (value === "1") {
    return true;
  }
  if (value === "0") {
    return false;
  }
  return fallback;
}

export function updateSearchParams(
  params: URLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>,
): URLSearchParams {
  const nextParams = new URLSearchParams(params);

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === false
    ) {
      nextParams.delete(key);
      return;
    }

    if (value === true) {
      nextParams.set(key, "1");
      return;
    }

    nextParams.set(key, String(value));
  });

  return nextParams;
}
