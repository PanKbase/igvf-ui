/**
 * Display titles for Analysis Set annotation_type enum values.
 * Keys match the backend schema enum; values are human-readable titles.
 */
export const ANNOTATION_TYPE_TITLES: Readonly<Record<string, string>> = {
  sample_bulk_rnaseq: "Per-sample processed bulk RNA-seq",
  sample_scrnaseq: "Per-sample processed islet scRNA-seq",
  gene_expression_matrix: "Pseudobulk counts per cell type, or bulk TPM matrix",
  reference_atlas: "Cell type reference map (scRNA-seq or snATAC-seq)",
  differential_expression: "Differential expression results by cell type",
  sample_snatacseq: "Per-sample processed snATAC-seq",
  chromatin_accessibility_peaks:
    "Peak calls and read counts per cell type, or unified peaks",
  chromatin_signal_track: "Accessibility signal track per cell type",
  cre_target_links: "cRE-to-gene links predicted by ABC, per cell type",
  islet_function_perifusion: "Per-donor dynamic perifusion analysis",
  metadata_table: "Donor or islet biosample metadata table",
  qtl_colocalization: "GWAS and eQTL colocalization results",
  qtl_summary_statistics: "QTL variant summary statistics",
  credible_set_ld: "LD among SNPs within a credible set",
  unclear: "Not classifiable from description and assay title",
};

/**
 * Return the display title for an annotation_type value, or the raw value if unknown.
 */
export function getAnnotationTypeTitle(annotationType: string): string {
  return ANNOTATION_TYPE_TITLES[annotationType] || annotationType;
}
