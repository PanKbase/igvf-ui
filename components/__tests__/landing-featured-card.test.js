import { render, screen, within } from "@testing-library/react";
import FeaturedCard, { FeaturedGrid } from "../landing/featured-card";
import { FEATURED_DATASETS } from "../../lib/featured-datasets";

const FULL = {
  id: "full",
  category: "Islet function",
  title: "Full dataset",
  description: "Has every button.",
  downloadUrl: "https://files.example.org/full.txt.gz",
  detailsUrl: "/analysis-sets/PKBDS0000AAAA/",
  visualizeUrl: "https://tools.example.org/browser",
  visualizeTool: "Functional Browser",
};

describe("<FeaturedCard>", () => {
  it("renders the category, title, description and all three buttons", () => {
    render(<FeaturedCard dataset={FULL} />);

    expect(screen.getByText("Islet function")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Full dataset" })
    ).toBeInTheDocument();
    expect(screen.getByText("Has every button.")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("labels the buttons exactly Download, Details and Visualize, in that order", () => {
    render(<FeaturedCard dataset={FULL} />);

    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Download",
      "Details",
      "Visualize",
    ]);
  });

  it("links Download and Details to their URLs", () => {
    render(<FeaturedCard dataset={FULL} />);

    expect(screen.getByText("Download")).toHaveAttribute(
      "href",
      "https://files.example.org/full.txt.gz"
    );
    // next/link drops the trailing slash in jest, which doesn't know `trailingSlash: true`.
    expect(screen.getByText("Details").getAttribute("href")).toMatch(
      /^\/analysis-sets\/PKBDS0000AAAA\/?$/
    );
  });

  it("opens Visualize in a new tab and names the tool in its aria-label and title", () => {
    render(<FeaturedCard dataset={FULL} />);

    const visualize = screen.getByRole("link", {
      name: "Visualize in Functional Browser",
    });
    expect(visualize).toHaveAttribute("target", "_blank");
    expect(visualize).toHaveAttribute("rel", "noopener noreferrer");
    expect(visualize).toHaveAttribute(
      "title",
      "Visualize in Functional Browser"
    );
    expect(visualize).toHaveAttribute(
      "aria-label",
      "Visualize in Functional Browser"
    );
    expect(visualize).toHaveAttribute(
      "href",
      "https://tools.example.org/browser"
    );
    // The external-link icon is decorative.
    expect(visualize.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("keeps the tool name and file format off the visible button labels", () => {
    render(<FeaturedCard dataset={FULL} />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link.textContent).not.toMatch(
        /Functional Browser|\.txt|\.gz|\.rds/i
      );
    });
    expect(screen.queryByText(/Functional Browser/)).not.toBeInTheDocument();
  });

  it("opens Download and Details in the same tab", () => {
    render(<FeaturedCard dataset={FULL} />);

    expect(screen.getByText("Download")).not.toHaveAttribute("target");
    expect(screen.getByText("Details")).not.toHaveAttribute("target");
  });

  it("gives the icon-only parts and every button an accessible name that says what it is for", () => {
    render(<FeaturedCard dataset={FULL} />);

    expect(
      screen.getByRole("link", { name: "Download Full dataset" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Details for Full dataset" })
    ).toBeInTheDocument();
  });

  it("renders only Details and Visualize when there is no download", () => {
    const dataset = { ...FULL, downloadUrl: undefined };
    render(<FeaturedCard dataset={dataset} />);

    expect(screen.queryByText("Download")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Details",
      "Visualize",
    ]);
  });

  it("renders only Download and Details when there is no visualization", () => {
    const dataset = {
      ...FULL,
      visualizeUrl: undefined,
      visualizeTool: undefined,
    };
    render(<FeaturedCard dataset={dataset} />);

    expect(screen.queryByText("Visualize")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Download",
      "Details",
    ]);
  });

  it("renders only Details when it is the only link", () => {
    render(
      <FeaturedCard
        dataset={{ ...FULL, downloadUrl: undefined, visualizeUrl: undefined }}
      />
    );

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link")).toHaveTextContent("Details");
  });

  it("renders no button row at all when the card has no links", () => {
    const { container } = render(
      <FeaturedCard
        dataset={{
          id: "bare",
          category: "Resource",
          title: "Bare",
          description: "Nothing to click.",
        }}
      />
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(container.querySelector(".border-t")).toBeNull();
  });

  it("leaves no hidden placeholder for a missing button", () => {
    const dataset = { ...FULL, downloadUrl: undefined };
    render(<FeaturedCard dataset={dataset} />);

    // Only real links in the button row; no empty or aria-hidden stand-ins.
    const row = screen.getByTestId("featured-buttons");
    expect(row.children).toHaveLength(2);
    Array.from(row.children).forEach((child) => {
      expect(child.tagName).toBe("A");
      expect(child).not.toHaveAttribute("aria-hidden");
      expect(child).not.toBeEmptyDOMElement();
    });
  });

  it("keeps every label on one line, with the same styling on each button", () => {
    render(<FeaturedCard dataset={FULL} />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveClass("whitespace-nowrap");
      expect(link).toHaveClass("h-[40px]");
      expect(link).toHaveClass("min-w-0");
    });
  });

  it("puts three buttons on one row when the card is wide enough, else Download full width above Details and Visualize", () => {
    render(<FeaturedCard dataset={FULL} />);

    const row = screen.getByTestId("featured-buttons");
    // The row measures the card, not the window.
    expect(row.parentElement).toHaveClass("@container");
    // Narrow: two equal columns, with Download spanning both. Wide: three equal columns.
    expect(row).toHaveClass("grid-cols-2", "@[300px]:grid-cols-3");
    expect(screen.getByText("Download")).toHaveClass(
      "col-span-2",
      "@[300px]:col-span-1"
    );
    expect(screen.getByText("Details")).not.toHaveClass("col-span-2");
    expect(screen.getByRole("link", { name: /Visualize in/ })).not.toHaveClass(
      "col-span-2"
    );
  });

  it("splits the row equally when there are two buttons, and never strands one", () => {
    render(<FeaturedCard dataset={{ ...FULL, downloadUrl: undefined }} />);

    const row = screen.getByTestId("featured-buttons");
    expect(row).toHaveClass("grid-cols-2");
    expect(row.className).not.toMatch(/@\[/);
    screen.getAllByRole("link").forEach((link) => {
      expect(link).not.toHaveClass("col-span-2");
    });
  });

  it("makes a lone button full width", () => {
    render(
      <FeaturedCard
        dataset={{ ...FULL, downloadUrl: undefined, visualizeUrl: undefined }}
      />
    );

    expect(screen.getByTestId("featured-buttons")).toHaveClass("grid-cols-1");
  });

  it("gives Download the filled style, and Details and Visualize the outline style", () => {
    render(<FeaturedCard dataset={FULL} />);

    expect(screen.getByText("Download")).toHaveClass("bg-pkb");
    expect(screen.getByText("Details")).toHaveClass("bg-white");
    expect(screen.getByRole("link", { name: /Visualize in/ })).toHaveClass(
      "bg-white"
    );
  });
});

describe("<FeaturedGrid> with the real config", () => {
  it("renders one card per dataset, as a list", () => {
    render(<FeaturedGrid datasets={FEATURED_DATASETS} />);

    expect(screen.getAllByTestId("featured-card")).toHaveLength(8);
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
  });

  it("renders each card with exactly the buttons its config has", () => {
    render(<FeaturedGrid datasets={FEATURED_DATASETS} />);

    const cards = screen.getAllByTestId("featured-card");
    FEATURED_DATASETS.forEach((dataset, index) => {
      const labels = within(cards[index])
        .queryAllByRole("link")
        .map((link) => link.textContent);
      const expected = [
        dataset.downloadUrl && "Download",
        dataset.detailsUrl && "Details",
        dataset.visualizeUrl && "Visualize",
      ].filter(Boolean);
      expect(labels).toEqual(expected);
    });
  });

  it("shows cRE-target gene links without Download and Islet biosample metadata without Visualize", () => {
    render(<FeaturedGrid datasets={FEATURED_DATASETS} />);

    const cre = screen
      .getByRole("heading", { name: /cRE.target gene links/ })
      .closest("article");
    expect(within(cre).queryByText("Download")).not.toBeInTheDocument();
    expect(within(cre).getByText("Visualize")).toBeInTheDocument();

    const biosample = screen
      .getByRole("heading", { name: "Islet biosample metadata" })
      .closest("article");
    expect(within(biosample).getByText("Download")).toBeInTheDocument();
    expect(within(biosample).queryByText("Visualize")).not.toBeInTheDocument();
  });
});
