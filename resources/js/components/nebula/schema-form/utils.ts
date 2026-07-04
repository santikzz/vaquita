/**
 * Converts a flat form data object to FormData, handling all common value types:
 * - null / undefined  -> skipped
 * - File / Blob       -> appended as-is
 * - boolean           -> "1" / "0"
 * - Date              -> ISO string
 * - Array             -> each item appended as key[]
 * - object            -> JSON stringified
 * - everything else   -> String(value)
 */
export function toFormData(data: Record<string, unknown>): FormData {
    const fd = new FormData();

    for (const [key, value] of Object.entries(data)) {
        appendValue(fd, key, value);
    }

    return fd;
}

function appendValue(fd: FormData, key: string, value: unknown): void {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
        for (const item of value) {
            appendValue(fd, `${key}[]`, item);
        }
        return;
    }

    if (value instanceof File || value instanceof Blob) {
        fd.append(key, value);
        return;
    }

    if (value instanceof Date) {
        fd.append(key, value.toISOString());
        return;
    }

    if (typeof value === "boolean") {
        fd.append(key, value ? "1" : "0");
        return;
    }

    if (typeof value === "object") {
        fd.append(key, JSON.stringify(value));
        return;
    }

    fd.append(key, String(value));
}
