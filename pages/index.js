// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
// components
import ChartFileSetLab from "../components/chart-file-set-lab";
import ChartFileSetRelease from "../components/chart-file-set-release";
import { DataAreaTitle, DataPanel } from "../components/data-area";
import HomeTitle from "../components/home-title";
import SiteSearchTrigger from "../components/site-search-trigger";
// import IdSearchTrigger from "../components/id-search-trigger";
// lib
import { errorObjectToProps } from "../lib/errors";
import FetchRequest from "../lib/fetch-request";
import { abbreviateNumber } from "../lib/general";
import { convertFileSetsToReleaseData } from "../lib/home";

/**
 * Display a statistic panel that shows a property and its count from the database.
 */
function Statistic({ graphic, label, value, query, colorClass }) {
  return (
    <div
      className={`my-4 grow basis-1/3 rounded border @xl/home:my-0 ${colorClass}`}
    >
      <Link
        href={`/search/?${query}`}
        className="flex h-full items-center gap-4 p-2 no-underline"
      >
        <div>{graphic}</div>
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
  graphic: PropTypes.element,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  colorClass: PropTypes.string,
};

/**
 * Display the chart section with a title.
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
  title: PropTypes.string,
};

/**
 * Titles for the charts on the homepage.
 */
const FILESET_RELEASE_TITLE = "Data Sets Released";
const FILESET_STATUS_TITLE = "Data Sets Produced by PanKbase Labs";

/**
 * The homepage for PanKbase.
 */
export default function Home({ assayCount, processedCount, fileSets, analysisCount, donorCount }) {
  const releaseData = convertFileSetsToReleaseData(fileSets);

  return (
    <div className="@container/home">
      <HomeTitle />
      <p className="my-8">
        PanKbase Data Library is a centralized resource of the human pancreas for diabetes
        research that provides access to deeply curated high-quality datasets,
        knowledge in computable forms, and advanced data science tools and
        workflows. It enables open and reproducible multidisciplinary
        collaboration to accelerate biomarker and therapeutic target
        development.
      </p>

      {/* Interactive Search */}
      <section className="my-8">
        <h2 className="text-center text-lg font-bold">Search Data</h2>
        <div className="flex flex-col gap-4">
          <SiteSearchTrigger isExpanded />
        </div>
      </section>

      {/* Statistics */}
      <div className="my-4 @xl/home:flex @xl/home:gap-4">
        <Statistic
          label="Donors"
          value={donorCount}
          query="type=Donor"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
        />
        <Statistic
          label="Assays"
          value={assayCount}
          query="type=MeasurementSet"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
        />
        <Statistic
          label="Processed Results"
          value={processedCount}
          query="type=AnalysisSet&file_set_type=intermediate+analysis"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
        />
        <Statistic
          label="Analysis Results"
          value={analysisCount}
          query="type=AnalysisSet&file_set_type=principal+analysis"
          colorClass="bg-transparent border-gray-200 hover:bg-gray-100"
        />
      </div>

      {/* File Set Charts */}
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
  fileSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  analysisCount: PropTypes.number,
  assayCount: PropTypes.number,
  processedCount: PropTypes.number,
  donorCount: PropTypes.number,
};

export async function getServerSideProps({ req }) {
  const request = new FetchRequest({ cookie: req.headers.cookie });

  const results = (
    await request.getObject(
      "/report/?type=MeasurementSet&field=%40id&field=preferred_assay_title&field=assay_term.term_name&field=files.@id&field=lab.title&field=status&field=creation_timestamp&field=release_timestamp&field=submitted_files_timestamp&status=released&status=archived&status=revoked&status=in+progress&limit=all"
    )
  ).union();

  if (FetchRequest.isResponseSuccess(results)) {
    const donorResults = (
      await request.getObject("/search/?type=Donor&limit=0")
    ).optional();
    const analysisResults = (
      await request.getObject("/search/?type=AnalysisSet&file_set_type=principal+analysis&limit=0")
    ).optional();
    const processedResults = (
      await request.getObject("/search/?type=AnalysisSet&file_set_type=intermediate+analysis&limit=0")
    ).optional();
    const assayResults = (
      await request.getObject("/search/?type=MeasurementSet&limit=0")
    ).optional();

    return {
      props: {
        fileSets: results["@graph"],
        analysisCount: analysisResults?.total || 0,
        processedCount: processedResults?.total || 0,
        assayCount: assayResults?.total || 0,
        donorCount: donorResults?.total || 0,
      },
    };
  }

  return errorObjectToProps(results);
}
