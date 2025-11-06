import React from "react";
import PropTypes from "prop-types";
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

function Package({ className }) {
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
      <path d="m21 16-8-7-8 7" />
      <path d="M21 16v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
      <path d="M3 16l8-7 8 7" />
      <path d="M12 9v13" />
    </svg>
  );
}

function Settings({ className }) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// PropTypes for SVG components
Users.propTypes = { className: PropTypes.string };
Flask.propTypes = { className: PropTypes.string };
Microscope.propTypes = { className: PropTypes.string };
ChartBar.propTypes = { className: PropTypes.string };
Package.propTypes = { className: PropTypes.string };
Settings.propTypes = { className: PropTypes.string };

// Data Access Card Component
function DataAccessCard({ icon, title, count, description, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg p-[25px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-t-4 border-[#219197]"
    >
      {typeof icon === "string" ? (
        <div className="text-4xl mb-4">{icon}</div>
      ) : (
        <div className="w-12 h-12 bg-gradient-to-br from-[#219197] to-[#1a7471] rounded-lg flex items-center justify-center text-white text-2xl mb-4">
          {icon}
        </div>
      )}
      <div className="text-lg font-semibold text-gray-900 mb-2.5">
        {title}
        {count && (
          <span className="ml-2 text-base font-semibold text-gray-600">
            ({count})
          </span>
        )}
      </div>
      <div className="text-[13px] text-gray-600 leading-relaxed">
        {description}
      </div>
    </a>
  );
}

DataAccessCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default function Browse({
  donorCount,
  biosampleCount,
  assayCount,
  processedCount,
  resourceAnalysisCount,
  analysisCount,
  workflowCount,
}) {
  const dataAccessCards = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Donor meta-data",
      count: abbreviateNumber(donorCount),
      description: "Human donors of a pancreatic biosample",
      url: "https://data.pankbase.org/search/?type=HumanDonor",
    },
    {
      icon: <Flask className="w-6 h-6" />,
      title: "Islet biosample meta-data",
      count: abbreviateNumber(biosampleCount),
      description: "Pancreatic biosamples obtained from a donor",
      url: "https://data.pankbase.org/search/?type=Biosample",
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Measurement Sets",
      count: abbreviateNumber(assayCount),
      description: "Experimental assays performed on a biosample",
      url: "https://data.pankbase.org/search/?type=MeasurementSet",
    },
    {
      icon: <ChartBar className="w-6 h-6" />,
      title: "Intermediate Analysis Results",
      count: abbreviateNumber(processedCount),
      description: "Standardized processing of data generated from an assay",
      url: "https://data.pankbase.org/search/?type=AnalysisSet&file_set_type=intermediate+analysis",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Resource Analysis",
      count: abbreviateNumber(resourceAnalysisCount),
      description:
        "Resource used to perform a principal analysis such as a donor x gene count matrix",
      url: "https://data.pankbase.org/search/?type=AnalysisSet&file_set_type=resource+analysis",
    },
    {
      icon: <ChartBar className="w-6 h-6" />,
      title: "Principal Analysis Results",
      count: abbreviateNumber(analysisCount),
      description:
        "End result of analyzing data such as differential expression or peak calls",
      url: "https://data.pankbase.org/search/?type=AnalysisSet&file_set_type=principal+analysis",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Workflows",
      count: abbreviateNumber(workflowCount),
      description: "Analysis workflows used to processed data and create resources",
      url: "https://data.pankbase.org/search/?type=Workflow",
    },
  ];

  return (
    <div className="@container/home max-w-[1400px] mx-auto px-10 py-10 bg-[#f5f5f5] min-h-screen">
      <section>
        <h2 className="text-[26px] font-semibold mb-6 pb-2.5 border-b-2 border-[#219197]">
          Browse Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
          {dataAccessCards.map((card, index) => (
            <DataAccessCard key={index} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}

Browse.propTypes = {
  donorCount: PropTypes.number.isRequired,
  biosampleCount: PropTypes.number.isRequired,
  assayCount: PropTypes.number.isRequired,
  processedCount: PropTypes.number.isRequired,
  resourceAnalysisCount: PropTypes.number.isRequired,
  analysisCount: PropTypes.number.isRequired,
  workflowCount: PropTypes.number.isRequired,
};

export async function getServerSideProps({ req }) {
  const request = new FetchRequest({ cookie: req?.headers?.cookie });

  const donorResults = (
    await request.getObject("/search/?type=HumanDonor&limit=0")
  ).optional();
  const biosampleResults = (
    await request.getObject("/search/?type=Biosample&limit=0")
  ).optional();
  const assayResults = (
    await request.getObject("/search/?type=MeasurementSet&limit=0")
  ).optional();
  const processedResults = (
    await request.getObject(
      "/search/?type=AnalysisSet&file_set_type=intermediate+analysis&limit=0"
    )
  ).optional();
  const resourceAnalysisResults = (
    await request.getObject(
      "/search/?type=AnalysisSet&file_set_type=resource+analysis&limit=0"
    )
  ).optional();
  const principalAnalysisResults = (
    await request.getObject(
      "/search/?type=AnalysisSet&file_set_type=principal+analysis&limit=0"
    )
  ).optional();
  const workflowResults = (
    await request.getObject("/search/?type=Workflow&limit=0")
  ).optional();

  return {
    props: {
      donorCount: donorResults?.total ?? 0,
      biosampleCount: biosampleResults?.total ?? 0,
      assayCount: assayResults?.total ?? 0,
      processedCount: processedResults?.total ?? 0,
      resourceAnalysisCount: resourceAnalysisResults?.total ?? 0,
      analysisCount: principalAnalysisResults?.total ?? 0,
      workflowCount: workflowResults?.total ?? 0,
    },
  };
}

