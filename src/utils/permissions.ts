import { ApiError } from '../api_calls/apiErrors';

/**
 * The status if we have one, the wording only if we do not.
 *
 * Reading `error.message` for "403" is a loose test: a `NetworkError` says how
 * many milliseconds it waited, so a request that died after 403ms would read as
 * permission denied. `ApiError` carries the real status; the substring pass is
 * only for call sites that throw a plain `Error`.
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
