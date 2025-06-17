// node_modules
import PropTypes from "prop-types";
// components
import Link from "next/link";
import AlternateAccessions from "../../components/alternate-accessions";
import Attribution from "../../components/attribution";
import Breadcrumbs from "../../components/breadcrumbs";
import { BiosampleDataItems } from "../../components/common-data-items";
import {
  DataArea,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "../../components/data-area";
import DocumentTable from "../../components/document-table";
import DonorTable from "../../components/donor-table";
import { EditableItem } from "../../components/edit";
import FileSetTable from "../../components/file-set-table";
import JsonDisplay from "../../components/json-display";
import ModificationTable from "../../components/modification-table";
import ObjectPageHeader from "../../components/object-page-header";
import PagePreamble from "../../components/page-preamble";
import SampleTable from "../../components/sample-table";
import TreatmentTable from "../../components/treatment-table";
// lib
import buildAttribution from "../../lib/attribution";
import buildBreadcrumbs from "../../lib/breadcrumbs";
import {
  requestBiosamples,
  requestDocuments,
  requestDonors,
  requestFileSets,
  requestOntologyTerms,
  requestTreatments,
} from "../../lib/common-requests";
import { errorObjectToProps } from "../../lib/errors";
import FetchRequest from "../../lib/fetch-request";
import { truthyOrZero } from "../../lib/general";
import { isJsonFormat } from "../../lib/query-utils";

export default function PrimaryIslet({
  primaryIslet,
  constructLibrarySets,
  diseaseTerms,
  documents,
  donors,
  partOf,
  parts,
  pooledFrom,
  pooledIn,
  sortedFractions,
  treatments,
  multiplexedInSamples,
  attribution = null,
  isJson,
}) {
  return (
    <>
      <Breadcrumbs />
      <EditableItem item={primaryIslet}>
        <PagePreamble>
          <AlternateAccessions
            alternateAccessions={primaryIslet.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={primaryIslet} isJsonFormat={isJson} />
        <JsonDisplay item={primaryIslet} isJsonFormat={isJson}>
          <DataPanel>
            <DataArea>
              <BiosampleDataItems
                item={primaryIslet}
                constructLibrarySets={constructLibrarySets}
                diseaseTerms={diseaseTerms}
                partOf={partOf}
                sampleTerms={primaryIslet.sample_terms}
                options={{
                  dateObtainedTitle: "Date Harvested",
                }}
              >
                {truthyOrZero(primaryIslet.passage_number) && (
                  <>
                    <DataItemLabel>Passage Number</DataItemLabel>
                    <DataItemValue>{primaryIslet.passage_number}</DataItemValue>
                  </>
                )}
                {primaryIslet.isolation_center && (
                  <>
                    <DataItemLabel>Isolation Center</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.isolation_center}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.resources && (
                  <>
                    <DataItemLabel>Resources</DataItemLabel>
                    <DataItemValue>{primaryIslet.resources}</DataItemValue>
                  </>
                )}
                {primaryIslet.pmi && (
                  <>
                    <DataItemLabel>Post-mortem Interval</DataItemLabel>
                    <DataItemValue>{primaryIslet.pmi}</DataItemValue>
                  </>
                )}
                {primaryIslet.rrid && (
                  <>
                    <DataItemLabel>rrid</DataItemLabel>
                    <DataItemValue>{primaryIslet.rrid}</DataItemValue>
                  </>
                )}
                {primaryIslet.cold_ischaemia_time && (
                  <>
                    <DataItemLabel>Cold Ischaemia Time</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.cold_ischaemia_time}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.organ_source && (
                  <>
                    <DataItemLabel>Organ Source</DataItemLabel>
                    <DataItemValue>{primaryIslet.organ_source}</DataItemValue>
                  </>
                )}
                {primaryIslet.prep_viability && (
                  <>
                    <DataItemLabel>Prep Viability (percentage)</DataItemLabel>
                    <DataItemValue>{primaryIslet.prep_viability}</DataItemValue>
                  </>
                )}
                {primaryIslet.warm_ischaemia_duration && (
                  <>
                    <DataItemLabel>
                      Warm Ischaemia Duration/Down Time (hours)
                    </DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.warm_ischaemia_duration}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.purity?.length > 0 && (
                  <>
                    <DataItemLabel>Purity</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.purity.join(", ")}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.purity_assay?.length > 0 && (
                  <>
                    <DataItemLabel>Purity Assay</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.purity_assay.join(", ")}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.hand_picked && (
                  <>
                    <DataItemLabel>Hand Picked</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.hand_picked ? "Yes" : "No"}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.pre_shipment_culture_time && (
                  <>
                    <DataItemLabel>
                      Pre-Shipment Culture Time (hours)
                    </DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.pre_shipment_culture_time}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.islet_function_available && (
                  <>
                    <DataItemLabel>Islet Function Available</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.islet_function_available ? "Yes" : "No"}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.digest_time && (
                  <>
                    <DataItemLabel>Digest Time (hours)</DataItemLabel>
                    <DataItemValue>{primaryIslet.digest_time}</DataItemValue>
                  </>
                )}
                {primaryIslet.percentage_trapped && (
                  <>
                    <DataItemLabel>Percentage Trapped</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.percentage_trapped}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.islet_yield && (
                  <>
                    <DataItemLabel>Islet Yield</DataItemLabel>
                    <DataItemValue>{primaryIslet.islet_yield}</DataItemValue>
                  </>
                )}
                {primaryIslet.pancreas_weight && (
                  <>
                    <DataItemLabel>IEQ/Pancreas Weight</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.pancreas_weight}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.post_shipment_islet_viability && (
                  <>
                    <DataItemLabel>
                      Post-Shipment islet viability (%)
                    </DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.post_shipment_islet_viability}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.facs_purification?.length > 0 && (
                  <>
                    <DataItemLabel>FACS Purification</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.facs_purification.join(", ")}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.islet_morphology && (
                  <>
                    <DataItemLabel>Islet Morphology</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.islet_morphology ? "Yes" : "No"}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.islet_histology && (
                  <>
                    <DataItemLabel>Islet Histology</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.islet_histology ? "Yes" : "No"}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.preservation_method && (
                  <>
                    <DataItemLabel>Preservation Method</DataItemLabel>
                    <DataItemValue>
                      {primaryIslet.preservation_method}
                    </DataItemValue>
                  </>
                )}
                {primaryIslet.ccf_id && (
                  <>
                    <DataItemLabel>
                      Common Coordinate Framework Identifier
                    </DataItemLabel>
                    <Link
                      href={`https://portal.hubmapconsortium.org/browse/sample/${primaryIslet.ccf_id}`}
                    >
                      {primaryIslet.ccf_id}
                    </Link>
                  </>
                )}
              </BiosampleDataItems>
            </DataArea>
          </DataPanel>
          {donors.length > 0 && <DonorTable donors={donors} />}
          {primaryIslet.file_sets.length > 0 && (
            <FileSetTable
              fileSets={primaryIslet.file_sets}
              reportLinkSpecs={{
                fileSetType: "FileSet",
                identifierProp: "samples.accession",
                itemIdentifier: primaryIslet.accession,
              }}
            />
          )}
          {multiplexedInSamples.length > 0 && (
            <SampleTable
              samples={multiplexedInSamples}
              reportLink={`/multireport/?type=MultiplexedSample&multiplexed_samples.@id=${primaryIslet["@id"]}`}
              title="Multiplexed In Samples"
            />
          )}
          {pooledFrom.length > 0 && (
            <SampleTable
              samples={pooledFrom}
              reportLink={`/multireport/?type=Sample&pooled_in=${primaryIslet["@id"]}`}
              title="Biosamples Pooled From"
            />
          )}
          {pooledIn.length > 0 && (
            <SampleTable
              samples={pooledIn}
              reportLink={`/multireport/?type=Biosample&pooled_from=${primaryIslet["@id"]}`}
              title="Pooled In"
            />
          )}
          {parts.length > 0 && (
            <SampleTable
              samples={parts}
              reportLink={`/multireport/?type=Biosample&part_of=${primaryIslet["@id"]}`}
              title="Sample Parts"
            />
          )}
          {primaryIslet.modifications?.length > 0 && (
            <ModificationTable
              modifications={primaryIslet.modifications}
              reportLink={`/multireport/?type=Modification&biosamples_modified=${primaryIslet["@id"]}`}
              reportLabel={`Report of genetic modifications for ${primaryIslet.accession}`}
            />
          )}
          {sortedFractions.length > 0 && (
            <SampleTable
              samples={sortedFractions}
              reportLink={`/multireport/?type=Sample&sorted_from.@id=${primaryIslet["@id"]}`}
              title="Sorted Fractions of Sample"
            />
          )}
          {treatments.length > 0 && (
            <TreatmentTable
              treatments={treatments}
              reportLink={`/multireport/?type=Treatment&biosamples_treated=${primaryIslet["@id"]}`}
              reportLabel={`Report of treatments applied to the biosample ${primaryIslet.accession}`}
            />
          )}
          {documents.length > 0 && <DocumentTable documents={documents} />}
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

PrimaryIslet.propTypes = {
  // Primary-islet sample to display
  primaryIslet: PropTypes.object.isRequired,
  // Construct library sets associated with the sample
  constructLibrarySets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Disease ontology for this sample
  diseaseTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Documents associated with the sample
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Donors associated with the sample
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Part of Sample
  partOf: PropTypes.object,
  // Sample parts
  parts: PropTypes.arrayOf(PropTypes.object),
  // Pooled from sample
  pooledFrom: PropTypes.arrayOf(PropTypes.object),
  // Pooled in sample
  pooledIn: PropTypes.arrayOf(PropTypes.object),
  // Sorted fractions sample
  sortedFractions: PropTypes.arrayOf(PropTypes.object),
  // Source lab or source for this sample
  // sources: PropTypes.arrayOf(PropTypes.object),
  // Treatments associated with the sample
  treatments: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Multiplexed in samples
  multiplexedInSamples: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Attribution for this sample
  attribution: PropTypes.object,
  // Is the format JSON?
  isJson: PropTypes.bool.isRequired,
};

export async function getServerSideProps({ params, req, query }) {
  const isJson = isJsonFormat(query);
  const request = new FetchRequest({ cookie: req.headers.cookie });
  const primaryIslet = (
    await request.getObject(`/primary-islet/${params.uuid}/`)
  ).union();
  if (FetchRequest.isResponseSuccess(primaryIslet)) {
    let diseaseTerms = [];
    if (primaryIslet.disease_terms?.length > 0) {
      const diseaseTermPaths = primaryIslet.disease_terms.map(
        (diseaseTerm) => diseaseTerm["@id"]
      );
      diseaseTerms = await requestOntologyTerms(diseaseTermPaths, request);
    }
    const documents = primaryIslet.documents
      ? await requestDocuments(primaryIslet.documents, request)
      : [];
    const donors = primaryIslet.donors
      ? await requestDonors(primaryIslet.donors, request)
      : [];
    const partOf = primaryIslet.part_of
      ? (await request.getObject(primaryIslet.part_of)).optional()
      : null;
    const parts =
      primaryIslet.parts?.length > 0
        ? await requestBiosamples(primaryIslet.parts, request)
        : [];
    const pooledFrom =
      primaryIslet.pooled_from?.length > 0
        ? await requestBiosamples(primaryIslet.pooled_from, request)
        : [];
    const pooledIn =
      primaryIslet.pooled_in?.length > 0
        ? await requestBiosamples(primaryIslet.pooled_in, request)
        : [];
    const sortedFractions =
      primaryIslet.sorted_fractions?.length > 0
        ? await requestBiosamples(primaryIslet.sorted_fractions, request)
        : [];
    let treatments = [];
    if (primaryIslet.treatments?.length > 0) {
      const treatmentPaths = primaryIslet.treatments.map(
        (treatment) => treatment["@id"]
      );
      treatments = await requestTreatments(treatmentPaths, request);
    }
    const constructLibrarySets = primaryIslet.construct_library_sets
      ? await requestFileSets(primaryIslet.construct_library_sets, request)
      : [];
    let multiplexedInSamples = [];
    if (primaryIslet.multiplexed_in.length > 0) {
      const multiplexedInPaths = primaryIslet.multiplexed_in.map(
        (sample) => sample["@id"]
      );
      multiplexedInSamples = await requestBiosamples(
        multiplexedInPaths,
        request
      );
    }
    const breadcrumbs = await buildBreadcrumbs(
      primaryIslet,
      primaryIslet.accession,
      req.headers.cookie
    );
    const attribution = await buildAttribution(
      primaryIslet,
      req.headers.cookie
    );
    return {
      props: {
        primaryIslet,
        constructLibrarySets,
        diseaseTerms,
        documents,
        donors,
        partOf,
        parts,
        pooledFrom,
        pooledIn,
        sortedFractions,
        treatments,
        multiplexedInSamples,
        pageContext: {
          title: `${primaryIslet.sample_terms[0].term_name} — ${primaryIslet.accession}`,
        },
        breadcrumbs,
        attribution,
        isJson,
      },
    };
  }
  return errorObjectToProps(primaryIslet);
}
