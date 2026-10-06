// lib
import { iso8601ToDateOnly, stringToDate } from "../../../lib/dates";

/**
 * Extracts the date from a filter term string. The term should be in the format "gte:YYYY-MM-DD",
 * "lte:YYYY-MM-DD", "gt:YYYY-MM-DD", or "lt:YYYY-MM-DD". The function returns the date in the
 * format "YYYY-MM-DD". For the "gt:" case, the date gets adjusted one day later. For the "lt:"
 * case, the date gets adjusted one day earlier. If the term is invalid, the function returns an
 * empty string. Generally, this function gets called after we already know the term is in one of
 * the valid formats, not like a wildcard or a single date.
 * @param {string} term gte:, lte:, gt:, or lt: term to extract the date from
 * @returns {string} Date in the format YYYY-MM-DD; empty string if the term is invalid
 */
export function extractDateFromFilterTerm(term) {
  // Check for "gte:YYYY-MM-DD" or "lte:YYYY-MM-DD" format.
  const matchOrEqual = term.match(/^(?:gte|lte):(.+)/);
  if (matchOrEqual) {
    const iso8601Date = matchOrEqual[1];
    const date = stringToDate(iso8601Date);
    if (!isNaN(date.getTime())) {
      return iso8601ToDateOnly(iso8601Date);
    }
    return "";
  }

  // Check for "gt:YYYY-MM-DD" or "lt:YYYY-MM-DD" format. The UI doesn't make use of these
  // filters, but we need to handle them in case the user has added them manually.
  const match = term.match(/^(?:gt|lt):(.+)/);
  if (match) {
    const date = stringToDate(match[1]);
    if (!isNaN(date.getTime())) {
      // For "gt" add one day to the date. For "lt" subtract one day.
      date.setDate(date.getDate() + (term.startsWith("gt:") ? 1 : -1));
      const year = date.getFullYear().toString().padStart(4, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  }

  return "";
}

/**
 * Finds the earliest and latest dates from an array of consistently formatted date strings.
 * @param {string[]} dates Date strings in a consistent format, e.g. "YYYY-MM-DD"
 * @returns {string[]} Earliest and latest dates in the array
 */
function findEarliestAndLatestDates(dates) {
  const earliest = dates.reduce(
    (earliestDate, date) => (date < earliestDate ? date : earliestDate),
    dates[0]
  );
  const latest = dates.reduce(
    (latestDate, date) => (date > latestDate ? date : latestDate),
    dates[0]
  );
  return [earliest, latest];
}

/**
 * Extracts the earliest and latest dates from a date-range facet. The earliest date gets returned
 * as the first element of the array, and the latest date as the second element. If the facet has
 * no terms, the function returns null for both dates.
 * @param {object} facet Facet object containing date-range terms
 * @returns {Array<Date|null>} Earliest and latest dates in the facet
 */
export function getFacetDateRange(facet) {
  const facetTerms = (facet.terms || []).filter(
    (term) =>
      typeof term.key_as_string === "string" && term.key_as_string !== ""
  );
  if (facetTerms.length > 0) {
    const allDates = facetTerms.map((term) =>
      iso8601ToDateOnly(term.key_as_string)
    );
    const [earliest, latest] = findEarliestAndLatestDates(allDates);
    return [stringToDate(earliest), stringToDate(latest)];
  }
  return [null, null];
}

/**
 * Extracts the earliest and latest dates from search-results filter terms for the given field.
 * The earliest date gets returned as the first element of the array, and the latest date as the
 * second element. Filters for other fields don't matter.
 * @param {string} field Field name to filter on
 * @param {array} filters Filter objects from the search results
 * @returns {Array<Date|null>} Earliest and latest dates in the filters
 */
export function getFilterDateRange(field, filters) {
  const fieldFilters = filters.filter(
    (filter) => filter.field === field || filter.field === `${field}!`
  );

  // Special case: if the filter is a single ISO 8601 date (e.g. "YYYY-MM-DD",
  // "YYYY-MM-DDT00:00:00Z") return this date for both earliest and latest.
  const singleDateFilter = fieldFilters.find((filter) => {
    const date = stringToDate(filter.term);
    return !isNaN(date.getTime());
  });
  if (singleDateFilter) {
    const date = stringToDate(singleDateFilter.term);
    return [date, date];
  }

  // Special case: if the filter is a wildcard (i.e. "*"), return null for both dates so that the
  // facet dates get used instead.
  if (fieldFilters.some((filter) => filter.term === "*")) {
    return [null, null];
  }

  // Get the dates of all the gte:{date}, gt:{date}, lte:{date}, and lt:{date} filters for the
  // field.
  function datesForOperators(operators) {
    return fieldFilters
      .filter(
        (filter) =>
          filter.field === field &&
          operators.some((operator) => filter.term.startsWith(`${operator}:`))
      )
      .map((filter) => extractDateFromFilterTerm(filter.term))
      .filter((date) => date);
  }
  const allGteAndGtDates = datesForOperators(["gte", "gt"]);
  const allLteAndLtDates = datesForOperators(["lte", "lt"]);

  // Find the latest date from the gte and gt filters (i.e. the most restrictive).
  const latestGreaterDate =
    allGteAndGtDates.length > 0
      ? allGteAndGtDates.reduce((latest, date) =>
          date > latest ? date : latest
        )
      : null;

  // Find the earliest date from the lte and lt filters (i.e. the most restrictive).
  const earliestLessDate =
    allLteAndLtDates.length > 0
      ? allLteAndLtDates.reduce((earliest, date) =>
          date < earliest ? date : earliest
        )
      : null;

  return [
    latestGreaterDate ? stringToDate(latestGreaterDate) : null,
    earliestLessDate ? stringToDate(earliestLessDate) : null,
  ];
}
