// node_modules
import PropTypes from "prop-types";

/**
 * Stroke paths, on a 24x24 grid, for the icons that identify assay and analysis tiles.
 */
const TILE_ICON_PATHS = {
  rna: "M4 4c4 0 4 8 8 8s4 8 8 8M4 20c4 0 4-8 8-8s4-8 8-8",
  perifusion: "M3 12h4l3-8 4 16 3-8h4",
  singleCell:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  atac: "M4 20V10m5 10V4m5 16v-7m5 7V8",
  chart: "M4 19V5m0 14h16M8 15l4-5 3 3 5-6",
  differential: "M7 4v16M7 4L4 7m3-3l3 3M17 20V4m0 16l-3-3m3 3l3-3",
};

/**
 * Decorative icon for a tile. Hidden from assistive technology because the tile's text names it.
 */
export function TileIcon({ name, className = "" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      <path d={TILE_ICON_PATHS[name] || TILE_ICON_PATHS.chart} />
    </svg>
  );
}

TileIcon.propTypes = {
  // Key of `TILE_ICON_PATHS`; unknown names draw the chart icon
  name: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Arrow pointing out of a box, marking a link that opens in a new tab.
 */
export function ExternalLinkIcon({ className = "" }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

ExternalLinkIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Arrow pointing down into a tray.
 */
export function DownloadIcon({ className = "" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      <path d="M12 4v12m-5-5l5 5 5-5M5 20h14" />
    </svg>
  );
}

DownloadIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Two overlapping sheets, for copy-to-clipboard buttons.
 */
export function CopyIcon({ className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

CopyIcon.propTypes = {
  className: PropTypes.string,
};

/**
 * Check mark, shown briefly after a successful copy.
 */
export function CheckIcon({ className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

CheckIcon.propTypes = {
  className: PropTypes.string,
};
