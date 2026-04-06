// node_modules
import PropTypes from "prop-types";
// components
import AlternateAccessions from "../../components/alternate-accessions";
import Attribution from "../../components/attribution";
import Breadcrumbs from "../../components/breadcrumbs";
import DocumentTable from "../../components/document-table";
import DonorTable from "../../components/donor-table";
import { EditableItem } from "../../components/edit";
import FileSetTable from "../../components/file-set-table";
import JsonDisplay from "../../components/json-display";
import ModificationTable from "../../components/modification-table";
import ObjectPageHeader from "../../components/object-page-header";
import PagePreamble from "../../components/page-preamble";
import PrimaryCellClinicalDashboard from "../../components/primary-cell-clinical-dashboard";
import SampleTable from "../../components/sample-table";
// lib
import buildAttribution from "../../lib/attribution";
import buildBreadcrumbs from "../../lib/breadcrumbs";
import {
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

export default function PrimaryCell({
  primaryCell,
  diseaseTerms,
  documents,
  donors,
  partOf,
  parts,
  pooledFrom,
  pooledIn,
  sortedFractions,
  sortedFromSample,
  sources,
  treatments,
  multiplexedInSamples,
  attribution = null,
  isJson,
}) {
  return (
    <>
      <Breadcrumbs />
      <EditableItem item={primaryCell}>
        <PagePreamble
          pageTitle={primaryCell.accession}
          titleClassName="sr-only"
        >
          <AlternateAccessions
            alternateAccessions={primaryCell.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={primaryCell} isJsonFormat={isJson} />
        <JsonDisplay item={primaryCell} isJsonFormat={isJson}>
          <PrimaryCellClinicalDashboard
            item={primaryCell}
            diseaseTerms={diseaseTerms}
            partOf={partOf}
            sampleTerms={primaryCell.sample_terms ?? []}
            sortedFrom={sortedFromSample}
            sources={sources}
            treatments={treatments}
          />
          {donors.length > 0 && <DonorTable donors={donors} />}
          {primaryCell.file_sets?.length > 0 && (
            <FileSetTable fileSets={primaryCell.file_sets} />
          )}
          {multiplexedInSamples.length > 0 && (
            <SampleTable
              samples={multiplexedInSamples}
              reportLink={`/multireport/?type=MultiplexedSample&multiplexed_samples.@id=${primaryCell["@id"]}`}
              title="Multiplexed In Samples"
            />
          )}
          {pooledFrom.length > 0 && (
            <SampleTable
              samples={pooledFrom}
              reportLink={`/multireport/?type=Sample&pooled_in=${primaryCell["@id"]}`}
              title="Biosamples Pooled From"
            />
          )}
          {pooledIn.length > 0 && (
            <SampleTable
              samples={pooledIn}
              reportLink={`/multireport/?type=Biosample&pooled_from=${primaryCell["@id"]}`}
              title="Pooled In"
            />
          )}
          {parts.length > 0 && (
            <SampleTable
              samples={parts}
              reportLink={`/multireport/?type=Biosample&part_of=${primaryCell["@id"]}`}
              title="Sample Parts"
            />
          )}
          {primaryCell.modifications?.length > 0 && (
            <ModificationTable
              modifications={primaryCell.modifications}
              reportLink={`/multireport/?type=Modification&biosamples_modified=${primaryCell["@id"]}`}
              reportLabel={`Report of genetic modifications for ${primaryCell.accession}`}
            />
          )}
          {sortedFractions.length > 0 && (
            <SampleTable
              samples={sortedFractions}
              reportLink={`/multireport/?type=Sample&sorted_from.@id=${primaryCell["@id"]}`}
              title="Sorted Fractions of Sample"
            />
          )}
          {documents.length > 0 && <DocumentTable documents={documents} />}
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

PrimaryCell.propTypes = {
  primaryCell: PropTypes.object.isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  const primaryCell = (
    await request.getObject(`/primary-cells/${params.uuid}/`)
  ).union();
  if (FetchRequest.isResponseSuccess(primaryCell)) {
    let diseaseTerms = [];
    if (primaryCell.disease_terms?.length > 0) {
      const diseaseTermPaths = primaryCell.disease_terms.map(
        (diseaseTerm) => diseaseTerm["@id"]
      );
      diseaseTerms = await requestOntologyTerms(diseaseTermPaths, request);
    }
    const documents = primaryCell.documents
      ? await requestDocuments(primaryCell.documents, request)
      : [];
    const donors = primaryCell.donors
      ? await requestDonors(primaryCell.donors, request)
      : [];
    const partOf = primaryCell.part_of
      ? (await request.getObject(primaryCell.part_of)).optional()
      : null;
    const sortedFromSample = await fetchSortedFromSample(primaryCell, request);
    const parts =
      primaryCell.parts?.length > 0
        ? await requestBiosamples(primaryCell.parts, request)
        : [];
    const pooledFrom =
      primaryCell.pooled_from?.length > 0
        ? await requestBiosamples(primaryCell.pooled_from, request)
        : [];
    const pooledIn =
      primaryCell.pooled_in?.length > 0
        ? await requestBiosamples(primaryCell.pooled_in, request)
        : [];
    const sortedFractions =
      primaryCell.sorted_fractions?.length > 0
        ? await requestBiosamples(primaryCell.sorted_fractions, request)
        : [];
    let sources = [];
    if (primaryCell.sources?.length > 0) {
      const sourcePaths = primaryCell.sources.map((source) => source["@id"]);
      sources = Ok.all(
        await request.getMultipleObjects(sourcePaths, {
          filterErrors: true,
        })
      );
    }
    let treatments = [];
    if (primaryCell.treatments?.length > 0) {
      const treatmentPaths = primaryCell.treatments.map(
        (treatment) => treatment["@id"]
      );
      treatments = await requestTreatments(treatmentPaths, request);
    }
    let multiplexedInSamples = [];
    if (primaryCell.multiplexed_in?.length > 0) {
      const multiplexedInPaths = primaryCell.multiplexed_in.map(
        (sample) => sample["@id"]
      );
      multiplexedInSamples = await requestBiosamples(
        multiplexedInPaths,
        request
      );
    }
    const breadcrumbs = await buildBreadcrumbs(
      primaryCell,
      primaryCell.accession,
      req.headers.cookie
    );
    const attribution = await buildAttribution(primaryCell, req.headers.cookie);
    return {
      props: {
        primaryCell,
        diseaseTerms,
        documents,
        donors,
        partOf,
        parts,
        pooledFrom,
        pooledIn,
        sortedFractions,
        sortedFromSample,
        sources,
        treatments,
        multiplexedInSamples,
        pageContext: {
          title: `${primaryCell.sample_terms?.[0]?.term_name ?? primaryCell.accession} — ${primaryCell.accession}`,
        },
        breadcrumbs,
        attribution,
        isJson,
      },
    };
  }
  return errorObjectToProps(primaryCell);
}
