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
import PrimaryIsletClinicalDashboard from "../../components/primary-islet-clinical-dashboard";
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

export default function PrimaryIslet({
  primaryIslet,
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
        <PagePreamble
          pageTitle={primaryIslet.accession}
          titleClassName="sr-only"
        >
          <AlternateAccessions
            alternateAccessions={primaryIslet.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={primaryIslet} isJsonFormat={isJson} />
        <JsonDisplay item={primaryIslet} isJsonFormat={isJson}>
          <PrimaryIsletClinicalDashboard
            item={primaryIslet}
            diseaseTerms={diseaseTerms}
            donors={donors}
            partOf={partOf}
            sampleTerms={primaryIslet.sample_terms ?? []}
            treatments={treatments}
          >
            {donors.length > 0 && <DonorTable donors={donors} />}
            {primaryIslet.file_sets?.length > 0 && (
              <FileSetTable fileSets={primaryIslet.file_sets} />
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
            {documents.length > 0 && <DocumentTable documents={documents} />}
          </PrimaryIsletClinicalDashboard>
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

PrimaryIslet.propTypes = {
  primaryIslet: PropTypes.object.isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  partOf: PropTypes.object,
  parts: PropTypes.arrayOf(PropTypes.object),
  pooledFrom: PropTypes.arrayOf(PropTypes.object),
  pooledIn: PropTypes.arrayOf(PropTypes.object),
  sortedFractions: PropTypes.arrayOf(PropTypes.object),
  treatments: PropTypes.arrayOf(PropTypes.object).isRequired,
  multiplexedInSamples: PropTypes.arrayOf(PropTypes.object).isRequired,
  attribution: PropTypes.object,
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
    const rawDonors = Array.isArray(primaryIslet.donors)
      ? primaryIslet.donors
      : [];
    let donors = [];
    if (rawDonors.length > 0) {
      const donorsAreEmbeddedLinks = rawDonors.every(
        (d) => d && typeof d === "object" && typeof d["@id"] === "string"
      );
      if (donorsAreEmbeddedLinks) {
        donors = rawDonors;
      } else {
        const donorPaths = rawDonors
          .map((d) => (typeof d === "string" ? d : d?.["@id"]))
          .filter(Boolean);
        donors =
          donorPaths.length > 0
            ? await requestDonors(donorPaths, request)
            : [];
      }
    }
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
    let multiplexedInSamples = [];
    if (primaryIslet.multiplexed_in?.length > 0) {
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
          title: `${primaryIslet.sample_terms?.[0]?.term_name ?? primaryIslet.accession} — ${primaryIslet.accession}`,
        },
        breadcrumbs,
        attribution,
        isJson,
      },
    };
  }
  return errorObjectToProps(primaryIslet);
}
