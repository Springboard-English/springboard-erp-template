export function getQueryParam(params: URLSearchParams, key: string, fallback = ""): string {
  const value = params.get(key);
  return value ?? fallback;
}

