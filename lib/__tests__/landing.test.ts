import {
  ASSAY_LABELS,
  buildAnalysisTiles,
  buildAssayTiles,
  buildAutoantibodyChip,
  buildDonorChips,
  buildSearchHref,
  buildTryChips,
  formatShare,
  getAssayLabel,
  positiveTerms,
} from "../landing";
import type { FacetTerm } from "../landing";

describe("buildSearchHref", () => {
  it("restricts to released objects and encodes spaces as plus signs", () => {
    expect(
      buildSearchHref("MeasurementSet", [
        ["assay_term.term_name", "single-cell RNA sequencing assay"],
      ])
    ).toBe(
      "/search/?type=MeasurementSet&status=released&assay_term.term_name=single-cell+RNA+sequencing+assay"
    );
  });

  it("repeats a field to OR its values", () => {
    expect(
      buildSearchHref("HumanDonor", [
        ["diabetes_status_description", "A"],
        ["diabetes_status_description", "B"],
      ])
    ).toBe(
      "/search/?type=HumanDonor&status=released&diabetes_status_description=A&diabetes_status_description=B"
    );
  });

  it("works with no filters", () => {
    expect(buildSearchHref("HumanDonor")).toBe(
      "/search/?type=HumanDonor&status=released"
    );
  });
});

describe("positiveTerms (the count > 0 rule)", () => {
  it("drops zero, negative, missing and malformed counts and sorts largest first", () => {
    const terms = [
      { key: "zero", doc_count: 0 },
      { key: "small", doc_count: 2 },
      { key: "negative", doc_count: -1 },
      { key: "big", doc_count: 9 },
      { key: "missing" },
      { key: "string-count", doc_count: "5" },
      { key: 7, doc_count: 3 },
    ] as unknown as FacetTerm[];
    expect(positiveTerms(terms).map((t) => t.key)).toEqual(["big", "small"]);
  });

  it("returns an empty list for a null or undefined facet (failed query)", () => {
    expect(positiveTerms(null)).toEqual([]);
    expect(positiveTerms(undefined)).toEqual([]);
  });
});

describe("assay label mapping", () => {
  it("maps the four known assay terms to their display labels", () => {
    expect(getAssayLabel("bulk RNA-seq assay")).toBe("Bulk RNA-seq");
    expect(
      getAssayLabel("an analyte assay that measures the abundance of a hormone")
    ).toBe("Islet perifusion");
    expect(getAssayLabel("single-cell RNA sequencing assay")).toBe("scRNA-seq");
    expect(getAssayLabel("single-cell ATAC-seq")).toBe("snATAC-seq");
    expect(Object.keys(ASSAY_LABELS)).toHaveLength(4);
  });

  it("falls back to the raw term name for an unmapped assay", () => {
    expect(getAssayLabel("STARR-seq")).toBe("STARR-seq");
  });
});

describe("buildAssayTiles", () => {
  const terms: FacetTerm[] = [
    { key: "bulk RNA-seq assay", doc_count: 505 },
    {
      key: "an analyte assay that measures the abundance of a hormone",
      doc_count: 413,
    },
    { key: "single-cell RNA sequencing assay", doc_count: 367 },
    { key: "single-cell ATAC-seq", doc_count: 48 },
  ];

  it("builds one labeled tile per term, linking with the field and value that produced the count", () => {
    const tiles = buildAssayTiles(terms);
    expect(tiles.map((t) => [t.label, t.count])).toEqual([
      ["Bulk RNA-seq", 505],
      ["Islet perifusion", 413],
      ["scRNA-seq", 367],
      ["snATAC-seq", 48],
    ]);
    expect(tiles[1].href).toBe(
      "/search/?type=MeasurementSet&status=released&assay_term.term_name=an+analyte+assay+that+measures+the+abundance+of+a+hormone"
    );
  });

  it("shows a new, unmapped assay under its raw name", () => {
    const tiles = buildAssayTiles([
      ...terms,
      { key: "STARR-seq", doc_count: 3 },
    ]);
    expect(tiles.at(-1)).toMatchObject({ label: "STARR-seq", count: 3 });
  });

  it("renders no tile for a zero-count term", () => {
    const tiles = buildAssayTiles([
      { key: "bulk RNA-seq assay", doc_count: 505 },
      { key: "single-cell ATAC-seq", doc_count: 0 },
    ]);
    expect(tiles.map((t) => t.label)).toEqual(["Bulk RNA-seq"]);
  });

  it("renders nothing when the facet is missing", () => {
    expect(buildAssayTiles(null)).toEqual([]);
  });
});

describe("buildAnalysisTiles", () => {
  it("hides Resource, drops zero counts, and links by annotation_category", () => {
    const tiles = buildAnalysisTiles([
      { key: "Gene expression", doc_count: 707 },
      { key: "Resource", doc_count: 3 },
      { key: "Islet function", doc_count: 414 },
      { key: "Empty category", doc_count: 0 },
    ]);
    expect(tiles.map((t) => t.label)).toEqual([
      "Gene expression",
      "Islet function",
    ]);
    expect(tiles[0].href).toBe(
      "/search/?type=AnalysisSet&status=released&annotation_category=Gene+expression"
    );
  });

  it("renders nothing when the facet is missing", () => {
    expect(buildAnalysisTiles(undefined)).toEqual([]);
  });
});

describe("buildDonorChips", () => {
  const terms: FacetTerm[] = [
    { key: "Control Without Diabetes", doc_count: 3112 },
    { key: "Type 2 Diabetes", doc_count: 343 },
    { key: "Type 1 Diabetes", doc_count: 255 },
    { key: "Diabetes Unspecified", doc_count: 14 },
    { key: "Cystic Fibrosis-Related Diabetes", doc_count: 6 },
    { key: "Gestational Diabetes", doc_count: 4 },
    { key: "Monogenic Diabetes", doc_count: 4 },
  ];

  it("shows Non-diabetic, T2D and T1D, then groups the rest as Other diabetes types", () => {
    const chips = buildDonorChips(terms);
    expect(chips.map((c) => [c.label, c.count])).toEqual([
      ["Non-diabetic", 3112],
      ["T2D", 343],
      ["T1D", 255],
      ["Other diabetes types", 28],
    ]);
  });

  it("links the grouped chip with an OR of every remaining term", () => {
    const other = buildDonorChips(terms).at(-1);
    expect(other?.href).toBe(
      "/search/?type=HumanDonor&status=released" +
        "&diabetes_status_description=Diabetes+Unspecified" +
        "&diabetes_status_description=Cystic+Fibrosis-Related+Diabetes" +
        "&diabetes_status_description=Gestational+Diabetes" +
        "&diabetes_status_description=Monogenic+Diabetes"
    );
  });

  it("links single-condition chips with the facet value", () => {
    expect(buildDonorChips(terms)[1].href).toBe(
      "/search/?type=HumanDonor&status=released&diabetes_status_description=Type+2+Diabetes"
    );
  });

  it("includes a new remaining category in the group, and skips zero-count ones", () => {
    const chips = buildDonorChips([
      ...terms,
      { key: "LADA", doc_count: 2 },
      { key: "Prediabetes", doc_count: 0 },
    ]);
    const other = chips.at(-1);
    expect(other?.count).toBe(30);
    expect(other?.href).toContain("diabetes_status_description=LADA");
    expect(other?.href).not.toContain("Prediabetes");
  });

  it("omits the Other chip when no remaining category has donors", () => {
    const chips = buildDonorChips([
      { key: "Type 1 Diabetes", doc_count: 5 },
      { key: "Gestational Diabetes", doc_count: 0 },
    ]);
    expect(chips.map((c) => c.label)).toEqual(["T1D"]);
  });

  it("omits a named chip whose count is zero and renders nothing for a null facet", () => {
    expect(buildDonorChips([{ key: "Type 2 Diabetes", doc_count: 0 }])).toEqual(
      []
    );
    expect(buildDonorChips(null)).toEqual([]);
  });
});

describe("buildAutoantibodyChip", () => {
  it("filters on aab_positive=true, not aab_positive=1", () => {
    const chip = buildAutoantibodyChip(299);
    expect(chip).toMatchObject({ label: "Autoantibody+", count: 299 });
    expect(chip?.href).toBe(
      "/search/?type=HumanDonor&status=released&aab_positive=true"
    );
    expect(chip?.href).not.toContain("aab_positive=1");
  });

  it("is null when the count is zero, missing or not a number", () => {
    expect(buildAutoantibodyChip(0)).toBeNull();
    expect(buildAutoantibodyChip(null)).toBeNull();
    expect(buildAutoantibodyChip(undefined)).toBeNull();
    expect(buildAutoantibodyChip(Number.NaN)).toBeNull();
  });
});

describe("buildTryChips", () => {
  const assayTiles = buildAssayTiles([
    { key: "single-cell RNA sequencing assay", doc_count: 367 },
    {
      key: "an analyte assay that measures the abundance of a hormone",
      doc_count: 413,
    },
  ]);
  const donorChips = buildDonorChips([
    { key: "Type 1 Diabetes", doc_count: 255 },
  ]);
  const analysisTiles = buildAnalysisTiles([
    { key: "Differential expression", doc_count: 250 },
  ]);

  it("builds the four chips from real filters, in order", () => {
    const chips = buildTryChips({ assayTiles, donorChips, analysisTiles });
    expect(chips.map((c) => c.label)).toEqual([
      "scRNA-seq",
      "T1D donors",
      "Islet perifusion",
      "Differential expression",
    ]);
    expect(chips.every((c) => c.href.startsWith("/search/?type="))).toBe(true);
  });

  it("drops a chip whose underlying tile is absent", () => {
    const chips = buildTryChips({
      assayTiles,
      donorChips: [],
      analysisTiles: [],
    });
    expect(chips.map((c) => c.label)).toEqual([
      "scRNA-seq",
      "Islet perifusion",
    ]);
  });
});

describe("formatShare", () => {
  it("rounds to a whole percentage of the total", () => {
    expect(formatShare(3112, 3739)).toBe("83%");
    expect(formatShare(343, 3739)).toBe("9%");
    expect(formatShare(255, 3739)).toBe("7%");
    expect(formatShare(1, 2)).toBe("50%");
    expect(formatShare(3739, 3739)).toBe("100%");
  });

  it("shows a share above zero but under 1% as <1%, and zero as 0%", () => {
    expect(formatShare(28, 3739)).toBe("<1%");
    expect(formatShare(0, 3739)).toBe("0%");
  });

  it("returns an empty string when the share can't be computed", () => {
    expect(formatShare(5, 0)).toBe("");
    expect(formatShare(5, null)).toBe("");
    expect(formatShare(5, undefined)).toBe("");
    expect(formatShare(null, 10)).toBe("");
    expect(formatShare(-1, 10)).toBe("");
    expect(formatShare(11, 10)).toBe("");
  });
});
