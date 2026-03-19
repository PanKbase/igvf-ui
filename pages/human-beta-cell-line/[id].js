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

export default function HumanBetaCellLines({
  humanBetaCellLines,
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
      <EditableItem item={humanBetaCellLines}>
        <PagePreamble>
          <AlternateAccessions
            alternateAccessions={humanBetaCellLines.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={humanBetaCellLines} isJsonFormat={isJson} />
        <JsonDisplay item={humanBetaCellLines} isJsonFormat={isJson}>
          <DataPanel>
            <DataArea>
              <BiosampleDataItems
                item={humanBetaCellLines}
                constructLibrarySets={constructLibrarySets}
                diseaseTerms={diseaseTerms}
                partOf={partOf}
                sampleTerms={humanBetaCellLines.sample_terms}
                sources={sources}
              >
                {humanBetaCellLines.sample_name && (
                  <>
                    <DataItemLabel>Sample Name</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.sample_name}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.classifications?.length > 0 && (
                  <>
                    <DataItemLabel>Classifications</DataItemLabel>
                    <DataItemValue>
                      {humanBetaCellLines.classifications.join(", ")}
                    </DataItemValue>
                  </>
                )}
                {humanBetaCellLines.lot_id && (
                  <>
                    <DataItemLabel>Lot ID</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.lot_id}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.product_id && (
                  <>
                    <DataItemLabel>Product ID</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.product_id}</DataItemValue>
                  </>
                )}
                {truthyOrZero(humanBetaCellLines.passage_number) && (
                  <>
                    <DataItemLabel>Passage Number</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.passage_number}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.growth_medium && (
                  <>
                    <DataItemLabel>Growth Medium</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.growth_medium}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.date_obtained && (
                  <>
                    <DataItemLabel>Date Obtained</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.date_obtained}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.date_harvested && (
                  <>
                    <DataItemLabel>Date Harvested</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.date_harvested}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.authentication && (
                  <>
                    <DataItemLabel>Authentication</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.authentication}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.nucleic_acid_delivery && (
                  <>
                    <DataItemLabel>Nucleic Acid Delivery</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.nucleic_acid_delivery}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.url && (
                  <>
                    <DataItemLabel>URL</DataItemLabel>
                    <DataItemValue>
                      <a
                        href={humanBetaCellLines.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {humanBetaCellLines.url}
                      </a>
                    </DataItemValue>
                  </>
                )}
                {humanBetaCellLines.publications?.length > 0 && (
                  <>
                    <DataItemLabel>Publications</DataItemLabel>
                    <DataItemValue>
                      {humanBetaCellLines.publications.map((pmid, index) => (
                        <span key={pmid}>
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${pmid.replace("PMID:", "")}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {pmid}
                          </a>
                          {index < humanBetaCellLines.publications.length - 1 &&
                            ", "}
                        </span>
                      ))}
                    </DataItemValue>
                  </>
                )}
                {humanBetaCellLines.sex && (
                  <>
                    <DataItemLabel>Sex</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.sex}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.age && (
                  <>
                    <DataItemLabel>Age</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.age}</DataItemValue>
                  </>
                )}
                {truthyOrZero(humanBetaCellLines.year_obtained) && (
                  <>
                    <DataItemLabel>Year Obtained</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.year_obtained}</DataItemValue>
                  </>
                )}
                {truthyOrZero(humanBetaCellLines.vendor_passage) && (
                  <>
                    <DataItemLabel>Vendor Passage</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.vendor_passage}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.coating_condition && (
                  <>
                    <DataItemLabel>Coating Condition</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.coating_condition}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.excision_status && (
                  <>
                    <DataItemLabel>Excision Status</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.excision_status}</DataItemValue>
                  </>
                )}
                {humanBetaCellLines.cell_density && (
                  <>
                    <DataItemLabel>Cell Density</DataItemLabel>
                    <DataItemValue>{humanBetaCellLines.cell_density}</DataItemValue>
                  </>
                )}
              </BiosampleDataItems>
            </DataArea>
          </DataPanel>
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
          {treatments?.length > 0 && (
            <TreatmentTable
              treatments={treatments}
              reportLink={`/multireport/?type=Treatment&biosamples_treated=${humanBetaCellLines["@id"]}`}
              reportLabel={`Report of treatments applied to the biosample ${humanBetaCellLines.accession}`}
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
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

HumanBetaCellLines.propTypes = {
  // Human Beta Cell Lines sample to display
  humanBetaCellLines: PropTypes.object.isRequired,
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
    const constructLibrarySets = humanBetaCellLines.construct_library_sets
      ? await requestFileSets(humanBetaCellLines.construct_library_sets, request)
      : [];
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
