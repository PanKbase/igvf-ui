import {
  ASSAY_LABELS,
  buildAnalysisTiles,
  buildAssayTiles,
  buildAutoantibodyChip,
  buildDonorChips,
  buildSearchHref,
  buildTryChips,
  formatReleaseMonth,
  getAssayLabel,
  getDownloadLink,
  getReleaseDate,
  pickRecentlyUpdated,
  positiveTerms,
  RECENT_ROW_COUNT,
} from "../landing";
import type { FacetTerm, RecentAnalysisSet } from "../landing";

const API = "https://api.example.org";

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

describe("release date handling", () => {
  it("prefers release_timestamp over submitted_files_timestamp", () => {
    expect(
      getReleaseDate({
        "@id": "/analysis-sets/A/",
        accession: "A",
        release_timestamp: "2026-05-21T20:31:21.034040+00:00",
        submitted_files_timestamp: "2025-01-01T00:00:00+00:00",
      })
    ).toBe("2026-05-21T20:31:21.034040+00:00");
  });

  it("falls back to submitted_files_timestamp, then to an empty string", () => {
    expect(
      getReleaseDate({
        "@id": "/analysis-sets/A/",
        accession: "A",
        submitted_files_timestamp: "2025-01-01T00:00:00+00:00",
      })
    ).toBe("2025-01-01T00:00:00+00:00");
    expect(getReleaseDate({ "@id": "/analysis-sets/A/", accession: "A" })).toBe(
      ""
    );
  });

  it("formats an abbreviated month and year in UTC", () => {
    expect(formatReleaseMonth("2026-05-21T20:31:21.034040+00:00")).toBe(
      "May 2026"
    );
    expect(formatReleaseMonth("2025-11-11T01:11:05.882123+00:00")).toBe(
      "Nov 2025"
    );
    // Late on Dec 31 UTC is already Jan 1 in some zones; UTC wins so server and browser agree.
    expect(formatReleaseMonth("2024-12-31T23:30:00+00:00")).toBe("Dec 2024");
    expect(formatReleaseMonth("2025-01-01T00:00:00+00:00")).toBe("Jan 2025");
  });

  it("returns an empty string for an invalid timestamp", () => {
    expect(formatReleaseMonth("not a date")).toBe("");
    expect(formatReleaseMonth("")).toBe("");
  });
});

describe("getDownloadLink", () => {
  const base = { "@id": "/analysis-sets/PKBDS1/", accession: "PKBDS1" };

  it("links straight to the file when the set has exactly one", () => {
    expect(
      getDownloadLink(
        { ...base, files: [{ href: "/tabular-files/F1/@@download/F1.txt" }] },
        API
      )
    ).toEqual({
      href: `${API}/tabular-files/F1/@@download/F1.txt`,
      isDirect: true,
    });
  });

  it("prefers a file_url over the @@download path", () => {
    expect(
      getDownloadLink(
        {
          ...base,
          files: [
            {
              href: "/x/@@download/x.txt",
              file_url: "https://s3.example/x.txt",
            },
          ],
        },
        API
      )
    ).toEqual({ href: "https://s3.example/x.txt", isDirect: true });
  });

  it("links to the object page when the set has several files", () => {
    expect(
      getDownloadLink({ ...base, files: [{ href: "/a" }, { href: "/b" }] }, API)
    ).toEqual({ href: "/analysis-sets/PKBDS1/", isDirect: false });
  });

  it("links to the object page when the set has no files or a file without a link", () => {
    expect(getDownloadLink(base, API)).toEqual({
      href: "/analysis-sets/PKBDS1/",
      isDirect: false,
    });
    expect(getDownloadLink({ ...base, files: [] }, API).isDirect).toBe(false);
    expect(getDownloadLink({ ...base, files: [{}] }, API).isDirect).toBe(false);
  });
});

describe("pickRecentlyUpdated", () => {
  function analysisSet(
    accession: string,
    annotationType: string | undefined,
    release: string | undefined,
    extra: Partial<RecentAnalysisSet> = {}
  ): RecentAnalysisSet {
    return {
      "@id": `/analysis-sets/${accession}/`,
      accession,
      annotation_type: annotationType,
      annotation_category: "Gene expression",
      release_timestamp: release,
      ...extra,
    };
  }

  it("keeps only the newest set of each annotation_type, so a batch release is one row", () => {
    const batch = Array.from({ length: 250 }, (_, i) =>
      analysisSet(
        `DE${i}`,
        "differential_expression",
        `2026-05-06T19:${String(i % 60).padStart(2, "0")}:00+00:00`
      )
    );
    const rows = pickRecentlyUpdated(
      [
        ...batch,
        analysisSet(
          "PERI1",
          "islet_function_perifusion",
          "2026-05-21T20:31:21+00:00"
        ),
      ],
      API
    );
    expect(rows).toHaveLength(2);
    expect(rows.filter((r) => r.name.startsWith("Differential"))).toHaveLength(
      1
    );
    // 19:59 is the newest minute among the batch.
    expect(rows.find((r) => r.accession.startsWith("DE"))?.accession).toBe(
      "DE59"
    );
  });

  it("sorts newest first and limits to six rows", () => {
    const types = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const sets = types.map((type, i) =>
      analysisSet(`S${i}`, type, `2026-0${i + 1}-15T00:00:00+00:00`)
    );
    const rows = pickRecentlyUpdated(sets, API);
    expect(RECENT_ROW_COUNT).toBe(6);
    expect(rows).toHaveLength(6);
    expect(rows.map((r) => r.accession)).toEqual([
      "S7",
      "S6",
      "S5",
      "S4",
      "S3",
      "S2",
    ]);
  });

  it("honors a custom limit", () => {
    const sets = ["a", "b", "c"].map((type, i) =>
      analysisSet(`S${i}`, type, `2026-0${i + 1}-01T00:00:00+00:00`)
    );
    expect(pickRecentlyUpdated(sets, API, 2)).toHaveLength(2);
  });

  it("sorts and dates by release_timestamp, not submitted_files_timestamp", () => {
    const rows = pickRecentlyUpdated(
      [
        // Submitted long ago but released recently.
        analysisSet("OLDFILES", "a", "2026-09-11T18:00:00+00:00", {
          submitted_files_timestamp: "2024-01-01T00:00:00+00:00",
        }),
        // Submitted recently but released earlier.
        analysisSet("NEWFILES", "b", "2026-03-01T00:00:00+00:00", {
          submitted_files_timestamp: "2026-12-01T00:00:00+00:00",
        }),
      ],
      API
    );
    expect(rows.map((r) => r.accession)).toEqual(["OLDFILES", "NEWFILES"]);
    expect(rows[0]).toMatchObject({
      released: "2026-09-11T18:00:00+00:00",
      releasedLabel: "Sep 2026",
    });
  });

  it("uses submitted_files_timestamp only when release_timestamp is missing", () => {
    const rows = pickRecentlyUpdated(
      [
        analysisSet("FALLBACK", "a", undefined, {
          submitted_files_timestamp: "2025-06-01T00:00:00+00:00",
        }),
      ],
      API
    );
    expect(rows[0].releasedLabel).toBe("Jun 2025");
  });

  it("skips sets with no annotation_type or no date", () => {
    const rows = pickRecentlyUpdated(
      [
        analysisSet("NOTYPE", undefined, "2026-01-01T00:00:00+00:00"),
        analysisSet("NODATE", "a", undefined),
        analysisSet("OK", "b", "2026-01-01T00:00:00+00:00"),
      ],
      API
    );
    expect(rows.map((r) => r.accession)).toEqual(["OK"]);
  });

  it("names rows by annotation type title, falling back to the raw type, and keeps the accession", () => {
    const rows = pickRecentlyUpdated(
      [
        analysisSet(
          "P",
          "islet_function_perifusion",
          "2026-02-01T00:00:00+00:00"
        ),
        analysisSet("Q", "brand_new_type", "2026-01-01T00:00:00+00:00"),
      ],
      API
    );
    expect(rows[0]).toMatchObject({
      name: "Per-donor dynamic perifusion analysis",
      accession: "P",
      path: "/analysis-sets/P/",
      category: "Gene expression",
    });
    expect(rows[1].name).toBe("brand_new_type");
  });

  it("builds a direct download link for single-file sets and an object-page link otherwise", () => {
    const rows = pickRecentlyUpdated(
      [
        analysisSet("ONE", "a", "2026-03-01T00:00:00+00:00", {
          files: [{ href: "/tabular-files/F/@@download/F.tsv" }],
        }),
        analysisSet("MANY", "b", "2026-02-01T00:00:00+00:00", {
          files: [{ href: "/x" }, { href: "/y" }],
        }),
        analysisSet("NONE", "c", "2026-01-01T00:00:00+00:00"),
      ],
      API
    );
    expect(rows[0]).toMatchObject({
      downloadHref: `${API}/tabular-files/F/@@download/F.tsv`,
      isDirectDownload: true,
    });
    expect(rows[1]).toMatchObject({
      downloadHref: "/analysis-sets/MANY/",
      isDirectDownload: false,
    });
    expect(rows[2]).toMatchObject({
      downloadHref: "/analysis-sets/NONE/",
      isDirectDownload: false,
    });
  });

  it("returns no rows for no input", () => {
    expect(pickRecentlyUpdated([], API)).toEqual([]);
  });
});
