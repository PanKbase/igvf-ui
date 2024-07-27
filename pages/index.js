// node_modules
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import PropTypes from "prop-types";
// components
import ChartFileSetLab from "../components/chart-file-set-lab";
import ChartFileSetRelease from "../components/chart-file-set-release";
import { DataAreaTitle, DataPanel } from "../components/data-area";
import HomeTitle from "../components/home-title";
import Icon from "../components/icon";
// lib
import { errorObjectToProps } from "../lib/errors";
import FetchRequest from "../lib/fetch-request";
import { abbreviateNumber } from "../lib/general";
import { convertFileSetsToReleaseData } from "../lib/home";

/**
 * Display a statistic panel that shows some property and count of their occurrences in the
 * database.
 */
function Statistic({ graphic, label, value, query, colorClass }) {
  return (
    <div
      className={`my-4 grow basis-1/3 rounded border @xl/home:my-0 ${colorClass}`}
    >
      <Link
        href={`/search/?${query}`}
        className={`flex h-full items-center gap-4 p-2 no-underline`}
      >
        <div className="h-10 w-10 min-w-10 basis-10 rounded-full border border-gray-400 p-2 dark:border-gray-500">
          {graphic}
        </div>
        <div className="shrink">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </div>
          <div className="text-4xl font-light text-gray-800 dark:text-gray-200">
            {abbreviateNumber(value)}
          </div>
        </div>
      </Link>
    </div>
  );
}

Statistic.propTypes = {
  // Graphic component to display
  graphic: PropTypes.element.isRequired,
  // Label for the statistic
  label: PropTypes.string.isRequired,
  // Value for the statistic
  value: PropTypes.number.isRequired,
  // Statistic box links to search URI with this query
  query: PropTypes.string.isRequired,
  // Add Tailwind CSS color classes to the statistic box
  colorClass: PropTypes.string,
};

/**
 * Display the chart of file sets by lab and summary, along with the chart's title.
 */
function FileSetChartSection({ title = "", children }) {
  return (
    <section className="relative my-8 hidden @xl/home:block">
      {title && <DataAreaTitle className="text-center">{title}</DataAreaTitle>}
      <DataPanel>{children}</DataPanel>
    </section>
  );
}

FileSetChartSection.propTypes = {
  // Title above the chart panel
  title: PropTypes.string,
};

/**
 * Titles for the two charts on the home page. Used for the chart panel title and the chart aria
 * labels.
 */
const FILESET_RELEASE_TITLE = "Data Sets Released";
const FILESET_STATUS_TITLE = "Data Sets Produced by PanKbase Labs";

export default function Home({ fileSets, fileCount, sampleCount }) {
  const releaseData = convertFileSetsToReleaseData(fileSets);

  return (
    <div className="@container/home">
      <HomeTitle />
 	<p className="my-8">
	With the advent of single cell sequencing and multiplexed imaging technologies, several pancreas and islet phenotyping efforts in the United States and Europe are generating multimodal datasets, but information across different resources is fragmented. There is an unmet need in the pancreas and diabetes research community to connect and integrate information generated at the tissue and single cell level by complementary programs in order to define phenotypes and spatial relationships of pancreatic cell types and how they change developmentally and in diseases such as type 1 diabetes (T1D). Through aggregation and integration of diverse data generated from these unique pancreatic tissues and islets, we will build a pancreas knowledgebase (PanKbase) as the third pillar of the <a href="https://hirnetwork.org/" target="_blank">Human Islet Research Network (HIRN)</a> community along with the <a href="https://hirnetwork.org/coordinating_group/hirec" target="_blank">Human Islet Research Enhancement Center (HIREC)</a> and <a href="https://hpap.pmacs.upenn.edu" target="_blank">Human Pancreas Analysis Program (HPAP)</a>. The knowledge housed and built within PanKbase will be disseminated to the broader scientific community based on FAIR principles. Better access to and integration of these rich datasets will accelerate progress toward understanding T1D etiology and pathophysiology and lead to new diagnostic tool development, and transformative changes in diabetes prevention and care. Our project aspires to capitalize on features of the <a href="https://www.pancreatlas.org/" target="_blank">Pancreatlas</a> and <a href="https://gkb.dcmb.med.umich.edu/" target="_blank">GenomicKB</a> platform to build PanKbase that will connect and integrate pancreas and islet datasets generated through international tissue mapping efforts. In addition, PanKbase will have an analytics component that will enable the generation of new insights into molecular signatures of T1D and importantly facilitate cross-organ analysis (for example, pancreas and immune organs) for different stages of T1D development. We will make these insights openly accessible to all, including: basic scientists, pharmaceutical industry, clinicians designing and conducting clinical trials to prevent and treat T1D, and the machine learning community. PanKbase-fostered cross-disciplinary collaborations will promote innovation, with the ultimate aim of improving the lives of people with T1D.
       </p>
</body>  
      </p>
      <div className="my-4 @xl/home:flex @xl/home:gap-4">
        <Statistic
          graphic={<Icon.FileSet className="fill-sky-600" />}
          label="Data Sets (Measurement Sets)"
          value={fileSets.length}
          query="type=MeasurementSet"
          colorClass="bg-sky-100 dark:bg-sky-900 border-sky-600 hover:bg-sky-200 dark:hover:bg-sky-800"
        />
        <Statistic
          graphic={<DocumentTextIcon className="fill-teal-600" />}
          label="Files"
          value={fileCount}
          query="type=File"
          colorClass="bg-teal-200 dark:bg-teal-900 border-teal-600 hover:bg-teal-300 dark:hover:bg-teal-800"
        />
        <Statistic
          graphic={<Icon.Sample className="fill-yellow-600" />}
          label="Samples"
          value={sampleCount}
          query="type=Sample"
          colorClass="bg-yellow-100 dark:bg-yellow-900 border-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-800"
        />
      </div>
      {releaseData.length >= 2 && (
        <FileSetChartSection title={FILESET_RELEASE_TITLE}>
          <ChartFileSetRelease
            releaseData={releaseData}
            title={FILESET_RELEASE_TITLE}
          />
        </FileSetChartSection>
      )}
      {fileSets.length > 0 && (
        <FileSetChartSection title={FILESET_STATUS_TITLE}>
          <ChartFileSetLab fileSets={fileSets} title={FILESET_STATUS_TITLE} />
        </FileSetChartSection>
      )}
    </div>
  );
}

Home.propTypes = {
  // All measurement sets in the system
  fileSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Total number of files in the system
  fileCount: PropTypes.number,
  // Total number of samples in the system
  sampleCount: PropTypes.number,
};

export async function getServerSideProps({ req }) {
  const request = new FetchRequest({ cookie: req.headers.cookie });

  // We might need to paginate this request in the future, but for now just get all the results.
  const results = (
    await request.getObject(
      "/report/?type=MeasurementSet&field=%40id&field=preferred_assay_title&field=assay_term.term_name&field=files.@id&field=lab.title&field=status&field=creation_timestamp&field=release_timestamp&field=submitted_files_timestamp&status=released&status=archived&status=revoked&status=in+progress&limit=all"
    )
  ).union();

  if (FetchRequest.isResponseSuccess(results)) {
    const fileResults = (
      await request.getObject("/search/?type=File&limit=0")
    ).optional();
    const sampleResults = (
      await request.getObject("/search/?type=Sample&limit=0")
    ).optional();

    return {
      props: {
        fileSets: results["@graph"],
        fileCount: fileResults?.total || 0,
        sampleCount: sampleResults?.total || 0,
      },
    };
  }
  return errorObjectToProps(results);
}
