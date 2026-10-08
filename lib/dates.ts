/**
 * Hopefully we can keep all date-related code in this file so that we can easily transition to the
 * Temporal API when enough browsers support it, or to a polyfill for the Temporal API if a good one
 * comes along.
 */

// node_modules
import * as dateFns from "date-fns";
// lib
import { UC } from "./constants";

/**
 * Convert an ISO 8601 date string to a human-readable form in the local time zone. The given date
 * can use an abbreviated time common in this system, such as YYYY-MM-DD.
 * @param date ISO 8601 date string
 * @returns Human-readable date string
 */
export function formatDate(date?: string): string {
  if (date) {
    const jsDate = new Date(date);
    const midnightDate = new Date(
      jsDate.valueOf() + jsDate.getTimezoneOffset() * 60 * 1000
    );
    return dateFns.format(midnightDate, "MMMM d, yyyy");
  }
  return "";
}

/**
 * Convert the given date to the APA date style -- (yyyy, MMMM d). This is useful for citing dates
 * in APA format.
 * @param date Date in any recognized format
 * @returns Same as `date` but in APA format
 */
export function formatDateApaStyle(date: string): string {
  const jsDate = new Date(date);
  const midnightDate = new Date(
    jsDate.valueOf() + jsDate.getTimezoneOffset() * 60 * 1000
  );
  return dateFns.format(midnightDate, "(yyyy, MMMM d)");
}

/**
 * Format a start and end date in YYYY-MM-DD format into a dash-separated string. If only one of
 * the dates is provided, this returns a single date.
 * @param startDate Start date in the format "YYYY-MM-DD"
 * @param endDate End date in the format "YYYY-MM-DD"
 * @returns Formatted date range
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  const dateRange = [startDate, endDate]
    .filter((date) => date)
    .map((date) => formatDate(date));
  return dateRange.join(` ${UC.ndash} `);
}

/**
 * Converts a Date object representing a calendar date (local midnight, as returned by
 * `stringToDate()` and the date-range picker) to a human-readable string in the format
 * "Month Day, Year".
 * @param date Date object to convert
 * @returns Human-readable date string in the format "Month Day, Year"
 */
export function formatLongDate(date: Date): string {
  return dateFns.format(date, "MMMM d, yyyy");
}

/**
 * Converts a Date object representing a calendar date (local midnight, as returned by
 * `stringToDate()` and the date-range picker) to the YYYY-MM-DD format used in query strings.
 * @param date Date object to convert
 * @returns Date string in the format YYYY-MM-DD
 */
export function dateToDateOnly(date: Date): string {
  return dateFns.format(date, "yyyy-MM-dd");
}

/**
 * Strip the time from an ISO 8601 date-time string, leaving only the date, e.g. "YYYY-MM-DD".
 * @param iso8601 ISO 8601 date or date-time string
 * @returns Date portion of `iso8601`
 */
export function iso8601ToDateOnly(iso8601: string): string {
  return iso8601.split("T")[0];
}

/**
 * Convert a date string in the format YYYY-MM-DD or 2023-08-01T04:12:31.890123+00:00 to a Date
 * object without using the local time zone. So "2025-06-01" returns a Date object representing
 * June 1, 2025, at local midnight, never "2025-05-31".
 * @param dateString Date string in the format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS.mmmmmm+00:00
 * @returns Date object representing `dateString`
 */
export function stringToDate(dateString: string): Date {
  const dateWithoutTime = dateString.split("T")[0];
  return dateFns.parse(dateWithoutTime, "yyyy-MM-dd", new Date());
}

/**
 * Get the system date limits for the date-range picker as local calendar dates. The start limit
 * is January 1, 2023, and the end limit is 90 days after today.
 * @returns Start and end limits as Date objects
 */
export function getSystemDateRange(): { startLimit: Date; endLimit: Date } {
  const today = new Date();
  const endLimit = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 90
  );
  const startLimit = new Date(2023, 0, 1);

  return { startLimit, endLimit };
}

/**
 * Convert an ISO 8601 date string to the equivalent date in yyyy-MM format. Don't use npm date
 * utilities because they can use the local time zone, which could return a month that's off by
 * one.
 * @param iso8601 ISO 8601 date string
 * @returns Equivalent date in yyyy-MM format
 */
export function iso8601ToYearDate(iso8601: string): string {
  const basicDate = iso8601.split("T")[0];
  const dt = new Date(basicDate);
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth() + 1;
  return `${year}-${month.toString().padStart(2, "0")}`;
}
