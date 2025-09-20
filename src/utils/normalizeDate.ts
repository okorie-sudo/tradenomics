import type { Timestamp, FieldValue } from "firebase/firestore";

/**
 * Normalizes a Firestore Timestamp | serverTimestamp FieldValue | string | null
 * into a Date or undefined.
 */
export function normalizeDate(
  value?: string | Timestamp | FieldValue | null
): Date | undefined {
  if (!value) return undefined;

  if (typeof value === "string") {
    return new Date(value);
  }

  // Firestore Timestamp objects have .toDate()
  if (typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }

  // FieldValue (serverTimestamp placeholder) has no date info
  return undefined;
}

/**
 * Format normalized date into a human-readable string.
 */
export function formatDate(
  value?: string | Timestamp | FieldValue | null,
  locale: string = "en-US"
): string {
  const date = normalizeDate(value);
  if (!date) return "";
  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
