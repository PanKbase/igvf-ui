/**
 * Featured datasets shown on the Data Library landing page (the first
 * `LANDING_FEATURED_COUNT`) and on the Featured datasets page (all of them). This list is the
 * single source of truth for both pages. It lives in code, not in a CMS or an igvfd object.
 *
 * Each card has up to three buttons, always labeled "Download", "Details" and "Visualize" by the
 * card component. A card only renders the buttons it has a link for, so omit a property to omit
 * its button. Metadata download links carry a date (2026-05-19); update them when new tables get
 * released.
 */

export type FeaturedDataset = {
  /** Stable identifier; used as the React key */
  id: string;
  /** Category label shown above the title, e.g. "Islet function" */
  category: string;
  title: string;
  /** One-line description */
  description: string;
  /** Direct download URL; omit if the card has no single downloadable file */
  downloadUrl?: string;
  /** Link to the object page or a pre-filtered search */
  detailsUrl?: string;
  /** External visualization; opens in a new tab. `visualizeTool` names it in the tooltip */
  visualizeUrl?: string;
  /** Name of the tool the Visualize button opens, e.g. "Functional Browser" */
  visualizeTool?: string;
};

/**
 * Number of featured cards the landing page shows.
 */
export const LANDING_FEATURED_COUNT = 4;

const S3 = "https://pankbase-data-v1.s3.us-west-2.amazonaws.com";
// Data Library links are same-site paths so they work on prod, staging and localhost alike.
const DATA_LIBRARY = "";
const PANKBASE = "https://pankbase.org";

export const FEATURED_DATASETS: ReadonlyArray<FeaturedDataset> = [
  {
    id: "islet-dynamic-perifusion",
    category: "Islet function",
    title: "Islet dynamic perifusion",
    description:
      "Insulin and glucagon secretion traits from dynamic islet perifusion.",
    downloadUrl: `${S3}/download/HIPP_all_traits.pankbase.txt`,
    detailsUrl: `${DATA_LIBRARY}/analysis-sets/PKBDS9874MXRB/`,
    visualizeUrl: `${PANKBASE}/functional.html?donorFilters=%5B%5D`,
    visualizeTool: "Functional Browser",
  },
  {
    id: "islet-scrna-seq",
    category: "Gene expression",
    title: "Pancreatic islet scRNA-seq",
    description: "Integrated single-cell RNA-seq atlas of human islets.",
    downloadUrl: `${S3}/analysis_resources/single_cell_objects/02072026_scRNA_v3.4.rds`,
    detailsUrl: `${DATA_LIBRARY}/analysis-sets/PKBDS1349YHGQ/`,
    visualizeUrl: `${PANKBASE}/single-cell.html?datasetId=islet_of_Langerhans_scRNA_v3-4`,
    visualizeTool: "Integrated Cell Browser",
  },
  {
    id: "islet-snatac-seq",
    category: "Chromatin accessibility",
    title: "Pancreatic islet snATAC-seq",
    description: "Single-nucleus chromatin accessibility in human islets.",
    downloadUrl: `${S3}/analysis_resources/single_cell_objects/hpap_atac.h5ad`,
    detailsUrl: `${DATA_LIBRARY}/analysis-sets/PKBDS0470WCHR/`,
    visualizeUrl: `${PANKBASE}/single-cell.html?datasetId=islet_of_Langerhans_snATAC_v1`,
    visualizeTool: "Integrated Cell Browser",
  },
  {
    id: "cell-type-peaks-snatac-seq",
    category: "Chromatin accessibility",
    title: "Cell-type peaks from snATAC-seq",
    description: "Peak counts per islet cell type.",
    downloadUrl: `${S3}/download/pankbase-peak-counts-snATAC-seq-umap1.0.tar.gz`,
    detailsUrl: `${DATA_LIBRARY}/search/?type=AnalysisSet&query=Peak+counts&file_set_type=principal+analysis`,
    visualizeUrl: `${PANKBASE}/atacseq.html`,
    visualizeTool: "Genome Browser",
  },
  {
    id: "cre-target-gene-links",
    category: "Chromatin accessibility",
    title: "cRE\u2013target gene links",
    description:
      "Links between candidate regulatory elements and their target genes.",
    detailsUrl: `${DATA_LIBRARY}/search/?type=AnalysisSet&annotation_type=cre_target_links`,
    visualizeUrl: `${PANKBASE}/atacseq.html`,
    visualizeTool: "Genome Browser",
  },
  {
    id: "differential-gene-expression",
    category: "Differential expression",
    title: "Differential gene expression",
    description: "Disease-status comparisons across islet cell types.",
    detailsUrl: `${DATA_LIBRARY}/search/?type=AnalysisSet&file_set_type=principal+analysis&annotation_category=Differential+expression&de_comparison_class=disease_status`,
    visualizeUrl: `${PANKBASE}/diff-exp.html`,
    visualizeTool: "DGE Browser",
  },
  {
    id: "donor-metadata",
    category: "Resource",
    title: "Donor metadata",
    description: "Clinical and demographic metadata for all donors.",
    downloadUrl: `${S3}/analysis_resources/meta_data_table/human_donor.2026-05-19.txt`,
    detailsUrl: `${DATA_LIBRARY}/analysis-sets/PKBDS5236MJJT/`,
    visualizeUrl: `${PANKBASE}/donors.html`,
    visualizeTool: "Donor Summary",
  },
  {
    id: "islet-biosample-metadata",
    category: "Resource",
    title: "Islet biosample metadata",
    description: "Metadata for primary islet biosamples.",
    downloadUrl: `${S3}/analysis_resources/meta_data_table/biosamples_primary.2026-05-19.txt`,
    detailsUrl: `${DATA_LIBRARY}/analysis-sets/PKBDS1057RJYW/`,
  },
];

/**
 * Get the featured datasets the landing page shows.
 * @returns The first `LANDING_FEATURED_COUNT` featured datasets
 */
export function getLandingFeaturedDatasets(): ReadonlyArray<FeaturedDataset> {
  return FEATURED_DATASETS.slice(0, LANDING_FEATURED_COUNT);
}
