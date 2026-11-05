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
 * The one tile style for both the assay and the analysis rows: a small icon and the label, with
 * the count beside them when the tile is wide enough (a container query, so it adapts to the
 * column width, not the window) and below them when it isn't, under a thin teal top border.
 * `noun` names what the count counts, for screen readers.
 */
function Tile({ tile, noun }) {
  return (
    <li className="@container flex">
      <SmartLink
        href={tile.href}
        className={`flex w-full min-w-0 flex-col items-start justify-between gap-x-[12px] gap-y-[6px] rounded-[6px] border border-t-[3px] border-pkb-line border-t-pkb bg-white px-[16px] py-[14px] !text-pkb-ink hover:!text-pkb-ink no-underline transition-all hover:-translate-y-0.5 hover:bg-pkb-tint hover:shadow-[0_8px_20px_rgba(11,122,130,.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 @[230px]:flex-row @[230px]:items-center ${FOCUS_RING}`}
      >
        <span className="flex min-w-0 max-w-full items-center gap-[10px]">
          <TileIcon name={tile.icon} size={18} className="text-pkb" />
          <span className="min-w-0 break-words text-[15px] font-semibold [overflow-wrap:anywhere]">
            {tile.label}
          </span>
        </span>
        <span className="shrink-0 text-[22px] font-bold tabular-nums text-pkb-dark">
          {formatCount(tile.count)}
          <span className="sr-only"> {noun}</span>
        </span>
      </SmartLink>
    </li>
  );
}

Tile.propTypes = {
  tile: PropTypes.shape({
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  noun: PropTypes.string.isRequired,
};

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
          <Tile key={tile.label} tile={tile} noun="measurement sets" />
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
          <Tile key={tile.label} tile={tile} noun="analysis sets" />
        ))}
      </ul>
    </section>
  );
}

AnalysisTiles.propTypes = {
  tiles: tilePropType,
};
