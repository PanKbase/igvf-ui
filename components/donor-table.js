// node_modules
import { TableCellsIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
// components
import { DataAreaTitle, DataAreaTitleLink } from "./data-area";
import LinkedIdAndStatus from "./linked-id-and-status";
import SortableGrid from "./sortable-grid";

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
    id: "gender",
    title: "Gender",
  },
  {
    id: "taxa",
    title: "Taxa",
  },
];

/**
 * Display the given donors in a table.
 */
export default function DonorTable({ donors, title = "Donors", reportLink = null }) {
  return (
    <>
      <DataAreaTitle>
        {title}
        {reportLink && (
          <DataAreaTitleLink
            href={reportLink}
            label="Report view of donors"
          >
            <span className="flex items-center gap-1">
              <TableCellsIcon className="h-4 w-4" />
              Report view
            </span>
          </DataAreaTitleLink>
        )}
      </DataAreaTitle>
      <SortableGrid data={donors} columns={columns} pager={{}} keyProp="@id" />
    </>
  );
}

DonorTable.propTypes = {
  // Donors to display in the table
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Optional title to display if not "Donors"
  title: PropTypes.string,
  // Link to the report page containing the same donors as this table
  reportLink: PropTypes.string,
};
