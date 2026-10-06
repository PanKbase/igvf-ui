import {
  extractDateFromFilterTerm,
  getFacetDateRange,
  getFilterDateRange,
} from "../custom-facets/date-range-lib";
import { dateToDateOnly } from "../../../lib/dates";

function filter(term, field = "release_timestamp") {
  return { field, term, remove: "" };
}

describe("Test extractDateFromFilterTerm function", () => {
  it("extracts dates from gte and lte terms in ISO 8601 and date-only formats", () => {
    expect(extractDateFromFilterTerm("gte:2023-01-01T00:00:00.000Z")).toBe(
      "2023-01-01"
    );
    expect(extractDateFromFilterTerm("lte:2023-12-31T23:59:59.999Z")).toBe(
      "2023-12-31"
    );
    expect(extractDateFromFilterTerm("gte:2023-06-15")).toBe("2023-06-15");
    expect(extractDateFromFilterTerm("lte:2023-06-15")).toBe("2023-06-15");
  });

  it("adjusts gt one day later and lt one day earlier", () => {
    expect(extractDateFromFilterTerm("gt:2023-01-01")).toBe("2023-01-02");
    expect(extractDateFromFilterTerm("lt:2023-01-01")).toBe("2022-12-31");
    expect(extractDateFromFilterTerm("gt:2023-01-01T00:00:00.000Z")).toBe(
      "2023-01-02"
    );
    expect(extractDateFromFilterTerm("lt:2023-01-01T00:00:00.000Z")).toBe(
      "2022-12-31"
    );
  });

  it("returns an empty string for invalid terms", () => {
    expect(extractDateFromFilterTerm("invalid-term")).toBe("");
    expect(extractDateFromFilterTerm("gte:invalid-date")).toBe("");
    expect(extractDateFromFilterTerm("lt:invalid-date")).toBe("");
  });
});

describe("Test getFacetDateRange function", () => {
  it("returns the earliest and latest dates from the facet terms", () => {
    const facet = {
      field: "date",
      terms: [
        { key_as_string: "2023-03-23T12:34:56.000Z", doc_count: 10 },
        { key_as_string: "2023-01-01T11:35:55.000Z", doc_count: 10 },
        { key_as_string: "2023-12-31T14:03:15.000Z", doc_count: 5 },
        { key_as_string: "2023-06-15T18:48:03.000Z", doc_count: 8 },
      ],
    };
    const [earliest, latest] = getFacetDateRange(facet);
    expect(dateToDateOnly(earliest)).toBe("2023-01-01");
    expect(dateToDateOnly(latest)).toBe("2023-12-31");
  });

  it("returns nulls without terms or without key_as_string", () => {
    expect(getFacetDateRange({ field: "date", terms: [] })).toEqual([
      null,
      null,
    ]);
    expect(getFacetDateRange({ field: "date" })).toEqual([null, null]);
    expect(
      getFacetDateRange({
        field: "date",
        terms: [{ key: "gte:2026-03-01" }, { key: "lte:2026-03-31" }],
      })
    ).toEqual([null, null]);
  });
});

describe("Test getFilterDateRange function", () => {
  it("returns the most restrictive dates from gte and lte filters", () => {
    const [earliest, latest] = getFilterDateRange("release_timestamp", [
      filter("gte:2023-01-01T00:00:00.000Z"),
      filter("lte:2023-12-31T23:59:59.999Z"),
      filter("gte:2023-06-01T00:00:00.000Z"),
      filter("lte:2023-12-30T11:13:43.999Z"),
    ]);
    expect(dateToDateOnly(earliest)).toBe("2023-06-01");
    expect(dateToDateOnly(latest)).toBe("2023-12-30");
  });

  it("handles a mix of gte and gt filters", () => {
    const [earliest, latest] = getFilterDateRange("release_timestamp", [
      filter("gte:2023-01-01"),
      filter("gt:2023-06-01"),
      filter("gte:2023-06-01"),
      filter("gt:2023-03-23"),
    ]);
    expect(dateToDateOnly(earliest)).toBe("2023-06-02");
    expect(latest).toBeNull();
  });

  it("handles a mix of lte and lt filters", () => {
    const [earliest, latest] = getFilterDateRange("release_timestamp", [
      filter("lte:2023-12-31"),
      filter("lt:2023-06-01"),
      filter("lte:2023-06-01"),
      filter("lt:2023-08-23"),
    ]);
    expect(earliest).toBeNull();
    expect(dateToDateOnly(latest)).toBe("2023-05-31");
  });

  it("returns the same date for both if a single date filter exists", () => {
    const [earliest, latest] = getFilterDateRange("release_timestamp", [
      filter("2023-06-01T00:00:00.000Z"),
    ]);
    expect(dateToDateOnly(earliest)).toBe("2023-06-01");
    expect(dateToDateOnly(latest)).toBe("2023-06-01");
  });

  it("returns nulls for a wildcard filter", () => {
    expect(getFilterDateRange("release_timestamp", [filter("*")])).toEqual([
      null,
      null,
    ]);
  });

  it("ignores filters for other fields", () => {
    expect(
      getFilterDateRange("release_timestamp", [
        filter("gte:2023-06-01T00:00:00.000Z", "creation_timestamp"),
      ])
    ).toEqual([null, null]);
  });
});
