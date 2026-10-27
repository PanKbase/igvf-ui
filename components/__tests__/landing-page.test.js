import { act, fireEvent, render, screen, within } from "@testing-library/react";
import "../__mocks__/navigator";
import FeaturedPage from "../landing/featured-page";
import LandingPage from "../landing/landing-page";
import LandingWhatsNew from "../landing/landing-whats-new";
import {
  FEATURED_DATASETS,
  LANDING_FEATURED_COUNT,
} from "../../lib/featured-datasets";
import { EMPTY_LANDING_DATA } from "../../lib/landing-server";
import { buildSearchHref } from "../../lib/landing";
import { WHATS_NEW } from "../../lib/whats-new";

/**
 * Assert an anchor's href. In jest, `next/link` doesn't know the app's `trailingSlash: true`
 * setting and strips the slash before a path's end or query string, so compare without it.
 */
function expectHref(element, expected) {
  function strip(href) {
    return href.replace(/\/(\?|$)/, "$1");
  }
  expect(strip(element.getAttribute("href"))).toBe(strip(expected));
}

const FULL_DATA = {
  stats: { donors: 3739, measurementSets: 1333, analysisSets: 1455 },
  assayTiles: [
    {
      label: "Bulk RNA-seq",
      count: 505,
      href: "/search/?type=MeasurementSet&status=released&assay_term.term_name=bulk+RNA-seq+assay",
      icon: "bulk",
    },
    {
      label: "scRNA-seq",
      count: 367,
      href: "/search/?type=MeasurementSet&status=released&assay_term.term_name=single-cell+RNA+sequencing+assay",
      icon: "sc",
    },
  ],
  analysisTiles: [
    {
      label: "Gene expression",
      count: 707,
      href: "/search/?type=AnalysisSet&status=released&annotation_category=Gene+expression",
    },
  ],
  donorChips: [
    {
      label: "Non-diabetic",
      count: 3112,
      href: "/search/?type=HumanDonor&status=released&diabetes_status_description=Control+Without+Diabetes",
    },
    {
      label: "T2D",
      count: 343,
      href: "/search/?type=HumanDonor&status=released&diabetes_status_description=Type+2+Diabetes",
    },
  ],
  autoantibodyChip: {
    label: "Autoantibody+",
    count: 299,
    href: "/search/?type=HumanDonor&status=released&aab_positive=true",
  },
  resourceLink: {
    label: "Resource",
    count: 3,
    href: "/search/?type=AnalysisSet&status=released&annotation_category=Resource",
  },
  tryChips: [
    {
      label: "scRNA-seq",
      count: 367,
      href: "/search/?type=MeasurementSet&status=released",
    },
    {
      label: "T1D donors",
      count: 255,
      href: "/search/?type=HumanDonor&status=released&diabetes_status_description=Type+1+Diabetes",
    },
  ],
};

describe("<LandingPage> hero", () => {
  it("renders the H1, with no subtitle", () => {
    render(<LandingPage data={FULL_DATA} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("PanKbase Data Library");
    // The H1's next sibling is the accent rule, then the form: no paragraph in between.
    expect(h1.nextElementSibling.tagName).toBe("DIV");
    expect(h1.nextElementSibling.nextElementSibling.tagName).toBe("FORM");
  });

  it("renders a search form that submits to /search/ with the searchTerm parameter", () => {
    render(<LandingPage data={FULL_DATA} />);

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/search/");
    expect(form.getAttribute("method").toLowerCase()).toBe("get");
    const input = within(form).getByRole("searchbox", {
      name: "Search the PanKbase Data Library",
    });
    expect(input).toHaveAttribute("name", "searchTerm");
    expect(
      within(form).getByRole("button", { name: "Search" })
    ).toHaveAttribute("type", "submit");
  });

  it("links the Data breadcrumb and the user guide", () => {
    render(<LandingPage data={FULL_DATA} />);

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expectHref(
      within(breadcrumb).getByRole("link", { name: "Data" }),
      "/browse/"
    );
    expect(within(breadcrumb).getByText("Data Library")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expectHref(
      screen.getByRole("link", { name: "New here? Read the user guide →" }),
      "/help/general-help/user-guide/"
    );
  });

  it("renders the Try chips from the data as real filter links", () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(screen.getByText("Try:")).toBeInTheDocument();
    const hero = screen.getByRole("region", { name: "Search" });
    expectHref(
      within(hero).getByRole("link", { name: "scRNA-seq" }),
      "/search/?type=MeasurementSet&status=released"
    );
    expect(
      within(hero).getByRole("link", { name: "T1D donors" })
    ).toBeInTheDocument();
  });

  it("omits the Try label when there are no chips", () => {
    render(<LandingPage data={{ ...FULL_DATA, tryChips: [] }} />);

    expect(screen.queryByText("Try:")).not.toBeInTheDocument();
  });
});

describe("<LandingPage> live sections", () => {
  it("shows exactly three stats with their formatted numbers", () => {
    render(<LandingPage data={FULL_DATA} />);

    const stats = screen.getByRole("region", { name: "Library statistics" });
    const items = within(stats).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "3,739donors",
      "1,333measurement sets",
      "1,455analysis sets",
    ]);
    // Three equal columns at every width; never a two-column grid with an empty cell.
    expect(within(stats).getByRole("list")).toHaveClass("grid-cols-3");
    expect(within(stats).getByRole("list")).not.toHaveClass("grid-cols-2");
  });

  it("shows assay and analysis tiles with counts that link to filtered searches", () => {
    render(<LandingPage data={FULL_DATA} />);

    const assaySection = screen.getByRole("region", {
      name: "Browse by assay",
    });
    const assay = within(assaySection).getByRole("link", {
      name: /Bulk RNA-seq/,
    });
    expect(assay).toHaveTextContent("505");
    expectHref(
      assay,
      "/search/?type=MeasurementSet&status=released&assay_term.term_name=bulk+RNA-seq+assay"
    );
    const analysisSection = screen.getByRole("region", {
      name: "Browse by analysis",
    });
    const analysis = within(analysisSection).getByRole("link", {
      name: /Gene expression/,
    });
    expect(analysis).toHaveTextContent("707");
  });

  it("shows condition chips and a separate Autoantibody+ chip that filters with aab_positive=true", () => {
    render(<LandingPage data={FULL_DATA} />);

    const donors = screen.getByRole("region", { name: "Find donors" });
    const conditions = within(donors).getByRole("list", { name: "Condition" });
    expect(within(conditions).getAllByRole("listitem")).toHaveLength(2);
    expect(
      within(conditions).queryByText("Autoantibody+")
    ).not.toBeInTheDocument();

    expect(within(donors).getByText("Overlapping filter")).toBeInTheDocument();
    const aab = within(donors).getByRole("link", { name: /Autoantibody\+/ });
    expect(aab).toHaveAttribute(
      "href",
      expect.stringContaining("aab_positive=true")
    );
    expect(aab.getAttribute("href")).not.toContain("aab_positive=1");
    expect(aab).toHaveTextContent("299");
    // No collection chips.
    expect(within(donors).queryByText(/collection/i)).not.toBeInTheDocument();
    expectHref(
      within(donors).getByRole("link", { name: /Browse all donors/ }),
      buildSearchHref("HumanDonor")
    );
  });

  it("omits the Autoantibody+ chip when it is null", () => {
    render(<LandingPage data={{ ...FULL_DATA, autoantibodyChip: null }} />);

    expect(screen.queryByText("Autoantibody+")).not.toBeInTheDocument();
    expect(screen.queryByText("Overlapping filter")).not.toBeInTheDocument();
  });
});

describe("<LandingPage> What's new", () => {
  it("replaces Recently updated: no table, no download buttons, no accessions", () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(
      screen.queryByRole("heading", { name: "Recently updated" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    const section = screen.getByRole("region", { name: "What's new" });
    expect(
      within(section).queryByRole("link", { name: /download/i })
    ).not.toBeInTheDocument();
    expect(within(section).queryByText(/PKB/)).not.toBeInTheDocument();
  });

  it("shows the three newest notes with date, title link and summary, and links All updates to the News page", () => {
    render(<LandingPage data={FULL_DATA} />);

    const section = screen.getByRole("region", { name: "What's new" });
    expect(
      within(section).getByRole("heading", { level: 2, name: "What's new" })
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("link", { name: "All updates →" })
    ).toHaveAttribute("href", "https://pankbase.org/news.html");

    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.querySelector("time").textContent)).toEqual(
      ["Sep 2026", "May 2026", "May 2026"]
    );
    expect(items.map((item) => item.querySelector("time").dateTime)).toEqual([
      "2026-09",
      "2026-05",
      "2026-05",
    ]);
    WHATS_NEW.slice(0, 3).forEach((note, index) => {
      const item = within(items[index]);
      expect(item.getByRole("link", { name: note.title })).toHaveAttribute(
        "href",
        note.href
      );
      expect(item.getByText(note.summary)).toBeInTheDocument();
    });
  });

  it("lays the cards out as one row from md up and stacks them below", () => {
    render(<LandingPage data={FULL_DATA} />);

    const list = within(
      screen.getByRole("region", { name: "What's new" })
    ).getByRole("list");
    expect(list).toHaveClass("grid-cols-1", "md:grid-cols-3");
  });

  it("renders no section when there are no notes", () => {
    const { container } = render(<LandingWhatsNew notes={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe("<LandingPage> with no live data", () => {
  it("hides every live section but keeps the static ones", () => {
    render(<LandingPage data={EMPTY_LANDING_DATA} />);

    expect(
      screen.queryByRole("region", { name: "Library statistics" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Browse by assay" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Browse by analysis" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Find donors" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Recently updated" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Try:")).not.toBeInTheDocument();
    // No zeros or error text in place of the hidden sections.
    expect(screen.queryByText(/\b0\b/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/error|failed|unavailable/i)
    ).not.toBeInTheDocument();

    // Static content still renders.
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Featured datasets" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What's new" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "For developers" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Documentation" })
    ).toBeInTheDocument();
    expect(screen.getByText("Using PanKbase data?")).toBeInTheDocument();
  });

  it("hides one section when only its data is empty", () => {
    render(<LandingPage data={{ ...FULL_DATA, assayTiles: [] }} />);

    expect(
      screen.queryByRole("heading", { name: "Browse by assay" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Browse by analysis" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Find donors" })
    ).toBeInTheDocument();
  });

  it("hides the stats strip when stats is null", () => {
    render(<LandingPage data={{ ...FULL_DATA, stats: null }} />);

    expect(
      screen.queryByRole("region", { name: "Library statistics" })
    ).not.toBeInTheDocument();
  });
});

describe("featured datasets on the landing page and the Featured page", () => {
  it("shows exactly the first four cards on the landing page, plus All featured", () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(LANDING_FEATURED_COUNT).toBe(4);
    const cards = screen.getAllByTestId("featured-card");
    expect(cards).toHaveLength(4);
    expect(
      cards.map((card) => within(card).getByRole("heading").textContent)
    ).toEqual(FEATURED_DATASETS.slice(0, 4).map((d) => d.title));

    expectHref(
      screen.getByRole("link", { name: "All featured →" }),
      "/test-homepage/featured/"
    );
  });

  it("shows all eight cards on the Featured datasets page", () => {
    render(<FeaturedPage />);

    expect(screen.getAllByTestId("featured-card")).toHaveLength(8);
    expect(
      screen.getByRole("heading", { level: 1, name: "Featured datasets" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "All 8 datasets" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Curated datasets and resources from the PanKbase Data Library."
      )
    ).toBeInTheDocument();
  });

  it("links the Featured page back to the Data Library", () => {
    render(<FeaturedPage />);

    expectHref(
      screen.getByRole("link", { name: "← Back to Data Library" }),
      "/test-homepage/"
    );
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expectHref(
      within(breadcrumb).getByRole("link", { name: "Data Library" }),
      "/test-homepage/"
    );
    expect(within(breadcrumb).getByText("Featured datasets")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("uses the same cards on both pages, so the landing four are the first four of the eight", () => {
    const { unmount } = render(<LandingPage data={FULL_DATA} />);
    const landingTitles = screen
      .getAllByTestId("featured-card")
      .map((card) => within(card).getByRole("heading").textContent);
    unmount();

    render(<FeaturedPage />);
    const featuredTitles = screen
      .getAllByTestId("featured-card")
      .map((card) => within(card).getByRole("heading").textContent);
    expect(featuredTitles.slice(0, 4)).toEqual(landingTitles);
  });
});

describe("<LandingPage> developer, documentation and citation blocks", () => {
  it("shows the curl example and copies it to the clipboard", async () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(
      screen.getByText(/^curl "https:\/\/data\.pankbase\.org\/search\//)
    ).toBeInTheDocument();
    const copy = screen.getByRole("button", { name: "Copy curl command" });
    await act(async () => {
      fireEvent.click(copy);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText.mock.calls[0][0]).toMatch(
      /^curl "https:\/\/data\.pankbase\.org\/search\/\?type=MeasurementSet/
    );
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("links the API reference, scripts, schema and standards", () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(screen.getByRole("link", { name: "API reference" })).toHaveAttribute(
      "href",
      "https://pankbase.github.io/pankbase-client-openapi-spec"
    );
    expect(
      screen.getByRole("link", { name: /Example scripts/ })
    ).toHaveAttribute(
      "href",
      "https://github.com/PanKbase/PanKbase-data-library-scripts"
    );
    expectHref(screen.getByRole("link", { name: "Schema" }), "/profiles/");
  });

  it("lists the Resource analysis sets in Documentation only when there is a Resource link", () => {
    const { unmount } = render(<LandingPage data={FULL_DATA} />);
    expectHref(
      screen.getByRole("link", { name: /Resource analysis sets/ }),
      FULL_DATA.resourceLink.href
    );
    unmount();

    render(<LandingPage data={{ ...FULL_DATA, resourceLink: null }} />);
    expect(
      screen.queryByRole("link", { name: /Resource analysis sets/ })
    ).not.toBeInTheDocument();
  });

  it("links How to cite to the policies page", () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(
      screen.getByRole("link", { name: "How to cite and data-use policies" })
    ).toHaveAttribute("href", "https://pankbase.org/policies.html");
  });
});

describe("<LandingPage> headings", () => {
  it("has one h1 and section headings at h2", () => {
    render(<LandingPage data={FULL_DATA} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent)
    ).toEqual(
      expect.arrayContaining([
        "Browse by assay",
        "Browse by analysis",
        "Find donors",
        "Featured datasets",
        "What's new",
        "For developers",
        "Documentation",
      ])
    );
  });
});
