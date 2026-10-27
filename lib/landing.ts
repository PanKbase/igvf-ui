/**
 * Pure logic for the Data Library landing page: building search links, mapping facet terms to
 * tiles and chips. Nothing in here touches the network; `landing-server.ts` fetches the data and
 * calls these functions.
 */

// ---------------------------------------------------------------------------------------------
// Types

/** One bucket of a search facet, as igvfd returns it. */
export type FacetTerm = {
  key: string;
  doc_count: number;
};

/** Names of the icons the landing page components know how to draw. */
export type LandingIcon =
  | "rna"
  | "perifusion"
  | "singleCell"
  | "atac"
  | "chart"
  | "differential";

/** A tile or chip that links to a pre-filtered search. */
export type CountLink = {
  label: string;
  count: number;
  href: string;
  icon?: LandingIcon;
};

// ---------------------------------------------------------------------------------------------
// Constants

/** Only released objects show on the landing page. */
export const RELEASED_STATUS = "released";

/**
 * Display labels for the `assay_term.term_name` facet of MeasurementSet. Terms not in this map
 * show their raw term name so that new assays appear without a code change.
 */
export const ASSAY_LABELS: Readonly<Record<string, string>> = {
  "bulk RNA-seq assay": "Bulk RNA-seq",
  "an analyte assay that measures the abundance of a hormone":
    "Islet perifusion",
  "single-cell RNA sequencing assay": "scRNA-seq",
  "single-cell ATAC-seq": "snATAC-seq",
};

const ASSAY_ICONS: Readonly<Record<string, LandingIcon>> = {
  "Bulk RNA-seq": "rna",
  "Islet perifusion": "perifusion",
  "scRNA-seq": "singleCell",
  "snATAC-seq": "atac",
};

/** `annotation_category` values that don't get a tile. They get linked from Documentation. */
export const HIDDEN_ANALYSIS_CATEGORIES: ReadonlyArray<string> = ["Resource"];

const ANALYSIS_ICONS: Readonly<Record<string, LandingIcon>> = {
  "Gene expression": "chart",
  "Islet function": "perifusion",
  "Differential expression": "differential",
  "Chromatin accessibility": "atac",
};

/** Donor conditions shown as their own chip, in display order. */
export const DONOR_CONDITIONS: ReadonlyArray<{ label: string; term: string }> =
  [
    { label: "Non-diabetic", term: "Control Without Diabetes" },
    { label: "T2D", term: "Type 2 Diabetes" },
    { label: "T1D", term: "Type 1 Diabetes" },
  ];

/** Label of the chip that groups every condition without its own chip. */
export const OTHER_DONOR_CONDITIONS_LABEL = "Other diabetes types";

// ---------------------------------------------------------------------------------------------
// Links

type QueryParam = readonly [string, string];

/**
 * Build a path to a pre-filtered search. Spaces encode as "+", matching the links people share
 * from the search page. Always restricts to released objects so the result count equals the
 * number shown on the landing page.
 * @param type Object type to search, e.g. "HumanDonor"
 * @param filters Field/value pairs; repeat a field to OR its values
 * @returns Path with query string, starting with /search/
 */
export function buildSearchHref(
  type: string,
  filters: ReadonlyArray<QueryParam> = []
): string {
  const query = new URLSearchParams();
  query.append("type", type);
  query.append("status", RELEASED_STATUS);
  filters.forEach(([field, value]) => query.append(field, value));
  return `/search/?${query.toString()}`;
}

// ---------------------------------------------------------------------------------------------
// Facet terms to tiles and chips

/**
 * Keep only facet terms with a count above zero, largest first. Entries with a missing or
 * non-numeric count get dropped. This is the "no empty entry points" rule.
 * @param terms Facet terms from a search response
 * @returns Terms to render
 */
export function positiveTerms(
  terms: ReadonlyArray<FacetTerm> | null | undefined
): Array<FacetTerm> {
  return (terms || [])
    .filter(
      (term) =>
        typeof term?.key === "string" &&
        typeof term?.doc_count === "number" &&
        term.doc_count > 0
    )
    .sort((a, b) => b.doc_count - a.doc_count);
}

/**
 * Get the display label for an assay term name, falling back to the raw term name.
 * @param termName `assay_term.term_name` facet value
 * @returns Label for the tile
 */
export function getAssayLabel(termName: string): string {
  return ASSAY_LABELS[termName] || termName;
}

/**
 * Build the Browse by assay tiles from the MeasurementSet `assay_term.term_name` facet.
 * @param terms Facet terms of `assay_term.term_name`
 * @returns One tile per term with a positive count
 */
export function buildAssayTiles(
  terms: ReadonlyArray<FacetTerm> | null | undefined
): Array<CountLink> {
  return positiveTerms(terms).map((term) => {
    const label = getAssayLabel(term.key);
    return {
      label,
      count: term.doc_count,
      href: buildSearchHref("MeasurementSet", [
        ["assay_term.term_name", term.key],
      ]),
      icon: ASSAY_ICONS[label] || "chart",
    };
  });
}

/**
 * Build the Browse by analysis tiles from the AnalysisSet `annotation_category` facet, leaving out
 * the hidden categories (Resource).
 * @param terms Facet terms of `annotation_category`
 * @returns One tile per visible term with a positive count
 */
export function buildAnalysisTiles(
  terms: ReadonlyArray<FacetTerm> | null | undefined
): Array<CountLink> {
  return positiveTerms(terms)
    .filter((term) => !HIDDEN_ANALYSIS_CATEGORIES.includes(term.key))
    .map((term) => ({
      label: term.key,
      count: term.doc_count,
      href: buildSearchHref("AnalysisSet", [["annotation_category", term.key]]),
      icon: ANALYSIS_ICONS[term.key] || "chart",
    }));
}

/**
 * Build the Find donors condition chips from the HumanDonor `diabetes_status_description` facet.
 * Non-diabetic, T2D and T1D get their own chips; every other term with donors gets grouped into
 * "Other diabetes types", whose count is the sum of those terms and whose link filters on all of
 * them. A donor has only one diabetes status, so the sum doesn't double count.
 * @param terms Facet terms of `diabetes_status_description`
 * @returns Condition chips with a positive count, in display order
 */
export function buildDonorChips(
  terms: ReadonlyArray<FacetTerm> | null | undefined
): Array<CountLink> {
  const available = positiveTerms(terms);
  const namedTerms = DONOR_CONDITIONS.map((condition) => condition.term);

  const chips: Array<CountLink> = [];
  DONOR_CONDITIONS.forEach((condition) => {
    const match = available.find((term) => term.key === condition.term);
    if (match) {
      chips.push({
        label: condition.label,
        count: match.doc_count,
        href: buildSearchHref("HumanDonor", [
          ["diabetes_status_description", match.key],
        ]),
      });
    }
  });

  const others = available.filter((term) => !namedTerms.includes(term.key));
  if (others.length > 0) {
    chips.push({
      label: OTHER_DONOR_CONDITIONS_LABEL,
      count: others.reduce((sum, term) => sum + term.doc_count, 0),
      href: buildSearchHref(
        "HumanDonor",
        others.map((term) => ["diabetes_status_description", term.key] as const)
      ),
    });
  }
  return chips;
}

/**
 * Build the Autoantibody+ chip. igvfd's search rejects `aab_positive=1` with a server error, so
 * this filters on `aab_positive=true`, the facet's `key_as_string`.
 * @param count Number of released donors with `aab_positive=true`
 * @returns The chip, or null when the count isn't above zero
 */
export function buildAutoantibodyChip(
  count: number | null | undefined
): CountLink | null {
  if (typeof count !== "number" || !(count > 0)) {
    return null;
  }
  return {
    label: "Autoantibody+",
    count,
    href: buildSearchHref("HumanDonor", [["aab_positive", "true"]]),
  };
}

/**
 * Chips in the hero's "Try:" row, in display order. Each names an existing tile or chip, so it
 * links to a real filter and disappears when its count isn't above zero.
 */
const TRY_CHIPS: ReadonlyArray<{
  source: "assay" | "donor" | "analysis";
  label: string;
  chipLabel: string;
}> = [
  { source: "assay", label: "scRNA-seq", chipLabel: "scRNA-seq" },
  { source: "donor", label: "T1D", chipLabel: "T1D donors" },
  { source: "assay", label: "Islet perifusion", chipLabel: "Islet perifusion" },
  {
    source: "analysis",
    label: "Differential expression",
    chipLabel: "Differential expression",
  },
];

/**
 * Build the hero's "Try:" chips from the tiles and chips already built for the page.
 * @param sources Assay tiles, donor chips and analysis tiles
 * @returns Chips whose underlying filter has a positive count
 */
export function buildTryChips(sources: {
  assayTiles: ReadonlyArray<CountLink>;
  donorChips: ReadonlyArray<CountLink>;
  analysisTiles: ReadonlyArray<CountLink>;
}): Array<CountLink> {
  const lists = {
    assay: sources.assayTiles,
    donor: sources.donorChips,
    analysis: sources.analysisTiles,
  };
  const chips: Array<CountLink> = [];
  TRY_CHIPS.forEach(({ source, label, chipLabel }) => {
    const match = lists[source].find((item) => item.label === label);
    if (match && match.count > 0) {
      chips.push({ ...match, label: chipLabel });
    }
  });
  return chips;
}
