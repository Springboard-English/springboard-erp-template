import { ApiError } from '../api_calls/apiErrors';

/**
 * The status if we have one, the wording only if we do not.
 *
 * Reading `error.message` for "403" was the only option while every call site
 * threw a hand-formatted string, and it is a loose test: a `NetworkError` says
 * how many milliseconds it waited, so a request that died after 403ms would
 * have read as permission denied. `ApiError` carries the real status, and the
 * substring pass stays for the apps whose call sites still throw a plain
 * `Error`.
 */
export function isPermissionDeniedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 403;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('403')
    || message.includes('forbidden')
    || message.includes('insufficient permission')
    || message.includes('insufficient permissions');
}
