import { render, screen } from "@testing-library/react";
import { FacetTermCount } from "../facet-term-count";
import StandardTitle from "../custom-facets/standard-title";

const facet = {
  field: "status",
  title: "Status",
  terms: [
    { key: "released", doc_count: 4 },
    { key: "archived", doc_count: 3 },
    { key: "deleted", doc_count: 2 },
    { key: "in progress", doc_count: 1 },
  ],
};

describe("Test <FacetTermCount>", () => {
  it("renders an indicator for each term with a descriptive label", () => {
    const searchResults = {
      filters: [
        { field: "status", term: "released" },
        { field: "status!", term: "archived" },
      ],
    };
    render(<FacetTermCount facet={facet} searchResults={searchResults} />);

    const counter = screen.getByTestId("facet-term-count-status");
    expect(counter).toHaveAttribute("aria-label", "2 selected of 4 terms");
    expect(counter.children).toHaveLength(4);
  });

  it("uses the singular for a single term", () => {
    render(
      <FacetTermCount
        facet={{ field: "status", terms: [{ key: "released", doc_count: 1 }] }}
        searchResults={{ filters: [] }}
      />
    );
    expect(screen.getByTestId("facet-term-count-status")).toHaveAttribute(
      "aria-label",
      "0 selected of 1 term"
    );
  });
});

describe("Test <StandardTitle>", () => {
  it("renders the title and term count for a regular facet", () => {
    render(
      <StandardTitle
        facet={facet}
        searchResults={{ filters: [] }}
        isFacetOpen={false}
      />
    );
    expect(screen.getByTestId("facettitle-status")).toHaveTextContent("Status");
    expect(screen.getByTestId("facet-term-count-status")).toBeInTheDocument();
  });

  it("omits the term count for boolean facets", () => {
    render(
      <StandardTitle
        facet={{
          field: "is_released",
          title: "Released",
          terms: [{ key: 1, key_as_string: "true", doc_count: 3 }],
        }}
        searchResults={{ filters: [] }}
        isFacetOpen={false}
      />
    );
    expect(screen.getByTestId("facettitle-is_released")).toHaveTextContent(
      "Released"
    );
    expect(
      screen.queryByTestId("facet-term-count-is_released")
    ).not.toBeInTheDocument();
  });
});
