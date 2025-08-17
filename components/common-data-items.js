/**
 * Use components in this module to display data common to multiple objects. Many object schemas
 * derive from others, so you would typically use these components to display properties within a
 * parent schema so that the components displaying objects for the child schemas can all display
 * the same parent properties.
 *
 * Each common data item renderer component in this module should include a `commonProperties`
 * property that lists the properties it displays. That lets the `UnknownTypePanel` component know
 * which remaining properties to display as generic properties. Be careful to maintain this list so
 * we don't have duplicate or missing properties for objects that don't have a custom page renderer.
 */

// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
import { Fragment } from "react";
// components
import {
  DataPanel,
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemList,
  DataItemValue,
  DataItemValueUrl,
} from "./data-area";
import DbxrefList from "./dbxref-list";
import { FileDownload } from "./file-download";
import SeparatedList from "./separated-list";
// lib
import { formatDate } from "../lib/dates";
import { dataSize, truthyOrZero } from "../lib/general";
//Donor
/**
 * Display the data items common to all donor-derived objects.
 */
export function DonorDataItems({
  item,
  diabetesStatus = [],
  otherTissue = [],
  children,
}) {
  return (
    <>
      {/* Donor Identification */}
      <DataAreaTitle>Donor Identification</DataAreaTitle>
      <DataPanel>
        <DataArea>
          {item.rrid && (
            <>
              <DataItemLabel>RRID</DataItemLabel>
              <DataItemValue>{item.rrid}</DataItemValue>
            </>
          )}
          {item.center_donor_id && (
            <>
              <DataItemLabel>Program Donor ID</DataItemLabel>
              <DataItemValue>{item.center_donor_id}</DataItemValue>
            </>
          )}
        </DataArea>
      </DataPanel>
      {/* Basic Information */}
      <DataAreaTitle>Demographics</DataAreaTitle>
      <DataPanel>
        <DataArea>
          {item.biological_sex && (
            <>
              <DataItemLabel>Genetic Sex</DataItemLabel>
              <DataItemValue>{item.biological_sex}</DataItemValue>
            </>
          )}
          {item.gender && (
            <>
              <DataItemLabel>Reported sex at birth</DataItemLabel>
              <DataItemValue>{item.gender}</DataItemValue>
            </>
          )}
          {item.age > 0 && (
            <>
              <DataItemLabel>Age (years)</DataItemLabel>
              <DataItemValue>{item.age}</DataItemValue>
            </>
          )}
          {item.bmi > 0 && (
            <>
              <DataItemLabel>BMI</DataItemLabel>
              <DataItemValue>{item.bmi}</DataItemValue>
            </>
          )}
          {/* Genetic and Ethnic Information */}
          {item.genetic_predicted_ethnicities?.length > 0 && (
            <>
              <DataItemLabel>Predicted Genetic Ancestry</DataItemLabel>
              <DataItemValue>
                {item.genetic_predicted_ethnicities.map(
                  (ethnicityObj, index) => (
                    <span key={index}>
                      {" "}
                      {ethnicityObj.ethnicity}{" "}
                      {ethnicityObj.percentage !== undefined
                        ? ` (${ethnicityObj.percentage}%)`
                        : ""}{" "}
                      {index < item.genetic_predicted_ethnicities.length - 1
                        ? ", "
                        : ""}{" "}
                    </span>
                  )
                )}
              </DataItemValue>
            </>
          )}
          {item.self_reported_ethnicities?.length > 0 && (
            <>
              <DataItemLabel>Reported Ethnicity</DataItemLabel>
              <DataItemValue>
                {item.self_reported_ethnicities.join(", ")}
              </DataItemValue>
            </>
          )}
        </DataArea>
      </DataPanel>
      {/* Health Status */}
      <DataAreaTitle>Medical and Clinical Information</DataAreaTitle>
      <DataPanel>
        <DataArea>
          {item.diabetes_duration !== undefined && (
            <>
              <DataItemLabel>Diabetes Duration (years)</DataItemLabel>
              <DataItemValue>{item.diabetes_duration}</DataItemValue>
            </>
          )}
          {item.family_history_of_diabetes !== undefined && (
            <>
              <DataItemLabel>Family History of Diabetes</DataItemLabel>
              <DataItemValue>{item.family_history_of_diabetes}</DataItemValue>
            </>
          )}
          {item.family_history_of_diabetes_relationship?.length > 0 && (
            <>
              <DataItemLabel>Relationship Type</DataItemLabel>
              <DataItemValue>
                {item.family_history_of_diabetes_relationship.join(",")}
              </DataItemValue>
            </>
          )}
          {item.living_donor !== undefined && (
            <>
              <DataItemLabel>Living Donor</DataItemLabel>
              <DataItemValue>
                {item.living_donor ? "true" : "false"}
              </DataItemValue>
            </>
          )}
          {Array.isArray(diabetesStatus) && diabetesStatus?.length > 0 ? (
            <>
              <DataItemLabel>Diabetes Ontology Classification</DataItemLabel>
              <DataItemValue>
                <SeparatedList>
                  {diabetesStatus.map((status) => (
                    <Link key={status["@id"]} href={status["@id"]}>
                      {status.term_id}
                    </Link>
                  ))}
                </SeparatedList>
              </DataItemValue>
            </>
          ) : (
            <>
              <DataItemLabel>Diabetes Status</DataItemLabel>
              <DataItemValue>No ontology term available</DataItemValue>
            </>
          )}
          {item.diabetes_status_description && (
            <>
              <DataItemLabel>Clinical Diagnosis of Diabetes</DataItemLabel>
              <DataItemValue>{item.diabetes_status_description}</DataItemValue>
            </>
          )}
          {item.t1d_stage && (
            <>
              <DataItemLabel>T1D Stage</DataItemLabel>
              <DataItemValue>{item.t1d_stage}</DataItemValue>
            </>
          )}
          {item.derived_diabetes_status && (
            <>
              <DataItemLabel>Derived diabetes status</DataItemLabel>
              <DataItemValue>{item.derived_diabetes_status}</DataItemValue>
            </>
          )}
          {item.diabetes_status_hba1c !== undefined && (
            <>
              <DataItemLabel>Diabetes Status, HbA1C Adjusted</DataItemLabel>
              <DataItemValue>{item.diabetes_status_hba1c}</DataItemValue>
            </>
          )}
          {item.hba1c !== undefined && (
            <>
              <DataItemLabel>HbA1C (percentage)</DataItemLabel>
              <DataItemValue>{item.hba1c}</DataItemValue>
            </>
          )}
          {item.c_peptide !== undefined && (
            <>
              <DataItemLabel>C Peptide (ng/ml)</DataItemLabel>
              <DataItemValue>{item.c_peptide}</DataItemValue>
            </>
          )}
          {item.cause_of_death !== undefined && (
            <>
              <DataItemLabel>Cause of Death</DataItemLabel>
              <DataItemValue>{item.cause_of_death}</DataItemValue>
            </>
          )}
          {item.glucose_loweing_theraphy?.length > 0 && (
            <>
              <DataItemLabel>Glucose Lowering Therapy</DataItemLabel>
              <DataItemValue>
                {item.glucose_loweing_theraphy.join(", ")}
              </DataItemValue>
            </>
          )}
          {item.other_theraphy?.length > 0 && (
            <>
              <DataItemLabel>Medication</DataItemLabel>
              <DataItemValue>{item.other_theraphy.join(", ")}</DataItemValue>
            </>
          )}
          {item.hospital_stay !== undefined && (
            <>
              <DataItemLabel>Hospital Stay (hours)</DataItemLabel>
              <DataItemValue>{item.hospital_stay}</DataItemValue>
            </>
          )}
          {item.donation_type !== undefined && (
            <>
              <DataItemLabel>Donation Type</DataItemLabel>
              <DataItemValue>{item.donation_type}</DataItemValue>
            </>
          )}
        </DataArea>
      </DataPanel>
      {/* Immunological Information */}
      {(item.aab_gada_value !== undefined ||
        item.aab_gada !== undefined ||
        item.aab_ia2_value !== undefined ||
        item.aab_ia2 !== undefined ||
        item.aab_iaa_value !== undefined ||
        item.aab_iaa !== undefined ||
        item.aab_znt8_value !== undefined ||
        item.aab_znt8 !== undefined) && (
        <>
          <DataAreaTitle>Auto Antibodies</DataAreaTitle>
          <DataPanel>
            <DataArea>
              {item.aab_gada_value !== undefined && (
                <>
                  <DataItemLabel>AAB GADA Value (unit/ml)</DataItemLabel>
                  <DataItemValue>{item.aab_gada_value}</DataItemValue>
                </>
              )}
              {item.aab_gada_assay?.length > 0 && (
                <>
                  <DataItemLabel>AAB GADA Assay</DataItemLabel>
                  <DataItemValue>
                    {item.aab_gada_assay.join(", ")}
                  </DataItemValue>
                </>
              )}
              {item.aab_gada !== undefined && (
                <>
                  <DataItemLabel>AAB GADA Positive</DataItemLabel>
                  <DataItemValue>
                    {item.aab_gada ? "true" : "false"}
                  </DataItemValue>
                </>
              )}
              {item.aab_ia2_value !== undefined && (
                <>
                  <DataItemLabel>AAB IA2 Value (unit/ml)</DataItemLabel>
                  <DataItemValue>{item.aab_ia2_value}</DataItemValue>
                </>
              )}
              {item.aab_ia2 !== undefined && (
                <>
                  <DataItemLabel>AAB IA2 Positive</DataItemLabel>
                  <DataItemValue>
                    {item.aab_ia2 ? "true" : "false"}
                  </DataItemValue>
                </>
              )}
              {item.aab_ia2_assay?.length > 0 && (
                <>
                  <DataItemLabel>AAB IA2 Assay</DataItemLabel>
                  <DataItemValue>{item.aab_ia2_assay.join(", ")}</DataItemValue>
                </>
              )}
              {item.aab_iaa_value !== undefined && (
                <>
                  <DataItemLabel>AAB IAA Value (unit/ml)</DataItemLabel>
                  <DataItemValue>{item.aab_iaa_value}</DataItemValue>
                </>
              )}
              {item.aab_iaa_assay?.length > 0 && (
                <>
                  <DataItemLabel>AAB IAA Assay</DataItemLabel>
                  <DataItemValue>{item.aab_iaa_assay.join(", ")}</DataItemValue>
                </>
              )}
              {item.aab_iaa !== undefined && (
                <>
                  <DataItemLabel>AAB IAA Positive</DataItemLabel>
                  <DataItemValue>
                    {item.aab_iaa ? "true" : "false"}
                  </DataItemValue>
                </>
              )}
              {item.aab_znt8_value !== undefined && (
                <>
                  <DataItemLabel>AAB ZNT8 Value (unit/ml)</DataItemLabel>
                  <DataItemValue>{item.aab_znt8_value}</DataItemValue>
                </>
              )}
              {item.aab_znt8_assay?.length > 0 && (
                <>
                  <DataItemLabel>AAB ZNT8 Assay</DataItemLabel>
                  <DataItemValue>
                    {item.aab_znt8_assay.join(", ")}
                  </DataItemValue>
                </>
              )}
              {item.aab_znt8 !== undefined && (
                <>
                  <DataItemLabel>AAB ZNT8 Positive</DataItemLabel>
                  <DataItemValue>
                    {item.aab_znt8 ? "true" : "false"}
                  </DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>
        </>
      )}
      {item.hla_typing !== undefined && (
        <>
          <DataAreaTitle>HLA Typing</DataAreaTitle>
          <DataPanel>
            <DataArea>
              <DataItemLabel>HLA Typing</DataItemLabel>
              <DataItemValue>{item.hla_typing}</DataItemValue>
            </DataArea>
          </DataPanel>
        </>
      )}
      <DataAreaTitle>Supplementary Information</DataAreaTitle>
      <DataPanel>
        <DataArea>
          {/* Additional Biological Information */}
          {item.data_available?.length > 0 && (
            <>
              <DataItemLabel>Data Available</DataItemLabel>
              <DataItemValue>
                {item.data_available.map((dataObj, index) => (
                  <div key={index}>
                    <strong>{dataObj.dataset}</strong> ({dataObj.dataset_tissue}
                    )
                    {dataObj.dataset_link && (
                      <>
                        {" - "}
                        <a
                          href={dataObj.dataset_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Access Dataset
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </DataItemValue>
            </>
          )}
      {item.publication_data?.length > 0 && (
        <>
          <DataItemLabel>Publication Data</DataItemLabel>
          <DataItemValue>
            <DbxrefList dbxrefs={item.publication_data} isCollapsible />
          </DataItemValue>
        </>
      )}
          {item.pancreas_tissue_available !== undefined && (
            <>
              <DataItemLabel>Pancreas Tissue Available</DataItemLabel>
              <DataItemValue>
                {item.pancreas_tissue_available ? "true" : "false"}
              </DataItemValue>
            </>
          )}
          {Array.isArray(otherTissue) && otherTissue?.length > 0 ? (
            <>
              <DataItemLabel>Other Tissues Available</DataItemLabel>
              <DataItemValue>
                <SeparatedList>
                  {otherTissue.map((tissue) => (
                    <Link key={tissue["@id"]} href={tissue["@id"]}>
                      {tissue.term_id}
                    </Link>
                  ))}
                </SeparatedList>
              </DataItemValue>
            </>
          ) : (
            <>
              <DataItemLabel>Other Tissues Available</DataItemLabel>
              <DataItemValue>No ontology term</DataItemValue>
            </>
          )}
          {/* Supplementary Information */}
          {item.phenotypic_features?.length > 0 && (
            <>
              <DataItemLabel>Phenotypic Features</DataItemLabel>
              <DataItemValue>
                {item.phenotypic_features.join(", ")}
              </DataItemValue>
            </>
          )}
          {item.description !== undefined && (
            <>
              <DataItemLabel>Description</DataItemLabel>
              <DataItemValue>{item.description}</DataItemValue>
            </>
          )}
          {item.collections?.length > 0 && (
            <>
              <DataItemLabel>Collections</DataItemLabel>
              <DataItemValue>{item.collections.join(", ")}</DataItemValue>
            </>
          )}
          {item.dbxrefs?.length > 0 && (
            <>
              <DataItemLabel>External Resources</DataItemLabel>
              <DataItemValue>
                <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
              </DataItemValue>
            </>
          )}

          {/* Metadata and External Links */}
          {item.identifiers?.length > 0 && (
            <>
              <DataItemLabel>Identifiers</DataItemLabel>
              <DataItemValue>{item.identifiers.join(", ")}</DataItemValue>
            </>
          )}
          {item.url !== undefined && (
            <>
              <DataItemLabel>URL</DataItemLabel>
              <DataItemValueUrl>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </DataItemValueUrl>
            </>
          )}
        </DataArea>
      </DataPanel>
      {children}
    </>
  );
}

DonorDataItems.propTypes = {
  item: PropTypes.object.isRequired,
  diabetesStatus: PropTypes.arrayOf(PropTypes.object),
  otherTissue: PropTypes.arrayOf(PropTypes.object),
};
DonorDataItems.defaultProps = {
  diabetesStatus: [], // Default to empty array if not provided
  otherTissue: [], // Default to empty array if not provided
};
DonorDataItems.commonProperties = [
  "rrid",
  "center_donor_id",
  "biological_sex",
  "family_history_of_diabetes",
  "family_history_of_diabetes_relationship",
  "age",
  "gender",
  "bmi",
  "living_donor",
  "diabetes_status_description",
  "diabetes_duration",
  "diabetes_status_hba1c",
  "hba1c",
  "c_peptide",
  "other_theraphy",
  "glucose_loweing_theraphy",
  "genetic_predicted_ethnicities",
  "self_reported_ethnicities",
  "cause_of_death",
  "hospital_stay",
  "donation_type",
  "pancreas_tissue_available",
  "aab_gada_value",
  "aab_gada",
  "aab_gada_assay",
  "aab_ia2_value",
  "aab_ia2",
  "aab_ia2_assay",
  "aab_iaa_value",
  "aab_iaa",
  "aab_iaa_assay",
  "aab_znt8_value",
  "aab_znt8",
  "aab_znt8_assay",
  "hla_typing",
  "phenotypic_features",
  "description",
  "collections",
  "dbxrefs",
  "identifiers",
  "url",
];

/**
 * Display data items common to all sample-derived objects.
 */
export function SampleDataItems({ item, constructLibrarySets = [], children }) {
  return (
    <>
      <DataItemLabel>Summary</DataItemLabel>
      <DataItemValue>{item.summary}</DataItemValue>
      {children}
      {constructLibrarySets.length > 0 && (
        <>
          <DataItemLabel>Construct Library Sets</DataItemLabel>
          <DataItemList isCollapsible>
            {constructLibrarySets.map((fileSet) => (
              <Fragment key={fileSet["@id"]}>
                <Link href={fileSet["@id"]}>{fileSet.accession}</Link>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  {fileSet.summary}
                </span>
              </Fragment>
            ))}
          </DataItemList>
        </>
      )}
      {item.virtual && (
        <>
          <DataItemLabel>Virtual</DataItemLabel>
          <DataItemValue>True</DataItemValue>
        </>
      )}
      {item.taxa && (
        <>
          <DataItemLabel>Taxa</DataItemLabel>
          <DataItemValue>{item.taxa}</DataItemValue>
        </>
      )}
      {item.description && (
        <>
          <DataItemLabel>Description</DataItemLabel>
          <DataItemValue>{item.description}</DataItemValue>
        </>
      )}
      {truthyOrZero(item.starting_amount) && (
        <>
          <DataItemLabel>Starting Amount</DataItemLabel>
          <DataItemValue>
            {item.starting_amount}
            {item.starting_amount_units ? (
              <> {item.starting_amount_units}</>
            ) : (
              ""
            )}
          </DataItemValue>
        </>
      )}
      {item.sorted_from && (
        <>
          <DataItemLabel>Sorted From Sample</DataItemLabel>
          <DataItemValue>
            <Link href={item.sorted_from["@id"]}>
              {item.sorted_from.accession}
            </Link>
            {item.sorted_from_detail && <> {item.sorted_from_detail}</>}
          </DataItemValue>
        </>
      )}
      {item.date_obtained && (
        <>
          <DataItemLabel>Date Harvested</DataItemLabel>
          <DataItemValue>{formatDate(item.date_obtained)}</DataItemValue>
        </>
      )}
      {item.url && (
        <>
          <DataItemLabel>Additional Information</DataItemLabel>
          <DataItemValueUrl>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
          </DataItemValueUrl>
        </>
      )}
      {item.dbxrefs?.length > 0 && (
        <>
          <DataItemLabel>External Resources</DataItemLabel>
          <DataItemValue>
            <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
          </DataItemValue>
        </>
      )}
      {item.submitter_comment && (
        <>
          <DataItemLabel>Submitter Comment</DataItemLabel>
          <DataItemValue>{item.submitter_comment}</DataItemValue>
        </>
      )}
      {item.revoke_detail && (
        <>
          <DataItemLabel>Revoke Detail</DataItemLabel>
          <DataItemValue>{item.revoke_detail}</DataItemValue>
        </>
      )}
      {item.publication_identifiers && (
        <>
          <DataItemLabel>Publication Identifiers</DataItemLabel>
          <DataItemValue>
            <DbxrefList dbxrefs={item.publication_identifiers} isCollapsible />
          </DataItemValue>
        </>
      )}
      {item.protocols?.length > 0 && (
        <>
          <DataItemLabel>Protocols</DataItemLabel>
          <DataItemValue>
            <SeparatedList>
              {item.protocols.map((protocol) => (
                <a
                  href={protocol}
                  key={protocol}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {protocol}
                </a>
              ))}
            </SeparatedList>
          </DataItemValue>
        </>
      )}
    </>
  );
}

SampleDataItems.propTypes = {
  // Object derived from the sample.json schema
  item: PropTypes.object.isRequired,
  // Source lab or source for this sample
  // Construct library sets for this sample
  constructLibrarySets: PropTypes.arrayOf(PropTypes.object),
};

SampleDataItems.commonProperties = [
  "date_obtained",
  "dbxrefs",
  "description",
  "lot_id",
  "publication_identifiers",
  "revoke_detail",
  "sorted_from",
  "sorted_from_detail",
  "starting_amount",
  "starting_amount_units",
  "submitter_comment",
  "summary",
  "taxa",
  "url",
  "virtual",
];

/**
 * Display data items common to all biosample-derived objects.
 */
export function BiosampleDataItems({
  item,
  classifications = null,
  constructLibrarySets = [],
  diseaseTerms = null,
  partOf = null,
  sampleTerms = null,
  sources = null,
  children,
}) {
  return (
    <SampleDataItems item={item} constructLibrarySets={constructLibrarySets}>
      {sampleTerms?.length > 0 && (
        <>
          <DataItemLabel>Sample Terms</DataItemLabel>
          <DataItemValue>
            <SeparatedList>
              {sampleTerms.map((sampleTerm) => (
                <Link href={sampleTerm["@id"]} key={sampleTerm["@id"]}>
                  {sampleTerm.term_name}
                </Link>
              ))}
            </SeparatedList>
          </DataItemValue>
        </>
      )}
      {classifications?.length > 0 && (
        <>
          <DataItemLabel>Classification</DataItemLabel>
          <DataItemValue>{classifications.join(", ")}</DataItemValue>
        </>
      )}
      {item.embryonic && (
        <>
          <DataItemLabel>Embryonic</DataItemLabel>
          <DataItemValue>True</DataItemValue>
        </>
      )}
      {item.cellular_sub_pool && (
        <>
          <DataItemLabel>Cellular Sub Pool</DataItemLabel>
          <DataItemValue>{item.cellular_sub_pool}</DataItemValue>
        </>
      )}
      {partOf && (
        <>
          <DataItemLabel>Part of Sample</DataItemLabel>
          <DataItemValue>
            <Link href={partOf["@id"]}>{partOf.accession}</Link>
          </DataItemValue>
        </>
      )}
      {diseaseTerms?.length > 0 && (
        <>
          <DataItemLabel>Disease Terms</DataItemLabel>
          <DataItemValue>
            <SeparatedList isCollapsible>
              {diseaseTerms.map((diseaseTerm) => (
                <Link href={diseaseTerm["@id"]} key={diseaseTerm["@id"]}>
                  {diseaseTerm.term_name}
                </Link>
              ))}
            </SeparatedList>
          </DataItemValue>
        </>
      )}
      {item.nih_institutional_certification && (
        <>
          <DataItemLabel>NIH Institutional Certification</DataItemLabel>
          <DataItemValue>{item.nih_institutional_certification}</DataItemValue>
        </>
      )}
      {sources?.length > 0 && (
        <>
          <DataItemLabel>Sources</DataItemLabel>
          <DataItemValue>
            <SeparatedList>
              {sources.map((source) => (
                <Link href={source["@id"]} key={source["@id"]}>
                  {source.title}
                </Link>
              ))}
            </SeparatedList>
          </DataItemValue>
        </>
      )}
      {children}
    </SampleDataItems>
  );
}

BiosampleDataItems.propTypes = {
  // Object derived from the biosample.json schema
  item: PropTypes.object.isRequired,
  // Classifications if this biosample has at least one
  classifications: PropTypes.string,
  // Construct library sets for this biosample
  constructLibrarySets: PropTypes.arrayOf(PropTypes.object),
  // Disease ontology for the biosample
  diseaseTerms: PropTypes.arrayOf(PropTypes.object),
  // Part of Sample
  partOf: PropTypes.object,
  // Sample ontology for the biosample
  sampleTerms: PropTypes.arrayOf(PropTypes.object),
  // Sources for this biosample
  sources: PropTypes.arrayOf(PropTypes.object),
};

BiosampleDataItems.commonProperties = [
  "cellular_sub_pool",
  "embryonic",
  "nih_institutional_certification",
  "gender",
];

/**
 * Display data items common to all ontology-term-derived objects.
 */
export function OntologyTermDataItems({ item, isA, children }) {
  return (
    <>
      <DataItemLabel>Term Name</DataItemLabel>
      <DataItemValue>{item.term_name}</DataItemValue>
      <DataItemLabel>External Reference</DataItemLabel>
      <DataItemValue>
        <DbxrefList dbxrefs={[item.term_id]} />
      </DataItemValue>
      {isA?.length > 0 && (
        <>
          <DataItemLabel>Is A</DataItemLabel>
          <DataItemValue>
            <SeparatedList isCollapsible>
              {isA.map((term) => (
                <Link href={term["@id"]} key={term.term_id}>
                  {term.term_name}
                </Link>
              ))}
            </SeparatedList>
          </DataItemValue>
        </>
      )}
      {item.synonyms.length > 0 && (
        <>
          <DataItemLabel>Synonyms</DataItemLabel>
          <DataItemValue>{item.synonyms.join(", ")}</DataItemValue>
        </>
      )}
      {children}
      {item.submitter_comment && (
        <>
          <DataItemLabel>Submitter Comment</DataItemLabel>
          <DataItemValue>{item.submitter_comment}</DataItemValue>
        </>
      )}
    </>
  );
}

OntologyTermDataItems.propTypes = {
  // Ontology term object
  item: PropTypes.object.isRequired,
  // List of term names
  isA: PropTypes.arrayOf(PropTypes.object),
};

OntologyTermDataItems.commonProperties = [
  "submitter_comment",
  "synonyms",
  "term_id",
  "term_name",
];

/**
 * Display data items common to all file-derived objects.
 */
export function FileDataItems({ item, fileSet = null, children }) {
  return (
    <>
      {fileSet && (
        <>
          <DataItemLabel>File Set</DataItemLabel>
          <DataItemValue>
            <div className="flex gap-1">
              <Link
                href={fileSet["@id"]}
                aria-label={`FileSet ${fileSet.accession}`}
                key={fileSet.uuid}
              >
                {fileSet.accession}
              </Link>
              ({fileSet.summary})
            </div>
          </DataItemValue>
        </>
      )}
      <DataItemLabel>File Format</DataItemLabel>
      <DataItemValue>{item.file_format}</DataItemValue>
      <DataItemLabel>Content Type</DataItemLabel>
      <DataItemValue>{item.content_type}</DataItemValue>
      {item.content_summary && (
        <>
          <DataItemLabel>Content Summary</DataItemLabel>
          <DataItemValue>{item.content_summary}</DataItemValue>
        </>
      )}
      {item.dbxrefs?.length > 0 && (
        <>
          <DataItemLabel>External Resources</DataItemLabel>
          <DataItemValue>
            <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
          </DataItemValue>
        </>
      )}
      <DataItemLabel>md5sum</DataItemLabel>
      <DataItemValue className="break-all">{item.md5sum}</DataItemValue>
      {item.content_md5sum && (
        <>
          <DataItemLabel>Content MD5sum</DataItemLabel>
          <DataItemValue>{item.content_md5sum}</DataItemValue>
        </>
      )}
      {truthyOrZero(item.file_size) && (
        <>
          <DataItemLabel>File Size</DataItemLabel>
          <DataItemValue>{dataSize(item.file_size)}</DataItemValue>
        </>
      )}
      {item.anvil_url && (
        <>
          <DataItemLabel>AnVIL Url</DataItemLabel>
          <DataItemValue>
            <a href={item.anvil_url} target="_blank" rel="noopener noreferrer">
              {item.anvil_url}
            </a>
          </DataItemValue>
        </>
      )}
      {item.file_url && (
        <>
          <DataItemLabel>File Download</DataItemLabel>
          <DataItemValue>
            <div className="flex items-center gap-2">
              <FileDownload file={item} />
              <span className="text-sm text-gray-600">{item.file_url}</span>
            </div>
          </DataItemValue>
        </>
      )}
      {item.controlled_access && (
        <>
          <DataItemLabel>Controlled Access</DataItemLabel>
          <DataItemValue>{item.controlled_access ? "Yes" : "No"}</DataItemValue>
        </>
      )}
      {item.submitted_file_name && (
        <>
          <DataItemLabel>Submitted File Name</DataItemLabel>
          <DataItemValue className="break-all">
            {item.submitted_file_name}
          </DataItemValue>
        </>
      )}
      {item.validation_error_detail && (
        <>
          <DataItemLabel>Validation Error Detail</DataItemLabel>
          <DataItemValue>{item.validation_error_detail}</DataItemValue>
        </>
      )}
      {children}
    </>
  );
}

FileDataItems.propTypes = {
  // file object common for all file types
  item: PropTypes.object.isRequired,
  // file set for this file
  fileSet: PropTypes.object,
};

FileDataItems.commonProperties = [
  "content_md5sum",
  "content_type",
  "content_summary",
  "dbxrefs",
  "file_format",
  "file_size",
  "md5sum",
  "submitted_file_name",
  "validation_error_detail",
];

/**
 * Display data items common to all FileSet objects.
 */
export function FileSetDataItems({ item, children }) {
  return (
    <>
      {item.file_set_type && (
        <>
          <DataItemLabel>File Set Type</DataItemLabel>
          <DataItemValue>{item.file_set_type}</DataItemValue>
        </>
      )}
      {item.summary && (
        <>
          <DataItemLabel>Summary</DataItemLabel>
          <DataItemValue>{item.summary}</DataItemValue>
        </>
      )}
      {item.description && (
        <>
          <DataItemLabel>Description</DataItemLabel>
          <DataItemValue>{item.description}</DataItemValue>
        </>
      )}
      {children}
      {item.url && (
        <>
          <DataItemLabel>URL</DataItemLabel>
          <DataItemValueUrl>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
          </DataItemValueUrl>
        </>
      )}
      {item.submitter_comment && (
        <>
          <DataItemLabel>Submitter Comment</DataItemLabel>
          <DataItemValue>{item.submitter_comment}</DataItemValue>
        </>
      )}
      {item.revoke_detail && (
        <>
          <DataItemLabel>Revoke Detail</DataItemLabel>
          <DataItemValue>{item.revoke_detail}</DataItemValue>
        </>
      )}
      {item.dbxrefs?.length > 0 && (
        <>
          <DataItemLabel>External Resources</DataItemLabel>
          <DataItemValue>
            <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
          </DataItemValue>
        </>
      )}
      {item.publication_identifiers?.length > 0 && (
        <>
          <DataItemLabel>Publication Identifiers</DataItemLabel>
          <DataItemValue>
            <DbxrefList dbxrefs={item.publication_identifiers} isCollapsible />
          </DataItemValue>
        </>
      )}
    </>
  );
}

FileSetDataItems.propTypes = {
  // file object common for all file types
  item: PropTypes.object.isRequired,
};

FileSetDataItems.commonProperties = [
  "file_set_type",
  "summary",
  "description",
  "url",
  "submitter_comment",
  "revoke_detail",
  "dbxrefs",
  "publication_identifiers",
];

/**
 * `UnknownTypePanel` uses the following data and functions to use common data item renderers based
 * on the parent type of unknown objects.
 */

/**
 * When adding a new common data item renderer component, add the @type that it handles as a key to
 * this object, and the corresponding component as the value. Keep the object keys in alphabetical
 * order to make them easier to find by visually scanning. This lets `UnknownTypePanel` find the
 * appropriate common data item renderer component for the parent type of an unknown object type.
 */
const commonDataRenderers = {
  Biosample: BiosampleDataItems,
  Donor: DonorDataItems,
  File: FileDataItems,
  OntologyTerm: OntologyTermDataItems,
  FileSet: FileSetDataItems,
};

/**
 * Data item renderer to use when no common data item renderer exists for the given unknown item's
 * parent type. It just lets `UnknownTypePanel` render all the unknown item's properties without
 * any common properties.
 */
function EmptyDataItems({ children }) {
  return <>{children}</>;
}

/**
 * Find a common data item renderer component, if any, appropriate for the given unknown item
 * object. Normally an appropriate renderer handles the unknown object's parent type. Return that
 * React component, or the `EmptyDataItems` renderer if none found.
 * @param {object} item Generic object
 * @returns {React.Component} Common data item renderer component
 */
export function findCommonDataRenderer(item) {
  const definedCommonDataTypes = Object.keys(commonDataRenderers);
  const commonDataType = item["@type"].find((type) =>
    definedCommonDataTypes.includes(type)
  );
  return commonDataType ? commonDataRenderers[commonDataType] : EmptyDataItems;
}
