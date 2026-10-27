/**
 * Pure logic for the Data Library landing page: building search links, mapping facet terms to
 * tiles and chips, and picking the "Recently updated" rows. Nothing in here touches the network;
 * `landing-server.ts` fetches the data and calls these functions.
 */

// lib
import { getAnnotationTypeTitle } from "./annotation-type";

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

/** One row of the Recently updated table. All properties survive JSON serialization. */
export type RecentRow = {
  accession: string;
  /** Path to the analysis set's object page */
  path: string;
  /** Display name; the annotation type's title */
  name: string;
  category: string;
  /** Release date in ISO 8601 format, from `release_timestamp` */
  released: string;
  /** Released month and year for display, e.g. "May 2026" */
  releasedLabel: string;
  /** Download link; the single file, or the object page when the set has other than one file */
  downloadHref: string;
  /** True if `downloadHref` goes straight to a file rather than to the object page */
  isDirectDownload: boolean;
};

/** Analysis set as requested for the Recently updated rows. */
export type RecentAnalysisSet = {
  "@id": string;
  accession: string;
  annotation_type?: string;
  annotation_category?: string;
  release_timestamp?: string;
  submitted_files_timestamp?: string;
  files?: Array<{ href?: string; file_url?: string }>;
};

// ---------------------------------------------------------------------------------------------
// Constants

/** Number of rows in the Recently updated table. */
export const RECENT_ROW_COUNT = 6;

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

// ---------------------------------------------------------------------------------------------
// Recently updated

/**
 * Get the timestamp to sort and display an analysis set by. This is `release_timestamp`, the
 * date igvfd assigns when an object is released. Only when a set lacks it does this fall back to
 * `submitted_files_timestamp`.
 * @param analysisSet Analysis set to get the date of
 * @returns ISO 8601 timestamp, or an empty string if the set has neither
 */
export function getReleaseDate(analysisSet: RecentAnalysisSet): string {
  return (
    analysisSet.release_timestamp || analysisSet.submitted_files_timestamp || ""
  );
}

/**
 * Format a timestamp as an abbreviated month and year in UTC, e.g. "May 2026". UTC keeps server
 * and browser renderings identical.
 * @param timestamp ISO 8601 timestamp
 * @returns Month and year, or an empty string for an invalid timestamp
 */
export function formatReleaseMonth(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Get where the Download button of an analysis set should go. A set with exactly one file links
 * straight to that file's download. A set with several files, or none, links to its object page
 * where the files get listed.
 * @param analysisSet Analysis set with its `files` embedded
 * @param apiUrl Public URL of igvfd, to prefix `@@download` paths
 * @returns Link and whether it goes directly to a file
 */
export function getDownloadLink(
  analysisSet: RecentAnalysisSet,
  apiUrl: string
): { href: string; isDirect: boolean } {
  const files = analysisSet.files || [];
  if (files.length === 1) {
    const [file] = files;
    if (file.file_url) {
      return { href: file.file_url, isDirect: true };
    }
    if (file.href) {
      return { href: `${apiUrl}${file.href}`, isDirect: true };
    }
  }
  return { href: analysisSet["@id"], isDirect: false };
}

/**
 * Pick the rows of the Recently updated table. Takes the newest analysis set of each
 * `annotation_type`, sorts those newest first, and keeps the first `limit`. A batch release of
 * hundreds of sets of one type therefore appears as a single row.
 * @param analysisSets Candidate released analysis sets; need not be sorted or unique per type
 * @param apiUrl Public URL of igvfd, to build file download links
 * @param limit Maximum number of rows
 * @returns Table rows, newest release first
 */
export function pickRecentlyUpdated(
  analysisSets: ReadonlyArray<RecentAnalysisSet>,
  apiUrl: string,
  limit = RECENT_ROW_COUNT
): Array<RecentRow> {
  // Newest set of each annotation type.
  const newestByType = new Map<string, RecentAnalysisSet>();
  analysisSets.forEach((analysisSet) => {
    const type = analysisSet.annotation_type;
    if (!type || !getReleaseDate(analysisSet)) {
      return;
    }
    const current = newestByType.get(type);
    if (
      !current ||
      new Date(getReleaseDate(analysisSet)).getTime() >
        new Date(getReleaseDate(current)).getTime()
    ) {
      newestByType.set(type, analysisSet);
    }
  });

  return Array.from(newestByType.values())
    .sort(
      (a, b) =>
        new Date(getReleaseDate(b)).getTime() -
        new Date(getReleaseDate(a)).getTime()
    )
    .slice(0, limit)
    .map((analysisSet) => {
      const released = getReleaseDate(analysisSet);
      const download = getDownloadLink(analysisSet, apiUrl);
      return {
        accession: analysisSet.accession,
        path: analysisSet["@id"],
        name: getAnnotationTypeTitle(analysisSet.annotation_type as string),
        category: analysisSet.annotation_category || "",
        released,
        releasedLabel: formatReleaseMonth(released),
        downloadHref: download.href,
        isDirectDownload: download.isDirect,
      };
    });
}
