// node_modules
import PropTypes from "prop-types";
// components
import {
  FOCUS_RING,
  formatCount,
  SectionHeading,
  SmartLink,
  TEXT_LINK,
} from "./landing-common";
// lib
import { buildSearchHref } from "../../lib/landing";

const BROWSE_ALL_DONORS_HREF = buildSearchHref("HumanDonor");

/**
 * Find donors: a chip per diabetes condition, plus the Autoantibody+ filter, which overlaps the
 * conditions and so gets its own dashed pill under an "Overlapping filter" label. Each chip links
 * to a pre-filtered donor search.
 */
export default function LandingDonors({ conditionChips, autoantibodyChip }) {
  const maxCount = Math.max(...conditionChips.map((chip) => chip.count), 1);

  return (
    <section aria-labelledby="find-donors" className="flex flex-col gap-[16px]">
      <SectionHeading
        id="find-donors"
        title="Find donors"
        subtitle="Donors grouped by diabetes status"
      />
      <div className="flex flex-col gap-[20px] min-[700px]:flex-row min-[700px]:items-end">
        {conditionChips.length > 0 && (
          <ul
            aria-label="Condition"
            className="m-0 flex flex-1 list-none flex-wrap gap-[12px] p-0"
          >
            {conditionChips.map((chip) => (
              <li key={chip.label} className="flex min-w-[150px] flex-1">
                <SmartLink
                  href={chip.href}
                  className={`flex w-full flex-col gap-[8px] rounded-[8px] border-[1.5px] border-[#cdd2de] bg-white px-[16px] py-[12px] text-left !text-pkb-ink hover:!text-pkb-ink no-underline hover:border-pkb ${FOCUS_RING}`}
                >
                  <span className="text-[14px] font-semibold">
                    {chip.label}
                  </span>
                  <span className="text-[22px] font-bold tabular-nums">
                    {formatCount(chip.count)}
                    <span className="sr-only"> donors</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-[4px] rounded-[2px] bg-pkb-line-soft"
                  >
                    <span
                      className="block h-[4px] min-w-[3px] rounded-[2px] bg-pkb"
                      style={{ width: `${(chip.count / maxCount) * 100}%` }}
                    />
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        )}
        {autoantibodyChip && (
          <div
            className={`flex flex-col gap-[6px] ${
              conditionChips.length > 0
                ? "border-t border-pkb-line pt-[16px] min-[700px]:border-l min-[700px]:border-t-0 min-[700px]:border-[#cdd2de] min-[700px]:pl-[20px] min-[700px]:pt-0"
                : ""
            }`}
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-pkb-muted">
              Overlapping filter
            </span>
            <SmartLink
              href={autoantibodyChip.href}
              className={`flex items-center justify-between gap-[16px] rounded-full border-[1.5px] border-dashed border-[#6b7390] bg-white px-[16px] py-[12px] text-[14px] font-semibold !text-pkb-ink hover:!text-pkb-ink no-underline hover:border-pkb ${FOCUS_RING}`}
            >
              <span>{autoantibodyChip.label}</span>
              <span className="text-[18px] font-bold tabular-nums">
                {formatCount(autoantibodyChip.count)}
                <span className="sr-only"> donors</span>
              </span>
            </SmartLink>
            <span className="text-[12px] text-pkb-muted">
              Spans the condition groups
            </span>
          </div>
        )}
      </div>
      <SmartLink
        href={BROWSE_ALL_DONORS_HREF}
        className={`self-start text-[14px] ${TEXT_LINK}`}
      >
        Browse all donors →
      </SmartLink>
    </section>
  );
}

const chipPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  href: PropTypes.string.isRequired,
});

LandingDonors.propTypes = {
  conditionChips: PropTypes.arrayOf(chipPropType).isRequired,
  autoantibodyChip: chipPropType,
};
