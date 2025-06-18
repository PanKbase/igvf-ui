import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import SiteSearchTrigger from "../components/site-search-trigger";
import { abbreviateNumber } from "../lib/general";
import FetchRequest from "../lib/fetch-request";

// SVG Icon Components
function Users({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Flask({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 3h6" />
      <path d="M10 9h4" />
      <path d="M20 21H4a2 2 0 0 1-2-2V9c0-.6.4-1 1-1h18c.6 0 1 .4 1 1v10a2 2 0 0 1-2 2Z" />
      <path d="M6.1 15h11.8" />
    </svg>
  );
}

function Microscope({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M8 6h4" />
      <path d="M10 6a2 2 0 1 0 0-4" />
    </svg>
  );
}

function Database({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function GitBranch({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function ChartBar({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

// New icon components for additional cards
function FileText({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function Code({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  );
}

function BookOpen({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// PropTypes for SVG components
Users.propTypes = { className: PropTypes.string };
Flask.propTypes = { className: PropTypes.string };
Microscope.propTypes = { className: PropTypes.string };
Database.propTypes = { className: PropTypes.string };
GitBranch.propTypes = { className: PropTypes.string };
ChartBar.propTypes = { className: PropTypes.string };
FileText.propTypes = { className: PropTypes.string };
Code.propTypes = { className: PropTypes.string };
BookOpen.propTypes = { className: PropTypes.string };

function Statistic({ icon: Icon, label, value, query, description }) {
  return (
    <Link href={`/search/?${query}`} className="group block w-full">
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start gap-4 p-6">
          <div className="rounded-lg bg-teal-50 p-3 dark:bg-teal-900/30">
            <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {label}
              <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-400">
                ({abbreviateNumber(value)})
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

Statistic.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// New component for external link cards
function ExternalLinkCard({ icon: Icon, label, href, description }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full"
    >
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start gap-4 p-6">
          <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(11, 181, 223, 0.1)' }}>
            <Icon className="h-6 w-6" style={{ color: '#0bb5df' }} />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

ExternalLinkCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default function Home({
  assayCount,
  processedCount,
  analysisCount,
  donorCount,
  biosampleCount,
  workflowCount,
}) {
  return (
    <div className="@container/home">
      <p className="my-8">
        The Data Library enables query and browsing components of analysis
        resources created by PanKbase, including meta-data on human donors and
        biosamples, details on experimental assays, standardized processing of
        data (&apos;processed results&apos;), workflows used to process data and
        create resources, and the resources themselves (&apos;analysis
        results&apos;).
      </p>
      <section className="my-8">
        <h2 className="text-center text-lg font-bold">Search Data</h2>
        <div className="flex flex-col gap-4">
          <SiteSearchTrigger isExpanded />
        </div>
      </section>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Statistic
          icon={Users}
          label="Donors"
          value={donorCount}
          query="type=HumanDonor"
          description="Human donors of a pancreatic biosample"
        />
        <Statistic
          icon={Flask}
          label="Biosamples"
          value={biosampleCount}
          query="type=Biosample"
          description="Pancreatic biosamples obtained from a donor"
        />
        <Statistic
          icon={Microscope}
          label="Assays"
          value={assayCount}
          query="type=MeasurementSet"
          description="Experimental assays performed on a biosample"
        />
        <Statistic
          icon={Database}
          label="Intermediate Analysis Results"
          value={processedCount}
          query="type=AnalysisSet&file_set_type=intermediate+analysis"
          description="Standardized processing of data generated from an assay"
        />
        <Statistic
          icon={ChartBar}
          label="Principal Analysis Results"
          value={analysisCount}
          query="type=AnalysisSet&file_set_type=principal+analysis"
          description="Analyses of processed data such as integrated resources and downstream analysis"
        />
        <Statistic
          icon={GitBranch}
          label="Workflows"
          value={workflowCount}
          query="type=Workflow"
          description="Analysis workflows used to processed data and create resources"
        />
      </div>

      {/* Separation line */}
      <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

      {/* Additional resource cards */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <ExternalLinkCard
          icon={FileText}
          label="Schema"
          href="https://data.pankbase.org/profiles"
          description="Data schema and metadata profiles used in PanKbase"
        />
        <ExternalLinkCard
          icon={Code}
          label="Scripts"
          href="https://github.com/PanKbase/PanKbase-data-library-scripts"
          description="Data exploration scripts and tools for PanKbase analysis"
        />
        <ExternalLinkCard
          icon={BookOpen}
          label="User Guide"
          href="https://data.pankbase.org/help/general-help/user-guide"
          description="Comprehensive guide for using the PanKbase Data Library"
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
  workflowCount: PropTypes.number,
  biosampleCount: PropTypes.number,
};

export async function getServerSideProps({ req }) {
  const request = new FetchRequest({ cookie: req.headers.cookie });

  const donorResults = (
    await request.getObject("/search/?type=HumanDonor&limit=0")
  ).optional();
  const analysisResults = (
    await request.getObject(
      "/search/?type=AnalysisSet&file_set_type=principal+analysis&limit=0"
    )
  ).optional();
  const processedResults = (
    await request.getObject(
      "/search/?type=AnalysisSet&file_set_type=intermediate+analysis&limit=0"
    )
  ).optional();
  const assayResults = (
    await request.getObject("/search/?type=MeasurementSet&limit=0")
  ).optional();
  const biosampleResults = (
    await request.getObject("/search/?type=Biosample&limit=0")
  ).optional();
  const workflowResults = (
    await request.getObject("/search/?type=Workflow&limit=0")
  ).optional();

  return {
    props: {
      analysisCount: analysisResults?.total || 0,
      processedCount: processedResults?.total || 0,
      assayCount: assayResults?.total || 0,
      donorCount: donorResults?.total || 0,
      biosampleCount: biosampleResults?.total || 0,
      workflowCount: workflowResults?.total || 0,
    },
  };
}
