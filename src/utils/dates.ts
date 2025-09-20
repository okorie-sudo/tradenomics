// src/utils/dates.ts
import type { Timestamp } from "firebase/firestore";

export function toDate(value?: string | Timestamp | null): Date | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return new Date(value);
  // Timestamp has toDate()
  return (value as Timestamp).toDate();
}

export function formatDate(value?: string | Timestamp | null): string {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleString(); // or your preferred formatter
}
