// node_modules
import PropTypes from "prop-types";
// components
import {
  FOCUS_RING,
  formatCount,
  SectionHeading,
  SmartLink,
} from "./landing-common";
import { TileIcon } from "./landing-icons";

const tilePropType = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
  })
).isRequired;

const TILE_GRID =
  "grid grid-cols-2 gap-[16px] min-[1000px]:grid-cols-4 list-none p-0 m-0";

/**
 * Browse by assay: one tile per MeasurementSet assay, each linking to a pre-filtered search.
 */
export function AssayTiles({ tiles }) {
  return (
    <section
      aria-labelledby="browse-by-assay"
      className="flex flex-col gap-[16px]"
    >
      <SectionHeading
        id="browse-by-assay"
        title="Browse by assay"
        subtitle="Measurement sets grouped by experimental assay"
      />
      <ul className={TILE_GRID}>
        {tiles.map((tile) => (
          <li key={tile.label} className="flex">
            <SmartLink
              href={tile.href}
              className={`flex w-full min-w-0 flex-col gap-[14px] rounded-[6px] border border-l-4 border-pkb-line border-l-pkb bg-white p-[18px] !text-pkb-ink hover:!text-pkb-ink no-underline shadow-[0_1px_3px_rgba(27,35,64,.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(11,122,130,.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-pkb text-white">
                <TileIcon name={tile.icon} />
              </span>
              <span>
                <span className="block text-[15px] font-semibold">
                  {tile.label}
                </span>
                <span className="mt-[2px] block text-[28px] font-bold tabular-nums">
                  {formatCount(tile.count)}
                  <span className="sr-only"> measurement sets</span>
                </span>
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

AssayTiles.propTypes = {
  tiles: tilePropType,
};

/**
 * Browse by analysis: one tile per AnalysisSet category, each linking to a pre-filtered search.
 */
export function AnalysisTiles({ tiles }) {
  return (
    <section
      aria-labelledby="browse-by-analysis"
      className="flex flex-col gap-[16px]"
    >
      <SectionHeading
        id="browse-by-analysis"
        title="Browse by analysis"
        subtitle="Processed results"
      />
      <ul className={TILE_GRID}>
        {tiles.map((tile) => (
          <li key={tile.label} className="flex">
            <SmartLink
              href={tile.href}
              className={`flex w-full min-w-0 flex-col items-start justify-between gap-x-[12px] gap-y-[8px] rounded-[6px] border border-t-4 border-pkb-tint-border border-t-pkb bg-pkb-tint p-[18px] !text-pkb-ink hover:!text-pkb-ink no-underline transition-all hover:-translate-y-0.5 hover:bg-pkb-tint-hover hover:shadow-[0_8px_20px_rgba(11,122,130,.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 min-[700px]:flex-row min-[700px]:items-center ${FOCUS_RING}`}
            >
              <span className="flex min-w-0 max-w-full items-center gap-[12px]">
                <TileIcon name={tile.icon} className="text-pkb" />
                <span className="min-w-0 break-words text-[15px] font-semibold [overflow-wrap:anywhere]">
                  {tile.label}
                </span>
              </span>
              <span className="shrink-0 text-[22px] font-bold tabular-nums text-pkb-dark">
                {formatCount(tile.count)}
                <span className="sr-only"> analysis sets</span>
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

AnalysisTiles.propTypes = {
  tiles: tilePropType,
};
