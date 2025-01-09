import React from 'react';
import Link from "next/link";
import PropTypes from "prop-types";
import SiteSearchTrigger from "../components/site-search-trigger";
import { Users, Flask, Microscope, Database, GitBranch, ChartBar } from "lucide-react";
import { abbreviateNumber } from "../lib/general";
import FetchRequest from "../lib/fetch-request";

function Statistic({ icon: Icon, label, value, query, description }) {
  return (
    <Link
      href={`/search/?${query}`}
      className="group block w-full"
    >
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
        <div className="flex items-start gap-4 p-6">
          <div className="rounded-lg bg-teal-50 p-3">
            <Icon className="h-6 w-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {label}
              <span className="ml-2 text-lg font-normal text-gray-600">
                ({abbreviateNumber(value)})
              </span>
            </h3>
            <p className="text-sm text-gray-600">
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

export default function Home({ assayCount, processedCount, analysisCount, donorCount, biosampleCount, workflowCount }) {
  return (
    <div className="@container/home">
      <p className="my-8">
        The Data Library enables query and browsing components of analysis resources created by PanKbase, including meta-data on human donors and biosamples, details on experimental assays, standardized processing of data (&apos;processed results&apos;), workflows used to process data and create resources, and the resources themselves (&apos;analysis results&apos;).
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
          query="type=Donor"
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
          label="Processed Results"
          value={processedCount}
          query="type=AnalysisSet&file_set_type=intermediate+analysis"
          description="Standardized processing of data generated from an assay"
        />
        <Statistic
          icon={ChartBar}
          label="Analysis Results"
          value={analysisCount}
          query="type=AnalysisSet&file_set_type=principal+analysis"
          description="Analyses of processed data such as integrated resources and downstream analysis"
        />
        <Statistic
          icon={GitBranch}
          label="Workflow"
          value={workflowCount}
          query="type=Workflow"
          description="Analysis workflows used to processed data and create resources"
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
