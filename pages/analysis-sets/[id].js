// node_modules
import _ from "lodash";
import PropTypes from "prop-types";
import { useEffect } from "react";
// components
import AlternateAccessions from "../../components/alternate-accessions";
import Attribution from "../../components/attribution";
import Breadcrumbs from "../../components/breadcrumbs";
import {
  DataArea,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "../../components/data-area";
import { usePagePanels } from "../../components/page-panels";
import DbxrefList from "../../components/dbxref-list";
import DocumentTable from "../../components/document-table";
import DonorTable from "../../components/donor-table";
import { EditableItem } from "../../components/edit";
import { FileGraph } from "../../components/file-graph";
import FileTable from "../../components/file-table";
// Temporarily disabled: import InputFileSets from "../../components/input-file-sets";
import JsonDisplay from "../../components/json-display";
import ObjectPageHeader from "../../components/object-page-header";
import PagePreamble from "../../components/page-preamble";
// lib
import buildAttribution from "../../lib/attribution";
import buildBreadcrumbs from "../../lib/breadcrumbs";
import {
  requestDocuments,
  requestFileSets,
  requestFiles,
} from "../../lib/common-requests";
import { errorObjectToProps } from "../../lib/errors";
import FetchRequest from "../../lib/fetch-request";
import { getAllDerivedFromFiles } from "../../lib/files";
import { isJsonFormat } from "../../lib/query-utils";
import SampleTable from "../../components/sample-table";

export default function AnalysisSet({
  analysisSet,
  documents = [],
  files = [],
  fileFileSets = [],
  derivedFromFiles = [],
  inputFileSets = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputFileSetSamples = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  controlFileSets = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appliedToSamples = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  auxiliarySets = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  measurementSets = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructLibrarySets = [],
  attribution = null,
  isJson = false,
}) {
  // Hooks must be called unconditionally at the top level
  useEffect(() => {
    console.log('[AnalysisSet] Component mounted', {
      id: analysisSet?.["@id"],
      accession: analysisSet?.accession,
      fileSetType: analysisSet?.file_set_type,
      filesCount: files?.length || 0,
      inputFileSetsCount: inputFileSets?.length || 0,
      fileFileSetsCount: fileFileSets?.length || 0,
      derivedFromFilesCount: derivedFromFiles?.length || 0,
    });
  }, [analysisSet, files, fileFileSets, derivedFromFiles]); // inputFileSets removed

  const pagePanels = usePagePanels(analysisSet?.["@id"] || "");

  if (!analysisSet) {
    return null;
  }
  return (
    <>
      <Breadcrumbs />
      <EditableItem item={analysisSet}>
        <PagePreamble>
          <AlternateAccessions
            alternateAccessions={analysisSet.alternate_accessions}
          />
        </PagePreamble>
        <ObjectPageHeader item={analysisSet} isJsonFormat={isJson} />
        <JsonDisplay item={analysisSet} isJsonFormat={isJson}>
          <DataPanel>
            <DataArea>
              <DataItemLabel>File Set Type</DataItemLabel>
              <DataItemValue>{analysisSet.file_set_type}</DataItemValue>
              {analysisSet.publication_identifiers?.length > 0 && (
                <>
                  <DataItemLabel>Publication Identifiers</DataItemLabel>
                  <DataItemValue>
                    <DbxrefList
                      dbxrefs={analysisSet.publication_identifiers}
                      isCollapsible
                    />
                  </DataItemValue>
                </>
              )}
              {analysisSet.submitter_comment && (
                <>
                  <DataItemLabel>Submitter Comment</DataItemLabel>
                  <DataItemValue>{analysisSet.submitter_comment}</DataItemValue>
                </>
              )}
              {analysisSet.summary && (
                <>
                  <DataItemLabel>Summary</DataItemLabel>
                  <DataItemValue>{analysisSet.summary}</DataItemValue>
                </>
              )}
              {analysisSet.description && (
                <>
                  <DataItemLabel>Description</DataItemLabel>
                  <DataItemValue>{analysisSet.description}</DataItemValue>
                </>
              )}
            </DataArea>
          </DataPanel>

          {analysisSet.samples?.length > 0 && (
            <SampleTable
              samples={analysisSet.samples}
              reportLink={`/multireport/?type=Sample&file_sets.@id=${analysisSet?.["@id"] || ""}`}
            />
          )}

          {analysisSet.donors?.length > 0 && (
            <DonorTable donors={analysisSet.donors} />
          )}

          {/* Temporarily disabled Input File Sets to debug 500 error
          {inputFileSets.length > 0 && (
            <InputFileSets
              thisFileSet={analysisSet}
              fileSets={inputFileSets}
              samples={inputFileSetSamples}
              controlFileSets={controlFileSets}
              appliedToSamples={appliedToSamples}
              auxiliarySets={auxiliarySets}
              measurementSets={measurementSets}
              constructLibrarySets={constructLibrarySets}
            />
          )}
          */}

          {files.length > 0 && (
            <>
              <FileTable files={files} fileSet={analysisSet} isDownloadable />
              <FileGraph
                fileSet={analysisSet}
                files={files}
                fileFileSets={fileFileSets}
                derivedFromFiles={derivedFromFiles}
                pagePanels={pagePanels}
                pagePanelId="file-graph"
              />
            </>
          )}

          {documents.length > 0 && <DocumentTable documents={documents} />}
          <Attribution attribution={attribution} />
        </JsonDisplay>
      </EditableItem>
    </>
  );
}

AnalysisSet.propTypes = {
  analysisSet: PropTypes.object.isRequired,
  // Files to display
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileFileSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  derivedFromFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Input file sets to display
  inputFileSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Input file set samples
  inputFileSetSamples: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Control file sets to display
  controlFileSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Applied-to samples to display
  appliedToSamples: PropTypes.arrayOf(PropTypes.object).isRequired,
  // AuxiliarySets to display
  auxiliarySets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // MeasurementSets to display
  measurementSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // ConstructLibrarySets to display
  constructLibrarySets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Documents associated with this analysis set
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Attribution for this analysis set
  attribution: PropTypes.object,
  // Is the format JSON?
  isJson: PropTypes.bool.isRequired,
};

export async function getServerSideProps({ params, req, query }) {
  console.log('[AnalysisSet] getServerSideProps started', { id: params.id });
  try {
    const isJson = isJsonFormat(query);
    const request = new FetchRequest({ cookie: req.headers.cookie });
    console.log('[AnalysisSet] Fetching analysis set', { id: params.id });
    const analysisSet = (
      await request.getObject(`/analysis-sets/${params.id}/`)
    ).union();
    console.log('[AnalysisSet] Analysis set response', {
      success: FetchRequest.isResponseSuccess(analysisSet),
      hasFiles: !!analysisSet?.files,
      fileCount: analysisSet?.files?.length || 0,
      hasInputFileSets: !!analysisSet?.input_file_sets,
      inputFileSetCount: analysisSet?.input_file_sets?.length || 0,
    });
    if (FetchRequest.isResponseSuccess(analysisSet)) {
    const documents = analysisSet.documents
      ? await requestDocuments(analysisSet.documents, request)
      : [];

    const filePaths = (analysisSet.files || []).filter(file => file).map((file) => file["@id"]);
    console.log('[AnalysisSet] Processing files', { fileCount: filePaths.length });
    let files = [];
    try {
      files = filePaths.length > 0 ? await requestFiles(filePaths, request) : [];
    } catch (error) {
      console.error('[AnalysisSet] Error fetching files', { error: error.message, filePaths });
      files = [];
    }
    console.log('[AnalysisSet] Files fetched', { filesCount: files.length });
    const derivedFromFiles = await getAllDerivedFromFiles(files, request);
    console.log('[AnalysisSet] Derived from files', { derivedFromFilesCount: derivedFromFiles.length });
    const combinedFiles = files.concat(derivedFromFiles);
    console.log('[AnalysisSet] Combined files', { combinedFilesCount: combinedFiles.length });
    // Get all file-set objects in every file's `file_sets` property.
    let fileFileSets = [];
    if (combinedFiles.length > 0) {
      const fileSetPaths = combinedFiles.reduce((acc, file) => {
        if (file.file_set?.["@id"]) {
          return acc.includes(file.file_set["@id"])
            ? acc
            : acc.concat(file.file_set["@id"]);
        }
        return acc;
      }, []);
      console.log('[AnalysisSet] File set paths extracted', { fileSetPathsCount: fileSetPaths.length });
      fileFileSets = await requestFileSets(fileSetPaths, request);
      console.log('[AnalysisSet] File file sets fetched', { fileFileSetsCount: fileFileSets.length });
    }
    // Temporarily disabled Input File Sets fetching to debug 500 error
    const inputFileSets = [];
    /*
    if (analysisSet.input_file_sets?.length > 0) {
      // The embedded `input_file_sets` in the analysis set don't have enough properties to display
      // in the table, so we have to request them.
      const inputFileSetPaths = (analysisSet.input_file_sets || [])
        .filter(fileSet => fileSet)
        .map((fileSet) => fileSet["@id"]);
      console.log('[AnalysisSet] Fetching input file sets', { inputFileSetPathsCount: inputFileSetPaths.length });
      try {
        inputFileSets = await requestFileSets(inputFileSetPaths, request, [
          "applied_to_samples",
          "auxiliary_sets",
          "control_file_sets",
          "measurement_sets",
        ]);
      } catch (error) {
        console.error('[AnalysisSet] Error fetching input file sets', { error: error.message, inputFileSetPaths });
        inputFileSets = [];
      }
      console.log('[AnalysisSet] Input file sets fetched', { inputFileSetsCount: inputFileSets.length });
    }
    */

    // Temporarily disabled - depends on inputFileSets
    // All Input File Sets processing code is disabled below
    const appliedToSamples = [];
    const auxiliarySets = [];
    const controlFileSets = [];
    const measurementSets = [];
    /* eslint-disable */
    /*
    if (inputFileSets.length > 0) {
      // Retrieve the input file sets' applied to samples.
      appliedToSamples = inputFileSets.reduce((acc, fileSet) => {
        if (fileSet?.applied_to_samples?.length > 0) {
          const filtered = fileSet.applied_to_samples.filter(item => item);
          return acc.concat(filtered);
        }
        return acc;
      }, []);
      let appliedToSamplePaths = appliedToSamples
        .filter(sample => sample)
        .map((sample) => sample["@id"]);
      appliedToSamplePaths = [...new Set(appliedToSamplePaths)];
      appliedToSamples =
        appliedToSamplePaths.length > 0
          ? await requestSamples(appliedToSamplePaths, request)
          : [];

      // Retrieve the input file sets' auxiliary sets.
      let auxiliarySetsPaths = inputFileSets.reduce((acc, fileSet) => {
        return fileSet.auxiliary_sets?.length > 0
          ? acc.concat(
              (fileSet.auxiliary_sets || []).filter(auxiliarySet => auxiliarySet).map((auxiliarySet) => auxiliarySet["@id"])
            )
          : acc;
      }, []);
      auxiliarySetsPaths = [...new Set(auxiliarySetsPaths)];
      auxiliarySets =
        auxiliarySetsPaths.length > 0
          ? await requestFileSets(auxiliarySetsPaths, request)
          : [];

      // Retrieve the input file sets' measurement sets.
      measurementSets = inputFileSets.reduce((acc, fileSet) => {
        if (fileSet?.measurement_sets?.length > 0) {
          const filtered = fileSet.measurement_sets.filter(item => item);
          return acc.concat(filtered);
        }
        return acc;
      }, []);
      let measurementSetPaths = measurementSets
        .filter(measurementSet => measurementSet)
        .map((measurementSet) => measurementSet["@id"]);
      measurementSetPaths = [...new Set(measurementSetPaths)];
      measurementSets =
        measurementSetPaths.length > 0
          ? await requestFileSets(measurementSetPaths, request)
          : [];

      // Retrieve the input file sets' control file sets.
      controlFileSets = inputFileSets.reduce((acc, fileSet) => {
        if (fileSet?.control_file_sets?.length > 0) {
          const filtered = fileSet.control_file_sets.filter(item => item);
          return acc.concat(filtered);
        }
        return acc;
      }, []);
      let controlFileSetPaths = controlFileSets
        .filter(controlFileSet => controlFileSet)
        .map((controlFileSet) => controlFileSet["@id"]);
      controlFileSetPaths = [...new Set(controlFileSetPaths)];
      controlFileSets = await requestFileSets(controlFileSetPaths, request);
    }
    */
    /* eslint-enable */

    // Temporarily disabled - depends on inputFileSets
    const _embeddedSamples = [];
    /*
    const embeddedSamples = inputFileSets.reduce((acc, inputFileSet) => {
      if (inputFileSet?.samples?.length > 0) {
        const filtered = inputFileSet.samples.filter(item => item);
        return acc.concat(filtered);
      }
      return acc;
    }, []);
    */

    const inputFileSetSamples = [];
    /*
    if (embeddedSamples.length > 0) {
      let samplePaths = embeddedSamples.filter(sample => sample).map((sample) => sample["@id"]);
      samplePaths = [...new Set(samplePaths)];
      inputFileSetSamples = await requestSamples(samplePaths, request);
    }
    */

    // Temporarily disabled - depends on inputFileSetSamples
    const constructLibrarySets = [];
    /*
    if (inputFileSetSamples.length > 0) {
      let constructLibrarySetPaths = inputFileSetSamples.reduce(
        (acc, sample) => {
          if (sample?.construct_library_sets?.length > 0) {
            const filtered = sample.construct_library_sets.filter(item => item);
            return acc.concat(filtered);
          }
          return acc;
        },
        []
      );

      if (constructLibrarySetPaths.length > 0) {
        // Extract @id if they are objects, otherwise use as-is
        constructLibrarySetPaths = constructLibrarySetPaths
          .filter(item => item)
          .map(item => typeof item === 'string' ? item : item?.["@id"])
          .filter(path => path); // Remove any null/undefined after mapping
        constructLibrarySetPaths = [...new Set(constructLibrarySetPaths)];
        constructLibrarySets = await requestFileSets(
          constructLibrarySetPaths,
          request,
          ["integrated_content_files"]
        );
      }
    }
    */

    const breadcrumbs = await buildBreadcrumbs(
      analysisSet,
      analysisSet.accession,
      req.headers.cookie
    );
    const attribution = await buildAttribution(analysisSet, req.headers.cookie);
    console.log('[AnalysisSet] getServerSideProps completed successfully', { id: params.id });
    return {
      props: {
        analysisSet,
        documents,
        files,
        fileFileSets,
        derivedFromFiles,
        inputFileSets,
        inputFileSetSamples,
        controlFileSets,
        appliedToSamples,
        auxiliarySets,
        measurementSets,
        constructLibrarySets,
        pageContext: { title: analysisSet.accession },
        breadcrumbs,
        attribution,
        isJson,
      },
    };
  }
  console.error('[AnalysisSet] Analysis set fetch failed', { id: params.id, analysisSet });
  return errorObjectToProps(analysisSet);
  } catch (error) {
    console.error('[AnalysisSet] Error in getServerSideProps', {
      id: params.id,
      error: error.message,
      stack: error.stack,
      name: error.name,
      errorString: String(error),
    });
    // Log the full error for debugging
    console.error('[AnalysisSet] Full error object:', error);
    // Create a proper error object for errorObjectToProps
    // If error has a code property, use it; otherwise default to 500
    const errorObject = {
      code: error.code || 500,
      detail: error.message || error.detail || 'An error occurred while fetching the analysis set',
      ...error,
    };
    return errorObjectToProps(errorObject);
  }
}
