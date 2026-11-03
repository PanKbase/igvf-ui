// node_modules
import PropTypes from "prop-types";
// components
import { FOCUS_RING, SmartLink } from "./landing-common";
import { ExternalLinkIcon } from "./landing-icons";

/**
 * Buttons share a row and split it into equal widths. `whitespace-nowrap` keeps a label on one
 * line, and the small side padding leaves a label room even in the narrowest column.
 */
const BUTTON_BASE = `inline-flex h-[40px] min-w-0 items-center justify-center gap-[4px] whitespace-nowrap rounded-[6px] border-[1.5px] border-pkb px-[8px] text-[13px] font-bold no-underline ${FOCUS_RING}`;
const BUTTON_FILLED = `${BUTTON_BASE} bg-pkb !text-white hover:!text-white hover:bg-pkb-dark`;
const BUTTON_OUTLINE = `${BUTTON_BASE} bg-white !text-pkb hover:!text-pkb hover:bg-pkb-tint`;

/**
 * Grid classes for the button row, by how many buttons a card has. The row measures the card (a
 * container query), not the window. Three buttons share one row once there's room for them side by
 * side; in a narrower card, Download goes full width above a row with the other two, so no button
 * ever wraps on its own. Fewer buttons always split the row equally.
 */
const ROW_BY_COUNT = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 @[300px]:grid-cols-3",
};

/** Download spans both columns of the narrow three-button layout, and one column of the wide one. */
const DOWNLOAD_SPAN_WHEN_THREE = "col-span-2 @[300px]:col-span-1";

/**
 * One featured dataset. It renders only the buttons the dataset has links for, in the order
 * Download, Details, Visualize, with no hidden placeholders for the missing ones. The labels are
 * always exactly those words; the file format and the tool name go nowhere on the buttons.
 * Visualize opens its external tool in a new tab and names the tool in its tooltip and
 * `aria-label`.
 */
export default function FeaturedCard({ dataset }) {
  const buttonCount = [
    dataset.downloadUrl,
    dataset.detailsUrl,
    dataset.visualizeUrl,
  ].filter(Boolean).length;
  const downloadClasses =
    buttonCount === 3
      ? `${BUTTON_FILLED} ${DOWNLOAD_SPAN_WHEN_THREE}`
      : BUTTON_FILLED;

  return (
    <article
      data-testid="featured-card"
      className="flex h-full w-full flex-col gap-[10px] rounded-[10px] border border-pkb-line bg-white p-[16px] text-pkb-ink shadow-[0_1px_3px_rgba(27,35,64,.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(11,111,134,.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-pkb">
        {dataset.category}
      </p>
      <h3 className="text-[18px] font-bold leading-tight">{dataset.title}</h3>
      <p className="flex-1 text-[14px] text-pkb-body">{dataset.description}</p>
      {buttonCount > 0 && (
        <div className="@container border-t border-pkb-line-soft pt-[12px]">
          <div
            data-testid="featured-buttons"
            className={`grid gap-[8px] ${ROW_BY_COUNT[buttonCount]}`}
          >
            {dataset.downloadUrl && (
              <a
                href={dataset.downloadUrl}
                aria-label={`Download ${dataset.title}`}
                className={downloadClasses}
              >
                Download
              </a>
            )}
            {dataset.detailsUrl && (
              <SmartLink
                href={dataset.detailsUrl}
                aria-label={`Details for ${dataset.title}`}
                className={BUTTON_OUTLINE}
              >
                Details
              </SmartLink>
            )}
            {dataset.visualizeUrl && (
              <a
                href={dataset.visualizeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visualize in ${dataset.visualizeTool}`}
                aria-label={`Visualize in ${dataset.visualizeTool}`}
                className={BUTTON_OUTLINE}
              >
                Visualize
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

FeaturedCard.propTypes = {
  dataset: PropTypes.shape({
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    downloadUrl: PropTypes.string,
    detailsUrl: PropTypes.string,
    visualizeUrl: PropTypes.string,
    visualizeTool: PropTypes.string,
  }).isRequired,
};

/**
 * Grid of featured cards: one column on phones, two on tablets, four on desktops. The landing page
 * and the Featured datasets page both use this, each passing its own slice of the shared config.
 */
export function FeaturedGrid({ datasets }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 min-[700px]:grid-cols-2 min-[1200px]:grid-cols-4">
      {datasets.map((dataset) => (
        <li key={dataset.id} className="flex">
          <FeaturedCard dataset={dataset} />
        </li>
      ))}
    </ul>
  );
}

FeaturedGrid.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};
