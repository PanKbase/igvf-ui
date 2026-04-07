// node_modules
import PropTypes from "prop-types";
// components
import LinkedIdAndStatus from "./linked-id-and-status";
import SortableGrid from "./sortable-grid";
import { DashboardSectionTitle } from "./clinical-dashboard-primitives";
function formatDuration(treatment) {
  if (treatment.duration === undefined || treatment.duration === null) {
    return "—";
  }
  const u = treatment.duration_units || "";
  const plural = treatment.duration === 1 ? "" : "s";
  return `${treatment.duration} ${u}${plural}`.trim();
}

function formatConcentration(treatment) {
  if (treatment.amount === undefined || treatment.amount === null) {
    return "—";
  }
  const u = treatment.amount_units ? ` ${treatment.amount_units}` : "";
  return `${treatment.amount}${u}`.trim();
}

const dashboardTreatmentColumns = [
  {
    id: "treatment",
    title: "Treatment",
    display: ({ source }) => (
      <LinkedIdAndStatus item={source}>
        {source.treatment_term_name || source.summary || source["@id"]}
      </LinkedIdAndStatus>
    ),
    sorter: (item) =>
      (item.treatment_term_name || item.summary || "").toLowerCase(),
  },
  {
    id: "duration",
    title: "Duration",
    display: ({ source }) => formatDuration(source),
    sorter: (item) => Number(item.duration) || 0,
  },
  {
    id: "concentration",
    title: "Concentration",
    display: ({ source }) => formatConcentration(source),
    isSortable: false,
  },
];

/**
 * Named "Treatments" section for biosample clinical dashboards (heading + grid only).
 */
export default function BiosampleTreatmentsSection({ treatments = [] }) {
  if (!treatments?.length) {
    return null;
  }
  return (
    <section>
      <DashboardSectionTitle>Treatments</DashboardSectionTitle>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <SortableGrid
          data={treatments}
          columns={dashboardTreatmentColumns}
          pager={{}}
          keyProp="@id"
        />
      </div>
    </section>
  );
}

BiosampleTreatmentsSection.propTypes = {
  treatments: PropTypes.arrayOf(PropTypes.object),
};

BiosampleTreatmentsSection.defaultProps = {
  treatments: [],
};
