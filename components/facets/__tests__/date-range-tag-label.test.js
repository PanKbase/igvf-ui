import { render, screen } from "@testing-library/react";
import DateRangeTagLabel from "../custom-facets/date-range-tag-label";

describe("Test <DateRangeTagLabel>", () => {
  it("renders gte and lte terms with comparison symbols", () => {
    const { rerender } = render(
      <DateRangeTagLabel
        filter={{ field: "release_timestamp", term: "gte:2023-06-15" }}
      />
    );
    expect(screen.getByText("\u2265 June 15, 2023")).toBeInTheDocument();

    rerender(
      <DateRangeTagLabel
        filter={{
          field: "release_timestamp",
          term: "lte:2023-12-31T10:00:00Z",
        }}
      />
    );
    expect(screen.getByText("\u2264 December 31, 2023")).toBeInTheDocument();
  });

  it("renders gt and lt terms", () => {
    const { rerender } = render(
      <DateRangeTagLabel
        filter={{ field: "release_timestamp", term: "gt:2023-01-05" }}
      />
    );
    expect(screen.getByText("> January 5, 2023")).toBeInTheDocument();

    rerender(
      <DateRangeTagLabel
        filter={{ field: "release_timestamp", term: "lt:2023-01-05" }}
      />
    );
    expect(screen.getByText("< January 5, 2023")).toBeInTheDocument();
  });

  it("renders wildcard terms as Exists or None", () => {
    const { rerender } = render(
      <DateRangeTagLabel filter={{ field: "release_timestamp", term: "*" }} />
    );
    expect(screen.getByText("Exists")).toBeInTheDocument();

    rerender(
      <DateRangeTagLabel filter={{ field: "release_timestamp!", term: "*" }} />
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("renders other terms as is", () => {
    render(
      <DateRangeTagLabel
        filter={{ field: "release_timestamp", term: "gte:garbage" }}
      />
    );
    expect(screen.getByText("gte:garbage")).toBeInTheDocument();
  });
});
