// node_modules
import PropTypes from "prop-types";
// components
import { FOCUS_RING, formatCount, SmartLink } from "./landing-common";
// lib
import { buildSearchHref } from "../../lib/landing";

/**
 * Statistics strip with exactly three live numbers, each linking to its pre-filtered search. It stays three equal columns at every width,
 * including phones, so there's never an empty grid cell.
 */
export default function LandingStats({ stats }) {
  const cells = [
    {
      count: stats.donors,
      label: "donors",
      href: buildSearchHref("HumanDonor"),
    },
    {
      count: stats.measurementSets,
      label: "measurement sets",
      href: buildSearchHref("MeasurementSet"),
    },
    {
      count: stats.analysisSets,
      label: "analysis sets",
      href: buildSearchHref("AnalysisSet"),
    },
  ];

  return (
    <section aria-label="Library statistics">
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-pkb-line bg-pkb-line">
        {cells.map((cell) => (
          <li key={cell.label} className="flex">
            <SmartLink
              href={cell.href}
              className={`group block w-full bg-white px-[10px] py-[14px] !text-pkb-ink no-underline transition-colors hover:bg-pkb-tint hover:!text-pkb-ink md:px-[20px] md:py-[18px] focus-visible:!outline-offset-[-3px] ${FOCUS_RING}`}
            >
              <span className="block text-[22px] font-bold tabular-nums text-pkb group-hover:text-pkb-dark md:text-[28px]">
                {formatCount(cell.count)}
              </span>
              <span className="block text-[13px] text-pkb-muted group-hover:text-pkb-body group-hover:underline">
                {cell.label}
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
      <p className="mt-[8px] flex items-center gap-[6px] text-[13px] text-pkb-muted">
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
