// node_modules
import PropTypes from "prop-types";
// components
import { formatCount } from "./landing-common";

/**
 * Statistics strip with exactly three live numbers. It stays three equal columns at every width,
 * including phones, so there's never an empty grid cell.
 */
export default function LandingStats({ stats }) {
  const cells = [
    { count: stats.donors, label: "donors" },
    { count: stats.measurementSets, label: "measurement sets" },
    { count: stats.analysisSets, label: "analysis sets" },
  ];

  return (
    <section aria-label="Library statistics">
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-pkb-line bg-pkb-line">
        {cells.map((cell) => (
          <li
            key={cell.label}
            className="bg-white px-[10px] py-[14px] md:px-[20px] md:py-[18px]"
          >
            <span className="block text-[22px] font-bold tabular-nums text-pkb md:text-[28px]">
              {formatCount(cell.count)}
            </span>
            <span className="block text-[13px] text-pkb-muted">
              {cell.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-[8px] flex items-center gap-[6px] text-[12px] text-pkb-muted">
        <span
          aria-hidden="true"
          className="inline-block h-[7px] w-[7px] rounded-full bg-[#1f8a4c]"
        />
        Live counts from the library
      </p>
    </section>
  );
}

LandingStats.propTypes = {
  stats: PropTypes.shape({
    donors: PropTypes.number.isRequired,
    measurementSets: PropTypes.number.isRequired,
    analysisSets: PropTypes.number.isRequired,
  }).isRequired,
};
