const OUTDATED_EDITED_AT_CONFLICT_MESSAGE =
    "edited_at is older than the current value. refresh data and retry with a newer edited_at";

export function isOutdatedEditedAtConflictError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    return error.message
        .toLowerCase()
        .includes(OUTDATED_EDITED_AT_CONFLICT_MESSAGE);
}
