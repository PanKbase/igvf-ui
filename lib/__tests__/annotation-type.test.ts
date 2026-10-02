import {
  ANNOTATION_TYPE_TITLES,
  getAnnotationTypeTitle,
} from "../annotation-type";

describe("annotation-type helpers", () => {
  it("maps known annotation_type values to titles", () => {
    expect(getAnnotationTypeTitle("sample_scrnaseq")).toBe(
      "Per-sample processed islet scRNA-seq"
    );
    expect(getAnnotationTypeTitle("unclear")).toBe(
      "Not classifiable from description and assay title"
    );
  });

  it("returns the raw value for unknown annotation_type values", () => {
    expect(getAnnotationTypeTitle("unknown_type")).toBe("unknown_type");
  });

  it("covers all expected enum keys", () => {
    expect(Object.keys(ANNOTATION_TYPE_TITLES).sort()).toEqual(
      [
        "chromatin_accessibility_peaks",
        "chromatin_signal_track",
        "cre_target_links",
        "credible_set_ld",
        "differential_expression",
        "gene_expression_matrix",
        "islet_function_perifusion",
        "metadata_table",
        "qtl_colocalization",
        "qtl_summary_statistics",
        "reference_atlas",
        "sample_bulk_rnaseq",
        "sample_scrnaseq",
        "sample_snatacseq",
        "unclear",
      ].sort()
    );
  });
});
