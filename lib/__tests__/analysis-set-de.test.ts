import {
  DE_COMPARISON_CLASS_SHORT_TITLES,
  DE_COMPARISON_CLASS_TITLES,
  DE_METHOD_TITLES,
  getDeComparisonClassShortTitle,
  getDeComparisonClassTitle,
  getDeMethodTitle,
} from "../analysis-set-de";

describe("analysis-set-de helpers", () => {
  it("maps known de_comparison_class values to schema titles", () => {
    expect(getDeComparisonClassTitle("disease_status")).toBe(
      "Comparison or association by diagnosis group (ND, prediabetes, T1D, T2D)"
    );
    expect(getDeComparisonClassShortTitle("disease_status")).toBe(
      "Disease status"
    );
  });

  it("maps known de_method values to titles", () => {
    expect(getDeMethodTitle("pseudobulk_group_comparison")).toBe(
      "Pseudobulk group comparison"
    );
    expect(getDeMethodTitle("one_vs_rest")).toBe("One vs rest");
  });

  it("returns the raw value for unknown enums", () => {
    expect(getDeComparisonClassTitle("unknown")).toBe("unknown");
    expect(getDeComparisonClassShortTitle("unknown")).toBe("unknown");
    expect(getDeMethodTitle("unknown")).toBe("unknown");
  });

  it("covers all expected enum keys", () => {
    expect(Object.keys(DE_COMPARISON_CLASS_TITLES).sort()).toEqual(
      [
        "autoantibody",
        "cell_type_markers",
        "clinical_trait",
        "disease_status",
        "islet_function_trait",
        "treatment",
      ].sort()
    );
    expect(Object.keys(DE_COMPARISON_CLASS_SHORT_TITLES).sort()).toEqual(
      Object.keys(DE_COMPARISON_CLASS_TITLES).sort()
    );
    expect(Object.keys(DE_METHOD_TITLES).sort()).toEqual(
      [
        "association",
        "one_vs_rest",
        "pseudobulk_group_comparison",
        "unspecified",
      ].sort()
    );
  });
});
