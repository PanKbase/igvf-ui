/**
 * Fetches and caches the live data behind the Data Library landing page. This runs only in
 * `getServerSideProps`. Every request is an unauthenticated GET against the igvfd search API, so
 * the numbers show what an anonymous visitor can see and never vary by user, which also makes them
 * safe to share between visitors through the cache.
 *
 * Queries are batched with `limit=0` plus facets: one query per object type yields its total and
 * the facet each section needs. Results get cached per request path for five minutes. A failed
 * request gets cached only briefly, and the section it feeds disappears from the page instead of
 * showing zeros or an error.
 */

// lib
import {
  buildAnalysisTiles,
  buildAssayTiles,
  buildAutoantibodyChip,
  buildDonorChips,
  buildSearchHref,
  buildTryChips,
  HIDDEN_ANALYSIS_CATEGORIES,
  positiveTerms,
  RELEASED_STATUS,
} from "./landing";
import FetchRequest from "./fetch-request";
// types
import type { CountLink, FacetTerm } from "./landing";

/** How long a successful response stays cached. */
export const CACHE_TTL_MS = 5 * 60 * 1000;

/** How long a failed request stays cached, so a struggling backend isn't hit on every visit. */
export const FAILURE_TTL_MS = 30 * 1000;

/** Give up on a single search request after this long. */
export const REQUEST_TIMEOUT_MS = 10 * 1000;

type SearchFacet = {
  field: string;
  terms?: Array<FacetTerm>;
};

/** The parts of an igvfd search response the landing page uses. */
export type SearchResponse = {
  total?: number;
  facets?: Array<SearchFacet>;
};

/** Everything the landing page renders. Each section is empty or null when it should be hidden. */
export type LandingData = {
  stats: {
    donors: number;
    measurementSets: number;
    analysisSets: number;
  } | null;
  assayTiles: Array<CountLink>;
  analysisTiles: Array<CountLink>;
  donorChips: Array<CountLink>;
  autoantibodyChip: CountLink | null;
  /** Link to the hidden Resource category, for the Documentation block */
  resourceLink: CountLink | null;
  tryChips: Array<CountLink>;
};

/** Landing data with every live-data section hidden. */
export const EMPTY_LANDING_DATA: LandingData = {
  stats: null,
  assayTiles: [],
  analysisTiles: [],
  donorChips: [],
  autoantibodyChip: null,
  resourceLink: null,
  tryChips: [],
};

// ---------------------------------------------------------------------------------------------
// Cache

type CacheEntry = {
  expires: number;
  promise: Promise<SearchResponse | null>;
};

const cache = new Map<string, CacheEntry>();

/**
 * Empty the cache. For tests.
 */
export function clearLandingCache(): void {
  cache.clear();
}

/**
 * Send one GET request to igvfd, giving up after `REQUEST_TIMEOUT_MS`.
 * @param path Search path to request
 * @returns The response, or null if the request failed in any way
 */
async function requestSearch(path: string): Promise<SearchResponse | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), REQUEST_TIMEOUT_MS);
  });
  try {
    const request = new FetchRequest();
    const result = await Promise.race([request.getObject(path), timeout]);
    if (result && result.isOk()) {
      return result.unwrap() as unknown as SearchResponse;
    }
    return null;
  } catch (_error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Get the search response for `path` from the cache, requesting it if it's missing or stale.
 * Concurrent callers for the same path share one request.
 * @param path Search path to request, including the query string
 * @returns The response, or null if the request failed
 */
export function cachedSearch(path: string): Promise<SearchResponse | null> {
  const existing = cache.get(path);
  if (existing && existing.expires > Date.now()) {
    return existing.promise;
  }

  // Stay valid while the request is in flight so concurrent callers share it.
  const entry: CacheEntry = {
    expires: Number.POSITIVE_INFINITY,
    promise: requestSearch(path).then((response) => {
      entry.expires =
        Date.now() + (response === null ? FAILURE_TTL_MS : CACHE_TTL_MS);
      return response;
    }),
  };
  cache.set(path, entry);
  return entry.promise;
}

// ---------------------------------------------------------------------------------------------
// Queries

/**
 * Build the path of a `limit=0` search for released objects of one type, optionally with extra
 * filters.
 */
function countPath(type: string, filters = ""): string {
  return `/search/?type=${type}&status=${RELEASED_STATUS}${filters}&limit=0`;
}

/**
 * Get the terms of the named facet in a search response.
 */
function getFacetTerms(
  response: SearchResponse | null,
  field: string
): Array<FacetTerm> | null {
  if (!response) {
    return null;
  }
  return response.facets?.find((facet) => facet.field === field)?.terms || null;
}

/**
 * Get the total of a search response, or null if it isn't a positive number.
 */
function getTotal(response: SearchResponse | null): number | null {
  const total = response?.total;
  return typeof total === "number" && total > 0 ? total : null;
}

/**
 * Get all the live data for the landing page.
 * @returns Landing page data, with sections whose queries failed left empty
 */
export async function getLandingData(): Promise<LandingData> {
  const [donors, autoantibody, measurementSets, analysisSets] =
    await Promise.all([
      cachedSearch(countPath("HumanDonor")),
      cachedSearch(countPath("HumanDonor", "&aab_positive=true")),
      cachedSearch(countPath("MeasurementSet")),
      cachedSearch(countPath("AnalysisSet")),
    ]);

  const donorTotal = getTotal(donors);
  const measurementSetTotal = getTotal(measurementSets);
  const analysisSetTotal = getTotal(analysisSets);

  const assayTiles = buildAssayTiles(
    getFacetTerms(measurementSets, "assay_term.term_name")
  );
  const analysisCategoryTerms = getFacetTerms(
    analysisSets,
    "annotation_category"
  );
  const analysisTiles = buildAnalysisTiles(analysisCategoryTerms);
  const donorChips = buildDonorChips(
    getFacetTerms(donors, "diabetes_status_description")
  );

  const resourceTerm = HIDDEN_ANALYSIS_CATEGORIES.map((category) =>
    positiveTerms(analysisCategoryTerms).find((term) => term.key === category)
  ).find((term) => term !== undefined);

  return {
    stats:
      donorTotal && measurementSetTotal && analysisSetTotal
        ? {
            donors: donorTotal,
            measurementSets: measurementSetTotal,
            analysisSets: analysisSetTotal,
          }
        : null,
    assayTiles,
    analysisTiles,
    donorChips,
    autoantibodyChip: buildAutoantibodyChip(autoantibody?.total),
    resourceLink: resourceTerm
      ? {
          label: resourceTerm.key,
          count: resourceTerm.doc_count,
          href: buildSearchHref("AnalysisSet", [
            ["annotation_category", resourceTerm.key],
          ]),
        }
      : null,
    tryChips: buildTryChips({ assayTiles, donorChips, analysisTiles }),
  };
}
