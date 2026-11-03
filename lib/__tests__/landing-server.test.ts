import { err, ok } from "../result";
import {
  CACHE_TTL_MS,
  cachedSearch,
  clearLandingCache,
  EMPTY_LANDING_DATA,
  FAILURE_TTL_MS,
  getLandingData,
  REQUEST_TIMEOUT_MS,
} from "../landing-server";

const mockGetObject = jest.fn();

jest.mock("../fetch-request", () => ({
  __esModule: true,
  default: class MockFetchRequest {
    getObject(path: string) {
      return mockGetObject(path);
    }
  },
}));

type Facet = {
  field: string;
  terms: Array<{ key: string; doc_count: number }>;
};

/** Build a search response from a facet map. */
function response(
  total: number,
  facets: Record<string, Array<[string, number]>> = {},
  graph?: Array<Record<string, unknown>>
) {
  return {
    total,
    facets: Object.entries(facets).map(
      ([field, terms]): Facet => ({
        field,
        terms: terms.map(([key, count]) => ({ key, doc_count: count })),
      })
    ),
    ...(graph ? { "@graph": graph } : {}),
  };
}

const DONOR_FACETS = {
  diabetes_status_description: [
    ["Control Without Diabetes", 3112],
    ["Type 2 Diabetes", 343],
    ["Type 1 Diabetes", 255],
    ["Gestational Diabetes", 28],
  ] as Array<[string, number]>,
};

const MEASUREMENT_FACETS = {
  "assay_term.term_name": [
    ["bulk RNA-seq assay", 505],
    ["single-cell RNA sequencing assay", 367],
  ] as Array<[string, number]>,
};

const ANALYSIS_FACETS = {
  annotation_category: [
    ["Gene expression", 707],
    ["Resource", 3],
    ["Differential expression", 250],
  ] as Array<[string, number]>,
  annotation_type: [
    ["differential_expression", 250],
    ["islet_function_perifusion", 40],
  ] as Array<[string, number]>,
};

const NEWEST = {
  differential_expression: {
    "@id": "/analysis-sets/DE1/",
    accession: "DE1",
    annotation_type: "differential_expression",
    annotation_category: "Differential expression",
    release_timestamp: "2026-05-06T19:00:00+00:00",
  },
  islet_function_perifusion: {
    "@id": "/analysis-sets/PERI1/",
    accession: "PERI1",
    annotation_type: "islet_function_perifusion",
    annotation_category: "Islet function",
    release_timestamp: "2026-09-02T10:00:00+00:00",
    files: [{ href: "/tabular-files/F1/@@download/F1.tsv" }],
  },
} as Record<string, Record<string, unknown>>;

/**
 * Default backend: answers every search the landing page makes. Tests override pieces of it.
 */
function backend(path: string) {
  if (path.includes("annotation_type=")) {
    const type = decodeURIComponent(path.match(/annotation_type=([^&]+)/)![1]);
    return ok(response(1, {}, [NEWEST[type]]));
  }
  if (path.includes("aab_positive=true")) {
    return ok(response(0));
  }
  if (path.includes("type=HumanDonor")) {
    return ok(response(3739, DONOR_FACETS));
  }
  if (path.includes("type=MeasurementSet")) {
    return ok(response(1333, MEASUREMENT_FACETS));
  }
  if (path.includes("type=AnalysisSet")) {
    return ok(response(1455, ANALYSIS_FACETS));
  }
  return err({ code: 404 });
}

/** The set of paths requested so far. */
function requestedPaths(): Array<string> {
  return mockGetObject.mock.calls.map((call) => call[0]);
}

describe("getLandingData", () => {
  let now: number;
  let nowSpy: jest.SpyInstance;

  beforeEach(() => {
    now = 1_800_000_000_000;
    nowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
    clearLandingCache();
    mockGetObject.mockReset();
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(backend(path))
    );
  });

  afterEach(() => {
    nowSpy.mockRestore();
    jest.useRealTimers();
  });

  it("builds every section from the batched queries", async () => {
    const data = await getLandingData();

    expect(data.stats).toEqual({
      donors: 3739,
      measurementSets: 1333,
      analysisSets: 1455,
    });
    expect(data.assayTiles.map((t) => [t.label, t.count])).toEqual([
      ["Bulk RNA-seq", 505],
      ["scRNA-seq", 367],
    ]);
    expect(data.analysisTiles.map((t) => [t.label, t.count])).toEqual([
      ["Gene expression", 707],
      ["Differential expression", 250],
    ]);
    expect(data.donorChips.map((c) => [c.label, c.count])).toEqual([
      ["Non-diabetic", 3112],
      ["T2D", 343],
      ["T1D", 255],
      ["Other diabetes types", 28],
    ]);
    expect(data.resourceLink).toMatchObject({ label: "Resource", count: 3 });
    expect(data.tryChips.length).toBeGreaterThan(0);
  });

  it("hides the Autoantibody+ chip when its count is zero and shows it when positive", async () => {
    expect((await getLandingData()).autoantibodyChip).toBeNull();

    clearLandingCache();
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(
        path.includes("aab_positive=true") ? ok(response(299)) : backend(path)
      )
    );
    expect((await getLandingData()).autoantibodyChip).toMatchObject({
      label: "Autoantibody+",
      count: 299,
    });
  });

  it("returns the newest set of each annotation type, newest first, dated by release_timestamp", async () => {
    const { recent } = await getLandingData();
    expect(recent.map((r) => r.accession)).toEqual(["PERI1", "DE1"]);
    expect(recent[0].releasedLabel).toBe("Sep 2026");
    expect(recent[0].isDirectDownload).toBe(true);
    expect(recent[1].isDirectDownload).toBe(false);
  });

  it("issues one limit=1, release_timestamp-sorted query per annotation type", async () => {
    await getLandingData();
    const perType = requestedPaths().filter((p) =>
      p.includes("annotation_type=")
    );
    expect(perType).toHaveLength(2);
    perType.forEach((path) => {
      expect(path).toContain("type=AnalysisSet");
      expect(path).toContain("status=released");
      expect(path).toContain("sort=-release_timestamp");
      expect(path).toContain("limit=1");
      expect(path).toContain("field=release_timestamp");
    });
  });

  it("only sends GET search requests for released objects", async () => {
    await getLandingData();
    const paths = requestedPaths();
    expect(paths.length).toBeGreaterThan(0);
    paths.forEach((path) => {
      expect(path.startsWith("/search/?")).toBe(true);
      expect(path).toContain("status=released");
    });
    // Everything goes through getObject, which is the GET helper.
    expect(mockGetObject).toHaveBeenCalledTimes(paths.length);
  });

  it("batches the counts: one limit=0 query per type, plus the Autoantibody+ count", async () => {
    await getLandingData();
    const counts = requestedPaths().filter((p) => p.endsWith("&limit=0"));
    expect(counts).toEqual([
      "/search/?type=HumanDonor&status=released&limit=0",
      "/search/?type=HumanDonor&status=released&aab_positive=true&limit=0",
      "/search/?type=MeasurementSet&status=released&limit=0",
      "/search/?type=AnalysisSet&status=released&limit=0",
    ]);
  });

  it("hides a section when its query fails and leaves the others alone", async () => {
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(
        path.includes("type=MeasurementSet") && path.endsWith("&limit=0")
          ? err({ code: 500 })
          : backend(path)
      )
    );
    const data = await getLandingData();
    expect(data.assayTiles).toEqual([]);
    expect(data.stats).toBeNull(); // Needs all three totals.
    expect(data.analysisTiles.length).toBeGreaterThan(0);
    expect(data.donorChips.length).toBeGreaterThan(0);
    expect(data.recent.length).toBe(2);
  });

  it("treats a thrown request and a malformed response as a failure", async () => {
    mockGetObject.mockImplementation((path: string) => {
      if (path.includes("type=HumanDonor") && !path.includes("aab_positive")) {
        throw new Error("network down");
      }
      if (path.includes("type=MeasurementSet")) {
        return Promise.resolve(ok({ unexpected: true }));
      }
      return Promise.resolve(backend(path));
    });
    const data = await getLandingData();
    expect(data.donorChips).toEqual([]);
    expect(data.assayTiles).toEqual([]);
    expect(data.stats).toBeNull();
  });

  it("hides Recently updated if ANY per-type request fails", async () => {
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(
        path.includes("annotation_type=islet_function_perifusion")
          ? err({ code: 500 })
          : backend(path)
      )
    );
    const data = await getLandingData();
    expect(data.recent).toEqual([]);
    // The rest of the page still renders.
    expect(data.stats).not.toBeNull();
  });

  it("hides Recently updated when the annotation_type facet is missing", async () => {
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(
        path.includes("type=AnalysisSet") && !path.includes("annotation_type=")
          ? ok(
              response(1455, {
                annotation_category: ANALYSIS_FACETS.annotation_category,
              })
            )
          : backend(path)
      )
    );
    expect((await getLandingData()).recent).toEqual([]);
  });

  it("returns the empty page data when every query fails", async () => {
    mockGetObject.mockImplementation(() => Promise.resolve(err({ code: 500 })));
    expect(await getLandingData()).toEqual(EMPTY_LANDING_DATA);
  });

  it("omits stats if any total is zero", async () => {
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(
        path.includes("type=AnalysisSet") && path.endsWith("&limit=0")
          ? ok(response(0))
          : backend(path)
      )
    );
    expect((await getLandingData()).stats).toBeNull();
  });
});

describe("landing cache", () => {
  let now: number;
  let nowSpy: jest.SpyInstance;

  beforeEach(() => {
    now = 1_800_000_000_000;
    nowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
    clearLandingCache();
    mockGetObject.mockReset();
    mockGetObject.mockImplementation((path: string) =>
      Promise.resolve(backend(path))
    );
  });

  afterEach(() => {
    nowSpy.mockRestore();
    jest.useRealTimers();
  });

  it("caches for five minutes", async () => {
    expect(CACHE_TTL_MS).toBe(5 * 60 * 1000);

    await getLandingData();
    const firstLoadCalls = mockGetObject.mock.calls.length;
    expect(firstLoadCalls).toBeGreaterThan(0);

    // Just inside the TTL: no new requests.
    now += CACHE_TTL_MS - 1;
    await getLandingData();
    expect(mockGetObject).toHaveBeenCalledTimes(firstLoadCalls);

    // Past the TTL: everything gets requested again.
    now += 2;
    await getLandingData();
    expect(mockGetObject).toHaveBeenCalledTimes(firstLoadCalls * 2);
  });

  it("shares one in-flight request between concurrent callers", async () => {
    const pending: { resolve?: (value: unknown) => void } = {};
    mockGetObject.mockImplementation(
      () => new Promise((resolve) => (pending.resolve = resolve))
    );

    const first = cachedSearch("/search/?type=HumanDonor&limit=0");
    const second = cachedSearch("/search/?type=HumanDonor&limit=0");
    expect(mockGetObject).toHaveBeenCalledTimes(1);

    pending.resolve?.(ok(response(5)));
    expect(await first).toEqual(await second);
    expect(mockGetObject).toHaveBeenCalledTimes(1);
  });

  it("deduplicates concurrent page loads", async () => {
    await Promise.all([getLandingData(), getLandingData(), getLandingData()]);
    const paths = requestedPaths();
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("caches each path separately", async () => {
    await cachedSearch("/search/?type=HumanDonor&limit=0");
    await cachedSearch("/search/?type=AnalysisSet&limit=0");
    expect(mockGetObject).toHaveBeenCalledTimes(2);
  });

  it("caches a failure only briefly, then retries", async () => {
    expect(FAILURE_TTL_MS).toBe(30 * 1000);
    expect(FAILURE_TTL_MS).toBeLessThan(CACHE_TTL_MS);

    mockGetObject.mockImplementation(() => Promise.resolve(err({ code: 500 })));
    const path = "/search/?type=HumanDonor&limit=0";
    expect(await cachedSearch(path)).toBeNull();
    expect(mockGetObject).toHaveBeenCalledTimes(1);

    // Still inside the failure window: no retry, even if the backend has recovered.
    mockGetObject.mockImplementation(() => Promise.resolve(ok(response(7))));
    now += FAILURE_TTL_MS - 1;
    expect(await cachedSearch(path)).toBeNull();
    expect(mockGetObject).toHaveBeenCalledTimes(1);

    // After the failure window the request is retried and the success is cached.
    now += 2;
    expect(await cachedSearch(path)).toEqual(response(7));
    expect(mockGetObject).toHaveBeenCalledTimes(2);
    now += CACHE_TTL_MS - 1;
    await cachedSearch(path);
    expect(mockGetObject).toHaveBeenCalledTimes(2);
  });

  it("gives up on a request that never answers after the timeout and treats it as a failure", async () => {
    jest.useFakeTimers();
    mockGetObject.mockImplementation(() => new Promise(() => undefined));

    let settled = false;
    const pending = cachedSearch("/search/?type=HumanDonor&limit=0").then(
      (value) => {
        settled = true;
        return value;
      }
    );

    await jest.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1);
    expect(settled).toBe(false);

    await jest.advanceTimersByTimeAsync(1);
    expect(await pending).toBeNull();
    expect(settled).toBe(true);
  });

  it("hides the sections whose queries timed out while the rest render", async () => {
    jest.useFakeTimers();
    mockGetObject.mockImplementation((path: string) =>
      path.includes("type=MeasurementSet")
        ? new Promise(() => undefined)
        : Promise.resolve(backend(path))
    );

    const pending = getLandingData();
    await jest.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    const data = await pending;

    expect(data.assayTiles).toEqual([]);
    expect(data.stats).toBeNull();
    expect(data.donorChips.length).toBeGreaterThan(0);
  });
});
