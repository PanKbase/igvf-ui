// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
// components
import ChartFileSetLab from "../components/chart-file-set-lab";
import ChartFileSetRelease from "../components/chart-file-set-release";
import { DataAreaTitle, DataPanel } from "../components/data-area";
import HomeTitle from "../components/home-title";
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
       PanKbase is a centralized resource of the human pancreas for diabetes research that will provide access to deeply curated high-quality datasets, knowledge in computable forms, and advanced data science tools and workflows; and enable open and reproducible multidisciplinary collaboration toward accelerating biomarker and therapeutic target development.
      </p>
      <div className="my-4 @xl/home:flex @xl/home:gap-4">
        <Statistic
          label="Processed Data"
          value={fileSets.length}
          query="type=AnalysisSet&file_set_type=intermediate+analysis"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
        />
        <Statistic
          label="Analysis Resources"
          value={fileCount}
          query="type=AnalysisSet&file_set_type=integrated+analysis"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
        />
        <Statistic
          label="Analysis Results"
          value={sampleCount}
          query="type=AnalysisSet&file_set_type=principal+analysis"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
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
