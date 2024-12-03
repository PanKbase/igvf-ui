// node_modules
import PropTypes from "prop-types";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Nivo's ResponsiveBar to avoid SSR issues
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

/**
 * Diabetes statuses and their corresponding colors for the chart legend.
 */
const diabetesStatusColors = {
  "type 1 diabetes": "#ff6361",
  "type 2 diabetes": "#ffa600",
  "gestational diabetes": "#bc5090",
  "maturity onset diabetes of the young (MODY)": "#58508d",
  "monogenic diabetes": "#003f5c",
  "neonatal diabetes": "#7a5195",
  "wolfram syndrome": "#ef5675",
  "alström syndrome": "#ffa07a",
  "latent autoimmune diabetes in adults (LADA)": "#00876c",
  "type 3c diabetes": "#d45087",
  "steroid-induced diabetes": "#2f4b7c",
  "cystic fibrosis diabetes": "#00b2d2",
  "non-diabetic": "#59a14f",
  "diabetes unspecified": "#8c564b",
};

/**
 * Converts donor data into a format suitable for the Nivo bar chart.
 */
function convertDonorsToChartData(donors) {
  const chartData = [];
  const statusCounts = {};

  // Initialize counts for all statuses
  Object.keys(diabetesStatusColors).forEach((status) => {
    statusCounts[status] = 0;
  });

  donors.forEach((donor) => {
    const { lab, diabetes_status_description } = donor;
    let labEntry = chartData.find((entry) => entry.lab === lab.title);

    if (!labEntry) {
      labEntry = { lab: lab.title };
      Object.keys(diabetesStatusColors).forEach((status) => {
        labEntry[status] = 0;
      });
      chartData.push(labEntry);
    }

    if (diabetes_status_description in labEntry) {
      labEntry[diabetes_status_description] += 1;
      statusCounts[diabetes_status_description] += 1;
    }
  });

  return { chartData, statusCounts };
}

/**
 * Custom Y-axis tick component to display `lab.title`.
 */
function CustomYTick({ value, y }) {
  return (
    <g transform={`translate(40,${y})`}>
      <text
        x={-10}
        y={0}
        textAnchor="end"
        dominantBaseline="central"
        className="fill-black dark:fill-white"
        fontSize={12}
      >
        {value}
      </text>
    </g>
  );
}

CustomYTick.propTypes = {
  value: PropTypes.string.isRequired,
  y: PropTypes.number.isRequired,
};

/**
 * Chart legend displaying diabetes statuses and their colors.
 */
function Legend({ statusCounts }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(diabetesStatusColors).map(([status, color]) => {
        if (statusCounts[status] > 0) {
          return (
            <div key={status} className="flex items-center gap-1">
              <div
                style={{ backgroundColor: color }}
                className="h-3 w-5 rounded"
              />
              <span className="text-xs">{status}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

Legend.propTypes = {
  statusCounts: PropTypes.object.isRequired,
};

/**
 * Bar chart for visualizing "HumanDonor" by lab and diabetes status description.
 */
export default function ChartDonorLab({ donors, title }) {
  const { chartData, statusCounts } = convertDonorsToChartData(donors);

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={chartData}
        keys={Object.keys(diabetesStatusColors)}
        indexBy="lab"
        margin={{ top: 20, right: 130, bottom: 50, left: 150 }}
        padding={0.2}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        colors={({ id }) => diabetesStatusColors[id]}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          renderTick: CustomYTick,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="white"
        role="application"
        ariaLabel={title}
      />
      <div className="flex justify-between mt-4">
        <Legend statusCounts={statusCounts} />
      </div>
    </div>
  );
}

ChartDonorLab.propTypes = {
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      lab: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
      diabetes_status_description: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};
