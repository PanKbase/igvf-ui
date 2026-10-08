// node_modules
import PropTypes from "prop-types";
// components
import { DataAreaTitle } from "./data-area";
import LinkedIdAndStatus from "./linked-id-and-status";
import SortableGrid from "./sortable-grid";

function yesNo(value) {
  if (value === undefined || value === null) {
    return "";
  }
  return value ? "Yes" : "No";
}

const columns = [
  {
    id: "accession",
    title: "Accession",
    display: ({ source }) => (
      <LinkedIdAndStatus item={source}>{source.accession}</LinkedIdAndStatus>
    ),
    sorter: (item) => item.accession,
  },
  {
    id: "age",
    title: "Age",
    display: ({ source }) => {
      if (source.age === undefined || source.age === null) {
        return source.age_group || "";
      }
      return source.age_group
        ? `${source.age} (${source.age_group})`
        : String(source.age);
    },
    sorter: (item) => item.age ?? item.age_group ?? "",
  },
  {
    id: "gender",
    title: "Sex",
  },
  {
    id: "diabetes_status_description",
    title: "Diabetes Status",
  },
  {
    id: "bmi",
    title: "BMI",
  },
  {
    id: "hba1c",
    title: "HbA1c",
  },
  {
    id: "aab_positive",
    title: "AAB+",
    display: ({ source }) => yesNo(source.aab_positive),
    sorter: (item) =>
      item.aab_positive === true ? 1 : item.aab_positive === false ? 0 : -1,
  },
  {
    id: "aab_count",
    title: "AAB Count",
  },
  {
    id: "taxa",
    title: "Taxa",
  },
];

/**
 * Display the given donors in a table.
 * Includes A1 embedded clinical fields when present on biosample donor embeds.
 */
export default function DonorTable({ donors, title = "Donors" }) {
  return (
    <>
      <DataAreaTitle>{title}</DataAreaTitle>
      <SortableGrid data={donors} columns={columns} pager={{}} keyProp="@id" />
    </>
  );
}

DonorTable.propTypes = {
  // Donors to display in the table
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Optional title to display if not "Donors"
  title: PropTypes.string,
};
