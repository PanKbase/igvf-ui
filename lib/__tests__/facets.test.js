import {
  OPTIONAL_FACET_TYPES,
  OPTIONAL_FACETS_STORAGE_KEY,
  applyFacetOrder,
  checkForBooleanFacet,
  checkOptionalFacetsConfigurable,
  clearFacetOrder,
  clearSearchConfigCache,
  getFacetConfigForTypes,
  getFacetOpenState,
  getFacetOrder,
  getFilterTerm,
  getOptionalFacetsConfigForType,
  getOptionalFacetsFromConfig,
  getSearchConfigRegistry,
  getSpecificSearchTypes,
  getTermSelections,
  getVisibleFacets,
  getVisibleFilters,
  loadFacetConfig,
  mergeSearchConfigIntoFacets,
  reduceSearchConfigRegistry,
  saveOptionalFacetsConfigForType,
  setFacetOpenState,
  setFacetOrder,
} from "../facets";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  clearSearchConfigCache();
});

describe("Test the getFilterTerm function", () => {
  it("should return the term if it's not a wildcard", () => {
    const filter = { field: "type", term: "InVitroSystem" };
    expect(getFilterTerm(filter)).toEqual("InVitroSystem");
  });

  it("should return ANY if the term is *", () => {
    const filter = { field: "type", term: "*" };
    expect(getFilterTerm(filter)).toEqual("ANY");
  });

  it("should return NOT if the term is !*", () => {
    const filter = { field: "type!", term: "*" };
    expect(getFilterTerm(filter)).toEqual("NOT");
  });
});

describe("Test the optional facet types", () => {
  it("includes the PanKbase types that have optional facets", () => {
    [
      "HumanDonor",
      "PrimaryIslet",
      "PrimaryCell",
      "HumanBetaCellLines",
      "Biosample",
      "AnalysisSet",
      "MeasurementSet",
      "File",
    ].forEach((type) => {
      expect(OPTIONAL_FACET_TYPES).toContain(type);
      expect(checkOptionalFacetsConfigurable(type)).toBe(true);
    });
  });

  it("doesn't allow optional facets for other types or for none", () => {
    expect(checkOptionalFacetsConfigurable("Gene")).toBe(false);
    expect(checkOptionalFacetsConfigurable("")).toBe(false);
  });
});

describe("Test the getSpecificSearchTypes function", () => {
  it("returns the unique non-wildcard types", () => {
    const searchResults = {
      filters: [
        { field: "type", term: "HumanDonor" },
        { field: "type", term: "HumanDonor" },
        { field: "type", term: "*" },
        { field: "status", term: "released" },
      ],
    };
    expect(getSpecificSearchTypes(searchResults)).toEqual(["HumanDonor"]);
    expect(getSpecificSearchTypes({})).toEqual([]);
  });
});

describe("Test the getVisibleFacets function", () => {
  it("should filter out hidden facet fields", () => {
    const facets = [
      { field: "type", count: 1 },
      { field: "foo", count: 1 },
      { field: "bar", count: 1 },
    ];
    const expected = [
      { field: "foo", count: 1 },
      { field: "bar", count: 1 },
    ];
    expect(getVisibleFacets(facets)).toEqual(expected);
  });

  it("hides the internal action audit facet when not authenticated", () => {
    const facets = [
      { field: "audit.INTERNAL_ACTION.category" },
      { field: "audit.ERROR.category" },
    ];
    expect(getVisibleFacets(facets, [], "", false)).toEqual([
      { field: "audit.ERROR.category" },
    ]);
    expect(getVisibleFacets(facets, [], "", true)).toHaveLength(2);
  });

  it("shows only the optional facets the user chose for an optional type", () => {
    const facets = [
      { field: "foo" },
      { field: "opt1", optional: true },
      { field: "opt2", optional: true },
    ];
    expect(getVisibleFacets(facets, [], "HumanDonor")).toEqual([
      { field: "foo" },
    ]);
    expect(
      getVisibleFacets(facets, ["opt2"], "HumanDonor").map((f) => f.field)
    ).toEqual(["foo", "opt2"]);
  });

  it("never shows optional facets for types that don't support them", () => {
    const facets = [{ field: "opt1", optional: true }];
    expect(getVisibleFacets(facets, ["opt1"], "Gene")).toEqual([]);
    expect(getVisibleFacets(facets, ["opt1"], "")).toEqual([]);
  });
});

describe("Test the getVisibleFilters function", () => {
  it("removes hidden fields from the filters", () => {
    const filters = [
      { field: "audit.INTERNAL_ACTION.category", term: "x" },
      { field: "status", term: "released" },
    ];
    expect(getVisibleFilters(filters, false)).toEqual([filters[1]]);
    expect(getVisibleFilters(filters, true)).toEqual(filters);
  });
});

describe("Test the getTermSelections function", () => {
  it("separates selected, negative, and non-selected terms", () => {
    const facet = {
      field: "status",
      terms: [{ key: "released" }, { key: "archived" }, { key: "deleted" }],
    };
    const filters = [
      { field: "status", term: "released" },
      { field: "status!", term: "archived" },
      { field: "other", term: "x" },
    ];
    expect(getTermSelections(facet, filters)).toEqual({
      selectedTerms: ["released"],
      negativeTerms: ["archived"],
      nonSelectedTerms: ["deleted"],
    });
  });
});

describe("Test the checkForBooleanFacet function", () => {
  it("detects boolean facets", () => {
    expect(
      checkForBooleanFacet({
        terms: [{ key: 1, key_as_string: "true", doc_count: 3 }],
      })
    ).toBe(true);
    expect(checkForBooleanFacet({ terms: [{ key: "a" }] })).toBe(false);
    expect(checkForBooleanFacet({})).toBe(false);
  });
});

describe("Test optional facet configuration in localStorage", () => {
  it("returns an empty array when nothing is saved", () => {
    expect(getOptionalFacetsConfigForType("HumanDonor")).toEqual([]);
  });

  it("saves and loads the configuration by type", () => {
    saveOptionalFacetsConfigForType("HumanDonor", ["a", "b"]);
    saveOptionalFacetsConfigForType("Biosample", ["c"]);

    expect(getOptionalFacetsConfigForType("HumanDonor")).toEqual(["a", "b"]);
    expect(getOptionalFacetsConfigForType("Biosample")).toEqual(["c"]);
    expect(
      JSON.parse(localStorage.getItem(OPTIONAL_FACETS_STORAGE_KEY))
    ).toEqual({ HumanDonor: ["a", "b"], Biosample: ["c"] });

    saveOptionalFacetsConfigForType("HumanDonor", []);
    expect(getOptionalFacetsConfigForType("HumanDonor")).toEqual([]);
    expect(getOptionalFacetsConfigForType("Biosample")).toEqual(["c"]);
  });

  it("ignores invalid stored configurations", () => {
    localStorage.setItem(OPTIONAL_FACETS_STORAGE_KEY, "not json");
    expect(getOptionalFacetsConfigForType("HumanDonor")).toEqual([]);

    localStorage.setItem(
      OPTIONAL_FACETS_STORAGE_KEY,
      JSON.stringify({ HumanDonor: [1, 2] })
    );
    expect(getOptionalFacetsConfigForType("HumanDonor")).toEqual([]);
  });

  it("doesn't save without a type", () => {
    saveOptionalFacetsConfigForType("", ["a"]);
    expect(localStorage.getItem(OPTIONAL_FACETS_STORAGE_KEY)).toBeNull();
  });
});

describe("Test facet order and open state in localStorage", () => {
  it("saves, loads, and clears the facet order by type", () => {
    expect(getFacetOrder("HumanDonor")).toBeNull();
    expect(setFacetOrder("HumanDonor", ["b", "a"])).toBe(true);
    expect(getFacetOrder("HumanDonor")).toEqual(["b", "a"]);
    expect(getFacetOrder("Biosample")).toBeNull();

    clearFacetOrder("HumanDonor");
    expect(getFacetOrder("HumanDonor")).toBeNull();
  });

  it("rejects invalid facet orders and discards corrupt stored ones", () => {
    expect(setFacetOrder("HumanDonor", [1])).toBe(false);
    expect(setFacetOrder("", ["a"])).toBe(false);

    localStorage.setItem("facet-order-HumanDonor", "{bad");
    expect(getFacetOrder("HumanDonor")).toBeNull();
    expect(localStorage.getItem("facet-order-HumanDonor")).toBeNull();
  });

  it("saves and loads the open state by type", () => {
    expect(getFacetOpenState("HumanDonor")).toBeNull();
    expect(setFacetOpenState("HumanDonor", { a: true, b: false })).toBe(true);
    expect(getFacetOpenState("HumanDonor")).toEqual({ a: true, b: false });
    expect(setFacetOpenState("HumanDonor", { a: "yes" })).toBe(false);
    expect(getFacetOpenState("")).toBeNull();
  });
});

describe("Test the applyFacetOrder function", () => {
  const facets = [{ field: "a" }, { field: "b" }, { field: "c" }];

  it("returns the original order without a saved order", () => {
    expect(applyFacetOrder(facets, null)).toBe(facets);
    expect(applyFacetOrder(facets, [])).toBe(facets);
  });

  it("puts saved fields first and the rest after in original order", () => {
    expect(
      applyFacetOrder(facets, ["c", "missing", "a"]).map((f) => f.field)
    ).toEqual(["c", "a", "b"]);
  });
});

describe("Test the search-config registry reduction and merge", () => {
  const registry = {
    HumanDonor: {
      facets: {
        gender: { title: "Gender", category: "Donor" },
        t1d_stage: {
          title: "T1D Stage",
          optional: true,
          category: "Clinical",
          description: "Stage of T1D",
          extra: "ignored",
        },
      },
    },
    Biosample: {
      facets: [
        { field: "t1d_stage", optional: false },
        { field: "sample_term", optional: true },
      ],
    },
    Broken: { name: "no facets" },
  };

  it("reduces object and array facet definitions", () => {
    const reduced = reduceSearchConfigRegistry(registry);
    expect(reduced.HumanDonor.t1d_stage).toEqual({
      title: "T1D Stage",
      optional: true,
      category: "Clinical",
      description: "Stage of T1D",
    });
    expect(reduced.Biosample.sample_term).toEqual({ optional: true });
    expect(reduced.Broken).toBeUndefined();
    expect(reduceSearchConfigRegistry(null)).toEqual({});
  });

  it("combines the config of multiple types, optional only if all agree", () => {
    const reduced = reduceSearchConfigRegistry(registry);
    expect(getFacetConfigForTypes(reduced, ["HumanDonor"]).t1d_stage).toEqual({
      optional: true,
      title: "T1D Stage",
      category: "Clinical",
      description: "Stage of T1D",
    });
    const both = getFacetConfigForTypes(reduced, ["HumanDonor", "Biosample"]);
    expect(both.t1d_stage.optional).toBe(false);
    expect(both.t1d_stage.category).toBe("Clinical");
    expect(both.gender.optional).toBe(false);
    expect(getFacetConfigForTypes(reduced, ["Unknown"])).toEqual({});
  });

  it("merges optional, category, and description onto facets by field", () => {
    const facetConfig = {
      t1d_stage: {
        optional: true,
        category: "Clinical",
        description: "Stage of T1D",
        title: "Config Title",
      },
    };
    const facets = [
      { field: "t1d_stage", title: "Facet Title" },
      { field: "gender", title: "Gender" },
    ];
    const merged = mergeSearchConfigIntoFacets(facets, facetConfig);
    expect(merged[0]).toEqual({
      field: "t1d_stage",
      title: "Facet Title",
      optional: true,
      category: "Clinical",
      description: "Stage of T1D",
    });
    expect(merged[1]).toBe(facets[1]);
    expect(mergeSearchConfigIntoFacets(facets, null)).toBe(facets);
  });

  it("keeps properties already supplied on the facet", () => {
    const merged = mergeSearchConfigIntoFacets(
      [{ field: "a", title: "A", optional: false, category: "Mine" }],
      { a: { optional: true, category: "Config" } }
    );
    expect(merged[0].optional).toBe(false);
    expect(merged[0].category).toBe("Mine");
  });

  it("builds facets for config-optional facets missing from results", () => {
    const facets = getOptionalFacetsFromConfig({
      a: { optional: true, title: "A" },
      b: { optional: false },
      c: { optional: true },
    });
    expect(facets.map((f) => f.field)).toEqual(["a", "c"]);
    expect(facets[1].title).toBe("c");
    expect(getOptionalFacetsFromConfig(null)).toEqual([]);
  });
});

describe("Test the search-config registry loading and caching", () => {
  function buildRequest(registry) {
    return {
      getObject: jest.fn().mockResolvedValue({
        optional: () => registry,
      }),
    };
  }

  const registry = {
    HumanDonor: { facets: { t1d_stage: { optional: true } } },
  };

  it("fetches the registry once and caches it", async () => {
    const request = buildRequest(registry);
    const [first, second] = await Promise.all([
      getSearchConfigRegistry(request),
      getSearchConfigRegistry(request),
    ]);
    expect(first).toEqual({ HumanDonor: { t1d_stage: { optional: true } } });
    expect(second).toEqual(first);
    await getSearchConfigRegistry(request);
    expect(request.getObject).toHaveBeenCalledTimes(1);
    expect(request.getObject).toHaveBeenCalledWith("/search-config-registry/");
  });

  it("writes the reduced registry to the session cache", async () => {
    const request = buildRequest(registry);
    await getSearchConfigRegistry(request);
    expect(
      JSON.parse(sessionStorage.getItem("search-config-registry"))
    ).toEqual({ HumanDonor: { t1d_stage: { optional: true } } });
  });

  it("reads the registry from the session cache without fetching", async () => {
    sessionStorage.setItem(
      "search-config-registry",
      JSON.stringify({ HumanDonor: { a: { optional: true } } })
    );
    const request = buildRequest(registry);
    expect(await getSearchConfigRegistry(request)).toEqual({
      HumanDonor: { a: { optional: true } },
    });
    expect(request.getObject).not.toHaveBeenCalled();
  });

  it("doesn't cache failures", async () => {
    const failing = buildRequest({ isError: true });
    expect(await getSearchConfigRegistry(failing)).toBeNull();

    const working = buildRequest(registry);
    expect(await getSearchConfigRegistry(working)).not.toBeNull();
    expect(working.getObject).toHaveBeenCalledTimes(1);
  });

  it("returns null when the request throws", async () => {
    const request = {
      getObject: jest.fn().mockRejectedValue(new Error("network")),
    };
    expect(await getSearchConfigRegistry(request)).toBeNull();
  });

  it("loads the facet config for the types of the search results", async () => {
    const request = buildRequest(registry);
    const searchResults = { filters: [{ field: "type", term: "HumanDonor" }] };
    expect(await loadFacetConfig(searchResults, request)).toEqual({
      t1d_stage: { optional: true },
    });
  });

  it("returns an empty config without types and null on registry failure", async () => {
    const request = buildRequest(registry);
    expect(await loadFacetConfig({ filters: [] }, request)).toEqual({});
    expect(request.getObject).not.toHaveBeenCalled();

    const failing = buildRequest({ isError: true });
    expect(
      await loadFacetConfig(
        { filters: [{ field: "type", term: "HumanDonor" }] },
        failing
      )
    ).toBeNull();
  });
});
