/**
 * Display helpers for Analysis Set differential-expression fields.
 * Titles match backend schema enum_titles where defined.
 */

/** de_comparison_class enum → human-readable title (schema enum_titles). */
export const DE_COMPARISON_CLASS_TITLES: Readonly<Record<string, string>> = {
  islet_function_trait:
    "Association with a perifusion secretion or content measure",
  clinical_trait:
    "Association with a donor clinical variable (age, BMI, sex, HbA1c, C-peptide)",
  disease_status:
    "Comparison or association by diagnosis group (ND, prediabetes, T1D, T2D)",
  treatment: "Treated vs control samples",
  autoantibody:
    "Autoantibody-positive vs negative, or association with autoantibody presence",
  cell_type_markers: "One cell type vs all other cells",
};

/** Short labels for list/meta display (enum keys are long titles). */
export const DE_COMPARISON_CLASS_SHORT_TITLES: Readonly<
  Record<string, string>
> = {
  islet_function_trait: "Islet function trait",
  clinical_trait: "Clinical trait",
  disease_status: "Disease status",
  treatment: "Treatment",
  autoantibody: "Autoantibody",
  cell_type_markers: "Cell type markers",
};

/** de_method enum → human-readable title (no schema enum_titles). */
export const DE_METHOD_TITLES: Readonly<Record<string, string>> = {
  pseudobulk_group_comparison: "Pseudobulk group comparison",
  association: "Association",
  one_vs_rest: "One vs rest",
  unspecified: "Unspecified",
};

export function getDeComparisonClassTitle(value: string): string {
  return DE_COMPARISON_CLASS_TITLES[value] || value;
}

export function getDeComparisonClassShortTitle(value: string): string {
  return DE_COMPARISON_CLASS_SHORT_TITLES[value] || value;
}

export function getDeMethodTitle(value: string): string {
  return DE_METHOD_TITLES[value] || value;
}
