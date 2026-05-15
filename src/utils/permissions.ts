export function isPermissionDeniedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('403')
    || message.includes('forbidden')
    || message.includes('insufficient permission')
    || message.includes('insufficient permissions');
}
