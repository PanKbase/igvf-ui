// node_modules
import PropTypes from "prop-types";
// components
import AlternateAccessions from "../../components/alternate-accessions";
import Attribution from "../../components/attribution";
import BiomarkerTable from "../../components/biomarker-table";
import Breadcrumbs from "../../components/breadcrumbs";
import DocumentTable from "../../components/document-table";
import DonorTable from "../../components/donor-table";
import { EditableItem } from "../../components/edit";
import FileSetTable from "../../components/file-set-table";
import HumanBetaCellLineClinicalDashboard from "../../components/human-beta-cell-line-clinical-dashboard";
import JsonDisplay from "../../components/json-display";
import ModificationTable from "../../components/modification-table";
import ObjectPageHeader from "../../components/object-page-header";
import PagePreamble from "../../components/page-preamble";
import SampleTable from "../../components/sample-table";
// lib
import buildAttribution from "../../lib/attribution";
import buildBreadcrumbs from "../../lib/breadcrumbs";
import {
  requestBiomarkers,
  requestBiosamples,
  requestDocuments,
  requestDonors,
  requestOntologyTerms,
  requestTreatments,
} from "../../lib/common-requests";
import { errorObjectToProps } from "../../lib/errors";
import FetchRequest from "../../lib/fetch-request";
import { isJsonFormat } from "../../lib/query-utils";
import { Ok } from "../../lib/result";

async function fetchSortedFromSample(item, request) {
  if (!item?.sorted_from) {
    return null;
  }
  const ref =
    typeof item.sorted_from === "string"
      ? item.sorted_from
      : item.sorted_from["@id"];
  if (!ref) {
    return null;
  }
  return (await request.getObject(ref)).optional();
}

export default function HumanBetaCellLines({
  humanBetaCellLines,
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
  sortedFromSample,
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
      <EditableItem item={humanBetaCellLines}>
        <PagePreamble
          pageTitle={humanBetaCellLines.accession}
          titleClassName="sr-only"
        >
          <AlternateAccessions
            alternateAccessions={humanBetaCellLines.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={humanBetaCellLines} isJsonFormat={isJson} />
        <JsonDisplay item={humanBetaCellLines} isJsonFormat={isJson}>
          <HumanBetaCellLineClinicalDashboard
            item={humanBetaCellLines}
            diseaseTerms={diseaseTerms}
            sources={sources}
            partOf={partOf}
            sampleTerms={humanBetaCellLines.sample_terms ?? []}
            sortedFrom={sortedFromSample}
            treatments={treatments}
          >
            {donors?.length > 0 && <DonorTable donors={donors} />}
            {humanBetaCellLines.file_sets?.length > 0 && (
              <FileSetTable
                fileSets={humanBetaCellLines.file_sets}
                reportLinkSpecs={{
                  fileSetType: "FileSet",
                  identifierProp: "samples.accession",
                  itemIdentifier: humanBetaCellLines.accession,
                }}
              />
            )}
            {multiplexedInSamples?.length > 0 && (
              <SampleTable
                samples={multiplexedInSamples}
                reportLink={`/multireport/?type=MultiplexedSample&multiplexed_samples.@id=${humanBetaCellLines["@id"]}`}
                title="Multiplexed In Samples"
              />
            )}
            {pooledFrom?.length > 0 && (
              <SampleTable
                samples={pooledFrom}
                reportLink={`/multireport/?type=Sample&pooled_in=${humanBetaCellLines["@id"]}`}
                title="Biosamples Pooled From"
              />
            )}
            {pooledIn?.length > 0 && (
              <SampleTable
                samples={pooledIn}
                reportLink={`/multireport/?type=Biosample&pooled_from=${humanBetaCellLines["@id"]}`}
                title="Pooled In"
              />
            )}
            {parts?.length > 0 && (
              <SampleTable
                samples={parts}
                reportLink={`/multireport/?type=Biosample&part_of=${humanBetaCellLines["@id"]}`}
                title="Sample Parts"
              />
            )}
            {humanBetaCellLines.modifications?.length > 0 && (
              <ModificationTable
                modifications={humanBetaCellLines.modifications}
                reportLink={`/multireport/?type=Modification&biosamples_modified=${humanBetaCellLines["@id"]}`}
                reportLabel={`Report of genetic modifications for ${humanBetaCellLines.accession}`}
              />
            )}
            {sortedFractions?.length > 0 && (
              <SampleTable
                samples={sortedFractions}
                reportLink={`/multireport/?type=Sample&sorted_from.@id=${humanBetaCellLines["@id"]}`}
                title="Sorted Fractions of Sample"
              />
            )}
            {biomarkers?.length > 0 && (
              <BiomarkerTable
                biomarkers={biomarkers}
                reportLink={`/multireport/?type=Biomarker&biomarker_for=${humanBetaCellLines["@id"]}`}
                reportLabel={`Report of biological markers that are associated with biosample ${humanBetaCellLines.accession}`}
              />
            )}
            {demultiplexedTo?.length > 0 && (
              <SampleTable
                samples={demultiplexedTo}
                reportLink={`/multireport/?type=Biosample&demultiplexed_from=${humanBetaCellLines["@id"]}`}
                title="Demultiplexed To"
              />
            )}
            {originOf?.length > 0 && (
              <SampleTable
                samples={originOf}
                reportLink={`/multireport/?type=Biosample&originated_from.@id=${humanBetaCellLines["@id"]}`}
                title="Origin Sample Of"
              />
            )}
            {documents?.length > 0 && <DocumentTable documents={documents} />}
          </HumanBetaCellLineClinicalDashboard>
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

HumanBetaCellLines.propTypes = {
  humanBetaCellLines: PropTypes.object.isRequired,
  biomarkers: PropTypes.arrayOf(PropTypes.object).isRequired,
  demultiplexedTo: PropTypes.arrayOf(PropTypes.object).isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  originOf: PropTypes.arrayOf(PropTypes.object),
  partOf: PropTypes.object,
  parts: PropTypes.arrayOf(PropTypes.object),
  pooledFrom: PropTypes.arrayOf(PropTypes.object),
  pooledIn: PropTypes.arrayOf(PropTypes.object),
  sortedFractions: PropTypes.arrayOf(PropTypes.object),
  sortedFromSample: PropTypes.object,
  sources: PropTypes.arrayOf(PropTypes.object),
  treatments: PropTypes.arrayOf(PropTypes.object).isRequired,
  multiplexedInSamples: PropTypes.arrayOf(PropTypes.object).isRequired,
  attribution: PropTypes.object,
  isJson: PropTypes.bool.isRequired,
};

export async function getServerSideProps({ params, req, query }) {
  const isJson = isJsonFormat(query);
  const request = new FetchRequest({ cookie: req.headers.cookie });
  const humanBetaCellLines = (
    await request.getObject(`/human-beta-cell-line/${params.id}/`)
  ).union();
  if (FetchRequest.isResponseSuccess(humanBetaCellLines)) {
    const biomarkers =
      humanBetaCellLines.biomarkers?.length > 0
        ? await requestBiomarkers(humanBetaCellLines.biomarkers, request)
        : [];
    const demultiplexedTo =
      humanBetaCellLines.demultiplexed_to?.length > 0
        ? await requestBiosamples(humanBetaCellLines.demultiplexed_to, request)
        : [];
    let diseaseTerms = [];
    if (humanBetaCellLines.disease_terms?.length > 0) {
      const diseaseTermPaths = humanBetaCellLines.disease_terms.map(
        (diseaseTerm) => diseaseTerm["@id"]
      );
      diseaseTerms = await requestOntologyTerms(diseaseTermPaths, request);
    }
    const documents = humanBetaCellLines.documents
      ? await requestDocuments(humanBetaCellLines.documents, request)
      : [];
    const donors = humanBetaCellLines.donors
      ? await requestDonors(humanBetaCellLines.donors, request)
      : [];
    const partOf = humanBetaCellLines.part_of
      ? (await request.getObject(humanBetaCellLines.part_of)).optional()
      : null;
    const sortedFromSample = await fetchSortedFromSample(
      humanBetaCellLines,
      request
    );
    const parts =
      humanBetaCellLines.parts?.length > 0
        ? await requestBiosamples(humanBetaCellLines.parts, request)
        : [];
    const pooledFrom =
      humanBetaCellLines.pooled_from?.length > 0
        ? await requestBiosamples(humanBetaCellLines.pooled_from, request)
        : [];
    const pooledIn =
      humanBetaCellLines.pooled_in?.length > 0
        ? await requestBiosamples(humanBetaCellLines.pooled_in, request)
        : [];
    const originOf =
      humanBetaCellLines.origin_of?.length > 0
        ? await requestBiosamples(humanBetaCellLines.origin_of, request)
        : [];
    const sortedFractions =
      humanBetaCellLines.sorted_fractions?.length > 0
        ? await requestBiosamples(humanBetaCellLines.sorted_fractions, request)
        : [];
    let sources = [];
    if (humanBetaCellLines.sources?.length > 0) {
      const sourcePaths = humanBetaCellLines.sources.map(
        (source) => source["@id"]
      );
      sources = Ok.all(
        await request.getMultipleObjects(sourcePaths, {
          filterErrors: true,
        })
      );
    }
    let treatments = [];
    if (humanBetaCellLines.treatments?.length > 0) {
      const treatmentPaths = humanBetaCellLines.treatments.map(
        (treatment) => treatment["@id"]
      );
      treatments = await requestTreatments(treatmentPaths, request);
    }
    let multiplexedInSamples = [];
    if (humanBetaCellLines.multiplexed_in?.length > 0) {
      const multiplexedInPaths = humanBetaCellLines.multiplexed_in.map(
        (sample) => sample["@id"]
      );
      multiplexedInSamples = await requestBiosamples(
        multiplexedInPaths,
        request
      );
    }
    const breadcrumbs = await buildBreadcrumbs(
      humanBetaCellLines,
      humanBetaCellLines.accession,
      req.headers.cookie
    );
    const attribution = await buildAttribution(
      humanBetaCellLines,
      req.headers.cookie
    );
    return {
      props: {
        humanBetaCellLines,
        biomarkers,
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
        sortedFromSample,
        sources,
        treatments,
        multiplexedInSamples,
        pageContext: {
          title: `${humanBetaCellLines.sample_terms?.[0]?.term_name || humanBetaCellLines.accession} — ${humanBetaCellLines.accession}`,
        },
        breadcrumbs,
        attribution,
        isJson,
      },
    };
  }
  return errorObjectToProps(humanBetaCellLines);
}
