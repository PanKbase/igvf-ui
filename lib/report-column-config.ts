import QueryString from "./query-string";
import type { ColumnSpec } from "./report";

/**
 * Schema properties hidden from Report View column selection and "Show All".
 * These are administrative, provenance, or rarely useful in tabular exports.
 */
export const REPORT_HIDDEN_COLUMN_IDS: readonly string[] = [
  "schema_version",
  "creation_timestamp",
  "release_timestamp",
  "revoke_detail",
  "submitter_comment",
  "submitted_by",
  "virtual",
  "taxa",
  "human_donor_identifiers",
  "aliases",
  "alternate_accessions",
  "url",
  "documents",
  "notes",
  "collections",
  "award",
  "lab",
  "uuid",
  "publication_identifiers",
  "publication_data",
  "description",
  "summary",
  "@type",
  "dbxrefs",
  // Biosample provenance, linkage, and lab-processing metadata
  "ccf_id",
  "institutional_certificates",
  "file_sets",
  "authentication",
  "product_id",
  "lot_id",
  "sources",
  "demultiplexed_from",
  "demultiplexed_to",
  "multiplexed_in",
  "pooled_in",
  "pooled_from",
  "sorted_from",
  "sorted_from_detail",
  "sorted_fractions",
  "origin_sample_of",
  "parts",
  "cell_fate_change_protocol",
  "cell_fate_change_treatments",
  "coating_condition",
  "multiplicity_of_infection",
  "nucleic_acid_delivery",
  "time_post_library_delivery",
  "time_post_library_delivery_units",
  "vendor_passage",
  "year_obtained",
  "starting_amount",
  "starting_amount_units",
  "construct_library_sets",
  "excision_status",
  // File set provenance and calculated linkage metadata
  "submitted_files_timestamp",
  "files",
  "control_for",
  "input_file_set_for",
];

/** Default visible columns for Human Donor report / TSV export. */
export const HUMAN_DONOR_CLINICAL_COLUMN_IDS: readonly string[] = [
  "@id",
  "accession",
  "center_donor_id",
  "status",
  "diabetes_status_description",
  "hba1c",
  "derived_diabetes_status",
  "age",
  "bmi",
  "height",
  "weight",
  "gender",
  "genetic_sex",
  "c_peptide",
  "diabetes_duration",
  "t1d_stage",
  "diabetes_status",
  "aab_gada_value",
  "aab_iaa_value",
  "aab_ia2_value",
  "aab_znt8_value",
  "family_history_of_diabetes",
  "family_history_of_diabetes_relationship",
  "living_donor",
  "cause_of_death",
  "donation_type",
  "hospital_stay",
  "pancreas_tissue_available",
  "other_tissues_available",
  "other_disease_states",
  "other_therapy",
  "data_available",
  "genetic_ethnicities",
  "ethnicities",
  "genetic_risk_score",
  "hla_typing",
  "hla_status",
  "rrid",
  "related_donors",
  "phenotypic_features",
];

/** Default visible columns for Biosample report / TSV export. */
export const BIOSAMPLE_CLINICAL_COLUMN_IDS: readonly string[] = [
  "@id",
  "accession",
  "status",
  "classifications",
  "biosample_type",
  "sample_terms",
  "disease_terms",
  "donors",
  "lower_bound_age",
  "upper_bound_age",
  "age_units",
  "embryonic",
  "biomarkers",
  "treatments",
  "modifications",
  "cellular_sub_pool",
  "part_of",
  "originated_from",
  "rrid",
  "date_obtained",
  "date_harvested",
  "organ_source",
  "isolation_center",
  "resource",
  "preservation_method",
  "pmi",
  "cold_ischaemia_time",
  "warm_ischaemia_duration",
  "prep_viability",
  "purity",
  "purity_assay",
  "hand_picked",
  "digest_time",
  "percentage_trapped",
  "islet_yield",
  "ieq_pancreas_weight",
  "islet_function_available",
  "facs_purification",
  "islet_morphology",
  "islet_histology",
  "pre_shipment_culture_time",
  "pre_shipment_culture_media",
  "pre_shipment_culture_temperature",
  "shipping_temperature",
  "shipping_media",
  "transit_time",
  "post_shipment_islet_viability",
  "post_shipment_islet_viability_qualitative",
  "post_shipment_islet_viability_quantitative",
  "post_shipment_islet_purity",
  "post_shipment_culture_time",
  "post_shipment_culture_media",
  "post_shipment_culture_temperature",
  "time_post_change",
  "time_post_change_units",
  "targeted_sample_term",
  "passage_number",
  "growth_medium",
  "gender",
  "sample_name",
];

const BIOSAMPLE_REPORT_TYPES = [
  "Biosample",
  "PrimaryIslet",
  "PrimaryCell",
  "Tissue",
  "InVitroSystem",
  "WholeOrganism",
  "HumanBetaCellLine",
  "MultiplexedSample",
  "TechnicalSample",
] as const;

/** Default visible columns for Analysis Set report / TSV export. */
export const ANALYSIS_SET_CLINICAL_COLUMN_IDS: readonly string[] = [
  "@id",
  "accession",
  "status",
  "file_set_type",
  "assay_titles",
  "samples",
  "donors",
  "input_file_sets",
  "total_islet_cell_volume",
  "total_insulin_content",
  "total_glucagon_content",
  "total_dna_content",
  "normalized_insulin_secretion_units",
  "normalized_glucagon_secretion_units",
  "normalized_insulin_content",
  "normalized_glucagon_content",
];

/** Default visible columns for File Set report / TSV export. */
export const FILE_SET_CLINICAL_COLUMN_IDS: readonly string[] = [
  "@id",
  "accession",
  "status",
  "file_set_type",
  "samples",
  "donors",
  "assay_titles",
  "assay_term",
  "preferred_assay_title",
  "library_construction_platform",
  "sequencing_library_types",
  "sequencing_chemistry",
  "multiome_size",
  "related_multiome_datasets",
  "control_file_sets",
  "donor_validation_method",
  "auxiliary_sets",
  "protocols",
  "targeted_genes",
  "external_image_url",
  "input_file_sets",
  "islets_shipped",
  "islet_purification_method",
  "total_islets_for_assay",
  "islet_diameter",
  "islet_purity_for_assay",
  "islet_volume_ieq",
  "islet_endocrine_composition",
  "perifusion_protocol",
  "base_media",
  "stimuli_secretagogues",
  "perifusion_flow_rate",
  "perifusion_fraction_volume",
  "fraction_collection_time",
  "hormone_assays",
  "data_url",
  "total_islet_cell_volume",
  "total_insulin_content",
  "total_glucagon_content",
  "total_dna_content",
  "normalized_insulin_secretion_units",
  "normalized_glucagon_secretion_units",
  "normalized_insulin_content",
  "normalized_glucagon_content",
];

const FILE_SET_REPORT_TYPES = [
  "FileSet",
  "MeasurementSet",
  "AuxiliarySet",
  "CuratedSet",
  "PredictionSet",
  "ModelSet",
  "ConstructLibrarySet",
] as const;

/** Default visible columns for Workflow report / TSV export. */
export const WORKFLOW_CLINICAL_COLUMN_IDS: readonly string[] = [
  "@id",
  "accession",
  "status",
  "name",
  "source_url",
  "workflow_version",
  "workflow_repositories",
  "standards_page",
  "analysis_steps",
];

export const REPORT_COLUMN_PRESETS: Readonly<
  Record<string, readonly string[]>
> = {
  HumanDonor: HUMAN_DONOR_CLINICAL_COLUMN_IDS,
  ...Object.fromEntries(
    BIOSAMPLE_REPORT_TYPES.map((type) => [type, BIOSAMPLE_CLINICAL_COLUMN_IDS])
  ),
  AnalysisSet: ANALYSIS_SET_CLINICAL_COLUMN_IDS,
  Workflow: WORKFLOW_CLINICAL_COLUMN_IDS,
  ...Object.fromEntries(
    FILE_SET_REPORT_TYPES.map((type) => [type, FILE_SET_CLINICAL_COLUMN_IDS])
  ),
};

const hiddenColumnIdSet = new Set(REPORT_HIDDEN_COLUMN_IDS);

/**
 * Remove metadata / admin columns from report column specs.
 */
export function filterHiddenReportColumns(
  columnSpecs: ColumnSpec[]
): ColumnSpec[] {
  return columnSpecs.filter((columnSpec) => !hiddenColumnIdSet.has(columnSpec.id));
}

/**
 * Return the default column preset for a single-type report, if defined.
 */
export function getReportColumnPreset(
  reportTypes: string[]
): readonly string[] | null {
  if (reportTypes.length === 1) {
    return REPORT_COLUMN_PRESETS[reportTypes[0]] ?? null;
  }
  return null;
}

/**
 * True when the report should redirect to its clinical column preset (no `field=` yet).
 */
export function shouldApplyDefaultReportColumnPreset(
  queryString: string,
  reportTypes: string[]
): boolean {
  const query = new QueryString(queryString);
  return (
    query.getKeyValues("field").length === 0 &&
    getReportColumnPreset(reportTypes) !== null
  );
}

/**
 * Build a multireport query string that shows only the given columns.
 */
export function buildColumnPresetQuery(
  queryString: string,
  columnIds: readonly string[]
): string {
  const query = new QueryString(queryString);
  query.deleteKeyValue("field");
  columnIds.forEach((columnId) => {
    query.addKeyValue("field", columnId);
  });
  if (!query.getKeyValues("field").includes("@id")) {
    query.addKeyValue("field", "@id");
  }
  return query.format();
}
