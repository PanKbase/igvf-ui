// node_modules
import PropTypes from "prop-types";
// components
import AlternateAccessions from "../../components/alternate-accessions";
import Attribution from "../../components/attribution";
import BiomarkerTable from "../../components/biomarker-table";
import Breadcrumbs from "../../components/breadcrumbs";
import {
  DataArea,
  DataAreaTitle,
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
  _constructLibrarySets,
  demultiplexedTo,
  _diseaseTerms,
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
          {/* Cell line description */}
          <DataAreaTitle>Cell line description</DataAreaTitle>
          <DataPanel>
            <DataArea>
              {humanBetaCellLine.description && (
                <>
                  <DataItemLabel>Description</DataItemLabel>
                  <DataItemValue>{humanBetaCellLine.description}</DataItemValue>
                </>
              )}
              {humanBetaCellLine.sample_terms?.length > 0 && (
                <>
                  <DataItemLabel>Sample Terms</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.sample_terms.map((term, index) => (
                      <span key={term["@id"]}>
                        <a href={term["@id"]}>
                          {term.term_name || term.term_id}
                        </a>
                        {index < humanBetaCellLine.sample_terms.length - 1 &&
                          ", "}
                      </span>
                    ))}
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.sample_name && (
                <>
                  <DataItemLabel>Sample Name</DataItemLabel>
                  <DataItemValue>{humanBetaCellLine.sample_name}</DataItemValue>
                </>
              )}
              {sources?.length > 0 && (
                <>
                  <DataItemLabel>Sources</DataItemLabel>
                  <DataItemValue>
                    {sources.map((source, index) => (
                      <span key={source["@id"]}>
                        <a href={source["@id"]}>{source.title}</a>
                        {index < sources.length - 1 && ", "}
                      </span>
                    ))}
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.classifications?.length > 0 && (
                <>
                  <DataItemLabel>Classifications</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.classifications.join(", ")}
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.lot_id && (
                <>
                  <DataItemLabel>Lot ID</DataItemLabel>
                  <DataItemValue>{humanBetaCellLine.lot_id}</DataItemValue>
                </>
              )}
              {humanBetaCellLine.product_id && (
                <>
                  <DataItemLabel>Product ID</DataItemLabel>
                  <DataItemValue>{humanBetaCellLine.product_id}</DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>
          {documents.length > 0 && <DocumentTable documents={documents} />}

          {/* Cell line biosample description */}
          <DataAreaTitle>Cell line biosample description</DataAreaTitle>
          <DataPanel>
            <DataArea>
              {truthyOrZero(humanBetaCellLine.starting_amount) && (
                <>
                  <DataItemLabel>Starting Amount</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.starting_amount}
                    {humanBetaCellLine.starting_amount_units &&
                      ` ${humanBetaCellLine.starting_amount_units}`}
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.growth_medium && (
                <>
                  <DataItemLabel>Growth Medium</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.growth_medium}
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
              {humanBetaCellLine.date_obtained && (
                <>
                  <DataItemLabel>Date Obtained</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.date_obtained}
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.date_harvested && (
                <>
                  <DataItemLabel>Date Harvested</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.date_harvested}
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.authentication && (
                <>
                  <DataItemLabel>Authentication</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.authentication}
                  </DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>

          {humanBetaCellLine.modifications?.length > 0 && (
            <ModificationTable
              modifications={humanBetaCellLine.modifications}
              reportLink={`/multireport/?type=Modification&biosamples_modified=${humanBetaCellLine["@id"]}`}
              reportLabel={`Report of genetic modifications for ${humanBetaCellLine.accession}`}
            />
          )}

          {treatments.length > 0 && (
            <TreatmentTable
              treatments={treatments}
              reportLink={`/multireport/?type=Treatment&biosamples_treated=${humanBetaCellLine["@id"]}`}
              reportLabel={`Report of treatments applied to the biosample ${humanBetaCellLine.accession}`}
            />
          )}

          {biomarkers.length > 0 && (
            <BiomarkerTable
              biomarkers={biomarkers}
              reportLink={`/multireport/?type=Biomarker&biomarker_for=${humanBetaCellLine["@id"]}`}
              reportLabel={`Report of biological markers that are associated with biosample ${humanBetaCellLine.accession}`}
            />
          )}

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

          {/* Cell line biosample relationship description */}
          <DataAreaTitle>
            Cell line biosample relationship description
          </DataAreaTitle>
          <DataPanel>
            <DataArea>
              {partOf && (
                <>
                  <DataItemLabel>Part Of</DataItemLabel>
                  <DataItemValue>
                    <a href={partOf["@id"]}>
                      {partOf.accession || partOf.sample_name}
                    </a>
                  </DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>
          {parts.length > 0 && (
            <SampleTable
              samples={parts}
              reportLink={`/multireport/?type=Biosample&part_of=${humanBetaCellLine["@id"]}`}
              title="Parts"
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
              title="Demultiplexed To"
            />
          )}
          {multiplexedInSamples.length > 0 && (
            <SampleTable
              samples={multiplexedInSamples}
              reportLink={`/multireport/?type=MultiplexedSample&multiplexed_samples.@id=${humanBetaCellLine["@id"]}`}
              title="Multiplexed In"
            />
          )}
          {sortedFractions.length > 0 && (
            <SampleTable
              samples={sortedFractions}
              reportLink={`/multireport/?type=Sample&sorted_from.@id=${humanBetaCellLine["@id"]}`}
              title="Sorted Fractions"
            />
          )}

          {/* Donor description */}
          <DataAreaTitle>Donor description</DataAreaTitle>
          <DataPanel>
            <DataArea>
              {humanBetaCellLine.sex && (
                <>
                  <DataItemLabel>Sex</DataItemLabel>
                  <DataItemValue>{humanBetaCellLine.sex}</DataItemValue>
                </>
              )}
              {humanBetaCellLine.age && (
                <>
                  <DataItemLabel>Age</DataItemLabel>
                  <DataItemValue>{humanBetaCellLine.age}</DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>
          {donors.length > 0 && <DonorTable donors={donors} />}

          {/* External references */}
          <DataAreaTitle>External references</DataAreaTitle>
          <DataPanel>
            <DataArea>
              {humanBetaCellLine.url && (
                <>
                  <DataItemLabel>URL</DataItemLabel>
                  <DataItemValue>
                    <a
                      href={humanBetaCellLine.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {humanBetaCellLine.url}
                    </a>
                  </DataItemValue>
                </>
              )}
              {humanBetaCellLine.publications?.length > 0 && (
                <>
                  <DataItemLabel>Publications</DataItemLabel>
                  <DataItemValue>
                    {humanBetaCellLine.publications.map((pmid, index) => (
                      <span key={pmid}>
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${pmid.replace("PMID:", "")}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pmid}
                        </a>
                        {index < humanBetaCellLine.publications.length - 1 &&
                          ", "}
                      </span>
                    ))}
                  </DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>

          {/* Additional sections */}
          {pooledFrom.length > 0 && (
            <SampleTable
              samples={pooledFrom}
              reportLink={`/multireport/?type=Sample&pooled_in=${humanBetaCellLine["@id"]}`}
              title="Biosamples Pooled From"
            />
          )}
          {originOf.length > 0 && (
            <SampleTable
              samples={originOf}
              reportLink={`/multireport/?type=Biosample&originated_from.@id=${humanBetaCellLine["@id"]}`}
              title="Origin Sample Of"
            />
          )}
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
  _constructLibrarySets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Demultiplexed to sample
  demultiplexedTo: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Disease ontology for this sample
  _diseaseTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    let _diseaseTerms = [];
    if (humanBetaCellLine.disease_terms) {
      const diseaseTermPaths = humanBetaCellLine.disease_terms.map(
        (diseaseTerm) => diseaseTerm["@id"]
      );
      _diseaseTerms = await requestOntologyTerms(diseaseTermPaths, request);
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
      const sourcePaths = humanBetaCellLine.sources.map(
        (source) => source["@id"]
      );
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
    const _constructLibrarySets = humanBetaCellLine.construct_library_sets
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
        _constructLibrarySets,
        demultiplexedTo,
        _diseaseTerms,
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
