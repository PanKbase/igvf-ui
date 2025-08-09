// node_modules
import PropTypes from "prop-types";
// components
import AlternateAccessions from "../../components/alternate-accessions";
import Attribution from "../../components/attribution";
import BiomarkerTable from "../../components/biomarker-table";
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
  requestBiomarkers,
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
import { Ok } from "../../lib/result";

export default function HumanBetaCellLine({
  humanBetaCellLine,
  constructLibrarySets,
  demultiplexedTo,
  diseaseTerms,
  documents,
  donors,
  originOf,
  partOf,
  parts,
  pooledFrom,
  pooledIn,
  sortedFractions,
  sources,
  treatments,
  biomarkers,
  multiplexedInSamples,
  attribution = null,
  isJson,
}) {
  return (
    <>
      <Breadcrumbs />
      <EditableItem item={humanBetaCellLine}>
        <PagePreamble>
          <AlternateAccessions
            alternateAccessions={humanBetaCellLine.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={humanBetaCellLine} isJsonFormat={isJson} />
        <JsonDisplay item={humanBetaCellLine} isJsonFormat={isJson}>
          <DataPanel>
            <DataArea>
              <BiosampleDataItems
                item={humanBetaCellLine}
                classifications={humanBetaCellLine.classifications}
                constructLibrarySets={constructLibrarySets}
                diseaseTerms={diseaseTerms}
                parts={parts}
                partOf={partOf}
                sampleTerms={humanBetaCellLine.sample_terms}
                sources={sources}
                options={{
                  dateObtainedTitle: "Date Obtained",
                }}
              >
                {humanBetaCellLine.sample_name && (
                  <>
                    <DataItemLabel>Sample Name</DataItemLabel>
                    <DataItemValue>
                      {humanBetaCellLine.sample_name}
                    </DataItemValue>
                  </>
                )}
                {truthyOrZero(humanBetaCellLine.passage_number) && (
                  <>
                    <DataItemLabel>Passage Number</DataItemLabel>
                    <DataItemValue>
                      {humanBetaCellLine.passage_number}
                    </DataItemValue>
                  </>
                )}
                {humanBetaCellLine.growth_medium && (
                  <>
                    <DataItemLabel>Growth Medium</DataItemLabel>
                    <DataItemValue>{humanBetaCellLine.growth_medium}</DataItemValue>
                  </>
                )}
                {humanBetaCellLine.date_harvested && (
                  <>
                    <DataItemLabel>Date Harvested</DataItemLabel>
                    <DataItemValue>{humanBetaCellLine.date_harvested}</DataItemValue>
                  </>
                )}
                {humanBetaCellLine.authentication && (
                  <>
                    <DataItemLabel>Authentication</DataItemLabel>
                    <DataItemValue>{humanBetaCellLine.authentication}</DataItemValue>
                  </>
                )}
              </BiosampleDataItems>
            </DataArea>
          </DataPanel>
          {donors.length > 0 && <DonorTable donors={donors} />}
          {humanBetaCellLine.file_sets.length > 0 && (
            <FileSetTable
              fileSets={humanBetaCellLine.file_sets}
              reportLinkSpecs={{
                fileSetType: "FileSet",
                identifierProp: "samples.accession",
                itemIdentifier: humanBetaCellLine.accession,
              }}
            />
          )}
          {multiplexedInSamples.length > 0 && (
            <SampleTable
              samples={multiplexedInSamples}
              reportLink={`/multireport/?type=MultiplexedSample&multiplexed_samples.@id=${humanBetaCellLine["@id"]}`}
              title="Multiplexed In Samples"
            />
          )}
          {pooledFrom.length > 0 && (
            <SampleTable
              samples={pooledFrom}
              reportLink={`/multireport/?type=Sample&pooled_in=${humanBetaCellLine["@id"]}`}
              title="Biosamples Pooled From"
            />
          )}
          {pooledIn.length > 0 && (
            <SampleTable
              samples={pooledIn}
              reportLink={`/multireport/?type=Biosample&pooled_from=${humanBetaCellLine["@id"]}`}
              title="Pooled In"
            />
          )}
          {demultiplexedTo.length > 0 && (
            <SampleTable
              samples={demultiplexedTo}
              reportLink={`/multireport/?type=Biosample&demultiplexed_from=${humanBetaCellLine["@id"]}`}
              title="Demultiplexed To Sample"
            />
          )}
          {parts.length > 0 && (
            <SampleTable
              samples={parts}
              reportLink={`/multireport/?type=Biosample&part_of=${humanBetaCellLine["@id"]}`}
              title="Sample Parts"
            />
          )}
          {originOf.length > 0 && (
            <SampleTable
              samples={originOf}
              reportLink={`/multireport/?type=Biosample&originated_from.@id=${humanBetaCellLine["@id"]}`}
              title="Origin Sample Of"
            />
          )}
          {humanBetaCellLine.modifications?.length > 0 && (
            <ModificationTable
              modifications={humanBetaCellLine.modifications}
              reportLink={`/multireport/?type=Modification&biosamples_modified=${humanBetaCellLine["@id"]}`}
              reportLabel={`Report of genetic modifications for ${humanBetaCellLine.accession}`}
            />
          )}
          {sortedFractions.length > 0 && (
            <SampleTable
              samples={sortedFractions}
              reportLink={`/multireport/?type=Sample&sorted_from.@id=${humanBetaCellLine["@id"]}`}
              title="Sorted Fractions of Sample"
            />
          )}
          {biomarkers.length > 0 && (
            <BiomarkerTable
              biomarkers={biomarkers}
              reportLink={`/multireport/?type=Biomarker&biomarker_for=${humanBetaCellLine["@id"]}`}
              reportLabel={`Report of biological markers that are associated with biosample ${humanBetaCellLine.accession}`}
            />
          )}
          {treatments.length > 0 && (
            <TreatmentTable
              treatments={treatments}
              reportLink={`/multireport/?type=Treatment&biosamples_treated=${humanBetaCellLine["@id"]}`}
              reportLabel={`Report of treatments applied to the biosample ${humanBetaCellLine.accession}`}
            />
          )}
          {documents.length > 0 && <DocumentTable documents={documents} />}
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

HumanBetaCellLine.propTypes = {
  // Human Beta Cell Line sample to display
  humanBetaCellLine: PropTypes.object.isRequired,
  // Biomarkers of the sample
  biomarkers: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Construct libraries that link to this object
  constructLibrarySets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Demultiplexed to sample
  demultiplexedTo: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Disease ontology for this sample
  diseaseTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Documents associated with the sample
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Donors associated with the sample
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Origin of sample
  originOf: PropTypes.arrayOf(PropTypes.object),
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
  sources: PropTypes.arrayOf(PropTypes.object),
  // Treatments of the sample
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
  const humanBetaCellLine = (
    await request.getObject(`/human-beta-cell-line/${params.id}/`)
  ).union();
  if (FetchRequest.isResponseSuccess(humanBetaCellLine)) {
    const biomarkers =
      humanBetaCellLine.biomarkers?.length > 0
        ? await requestBiomarkers(humanBetaCellLine.biomarkers, request)
        : [];
    const demultiplexedTo =
      humanBetaCellLine.demultiplexed_to?.length > 0
        ? await requestBiosamples(humanBetaCellLine.demultiplexed_to, request)
        : [];
    let diseaseTerms = [];
    if (humanBetaCellLine.disease_terms) {
      const diseaseTermPaths = humanBetaCellLine.disease_terms.map(
        (diseaseTerm) => diseaseTerm["@id"]
      );
      diseaseTerms = await requestOntologyTerms(diseaseTermPaths, request);
    }
    const documents = humanBetaCellLine.documents
      ? await requestDocuments(humanBetaCellLine.documents, request)
      : [];
    const donors = humanBetaCellLine.donors
      ? await requestDonors(humanBetaCellLine.donors, request)
      : [];
    const partOf = humanBetaCellLine.part_of
      ? (await request.getObject(humanBetaCellLine.part_of)).optional()
      : null;
    const parts =
      humanBetaCellLine.parts?.length > 0
        ? await requestBiosamples(humanBetaCellLine.parts, request)
        : [];
    const pooledFrom =
      humanBetaCellLine.pooled_from?.length > 0
        ? await requestBiosamples(humanBetaCellLine.pooled_from, request)
        : [];
    const pooledIn =
      humanBetaCellLine.pooled_in?.length > 0
        ? await requestBiosamples(humanBetaCellLine.pooled_in, request)
        : [];
    const originOf =
      humanBetaCellLine.origin_of?.length > 0
        ? await requestBiosamples(humanBetaCellLine.origin_of, request)
        : [];
    const sortedFractions =
      humanBetaCellLine.sorted_fractions?.length > 0
        ? await requestBiosamples(humanBetaCellLine.sorted_fractions, request)
        : [];
    let sources = [];
    if (humanBetaCellLine.sources?.length > 0) {
      const sourcePaths = humanBetaCellLine.sources.map((source) => source["@id"]);
      sources = Ok.all(
        await request.getMultipleObjects(sourcePaths, {
          filterErrors: true,
        })
      );
    }
    let treatments = [];
    if (humanBetaCellLine.treatments?.length > 0) {
      const treatmentPaths = humanBetaCellLine.treatments.map(
        (treatment) => treatment["@id"]
      );
      treatments = await requestTreatments(treatmentPaths, request);
    }
    const constructLibrarySets = humanBetaCellLine.construct_library_sets
      ? await requestFileSets(humanBetaCellLine.construct_library_sets, request)
      : [];
    let multiplexedInSamples = [];
    if (humanBetaCellLine.multiplexed_in?.length > 0) {
      const multiplexedInPaths = humanBetaCellLine.multiplexed_in.map(
        (sample) => sample["@id"]
      );
      multiplexedInSamples = await requestBiosamples(
        multiplexedInPaths,
        request
      );
    }
    const breadcrumbs = await buildBreadcrumbs(
      humanBetaCellLine,
      humanBetaCellLine.accession,
      req.headers.cookie
    );
    const attribution = await buildAttribution(
      humanBetaCellLine,
      req.headers.cookie
    );
    return {
      props: {
        humanBetaCellLine,
        biomarkers,
        constructLibrarySets,
        demultiplexedTo,
        diseaseTerms,
        documents,
        donors,
        originOf,
        pooledFrom,
        parts,
        partOf,
        pooledIn,
        sortedFractions,
        sources,
        treatments,
        multiplexedInSamples,
        pageContext: {
          title: `${humanBetaCellLine.sample_terms[0].term_name} — ${humanBetaCellLine.accession}`,
        },
        breadcrumbs,
        attribution,
        isJson,
      },
    };
  }
  return errorObjectToProps(humanBetaCellLine);
}