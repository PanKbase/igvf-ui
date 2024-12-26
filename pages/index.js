// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
// components
import HomeTitle from "../components/home-title";
import SiteSearchTrigger from "../components/site-search-trigger";
// lib
import FetchRequest from "../lib/fetch-request";
import { abbreviateNumber } from "../lib/general";

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
 * The homepage for PanKbase.
 */
export default function Home({ assayCount, processedCount, analysisCount, donorCount }) {
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
    </div>
  );
}

Home.propTypes = {
  analysisCount: PropTypes.number,
  assayCount: PropTypes.number,
  processedCount: PropTypes.number,
  donorCount: PropTypes.number,
};

export async function getServerSideProps({ req }) {
  const request = new FetchRequest({ cookie: req.headers.cookie });

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
      analysisCount: analysisResults?.total || 0,
      processedCount: processedResults?.total || 0,
      assayCount: assayResults?.total || 0,
      donorCount: donorResults?.total || 0,
    },
  };
}
