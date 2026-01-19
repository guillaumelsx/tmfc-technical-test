import { format, formatISO, isToday, set, startOfDay } from "date-fns";

/**
 * Creates an ISO 8601 date string representing today's date (or the given date)
 * with the specified hours and minutes.
 *
 * @param hours - The hour of the day (0-23) to set in the resulting date
 * @param minutes - The minutes to set in the resulting date
 * @param date - (Optional) The base date to use (defaults to today)
 * @returns ISO string representing the date with the given time
 */
export function createDate(hours: number, minutes: number, date: Date = new Date()): string {
  const baseDate = startOfDay(date);
  const dateWithTime = set(baseDate, { hours, minutes });
  return formatISO(dateWithTime);
}

/**
 * Formats a date string for displaying as a chat message timestamp,
 * returning "Today at h:mmAM/PM" if the date is today,
 * or "MM/dd at hh:mmAM/PM" if not.
 *
 * @param dateString - An ISO date string to be formatted
 * @returns A user-friendly string representing the date and time
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    const timeStr = format(date, "h:mmaaa");
    return `Today at ${timeStr}`;
  }

  return `${format(date, "MM/dd")} at ${format(date, "hh:mmaaa")}`;
}
