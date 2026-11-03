// node_modules
import PropTypes from "prop-types";
// components
import {
  FOCUS_RING,
  SectionHeading,
  SmartLink,
  TEXT_LINK,
} from "./landing-common";
import { DownloadIcon } from "./landing-icons";
// lib
import { buildSearchHref } from "../../lib/landing";

const VIEW_ALL_HREF = `${buildSearchHref("AnalysisSet")}&sort=-release_timestamp`;

/**
 * Column layout shared by the header and the rows. Below the md breakpoint the header hides and
 * each row stacks into one column.
 */
const ROW_GRID =
  "grid grid-cols-1 gap-[4px] md:grid-cols-[2.4fr_1.8fr_1fr_130px] md:gap-[16px]";

/**
 * Recently updated: the newest released analysis set of each annotation type, newest first. A
 * row's Download button goes straight to the set's file when it has exactly one; otherwise it
 * goes to the object page, where the files are listed.
 */
export default function LandingRecent({ rows }) {
  return (
    <section
      aria-labelledby="recently-updated"
      className="flex flex-col gap-[16px]"
    >
      <div className="flex items-end justify-between gap-[12px]">
        <SectionHeading
          id="recently-updated"
          title="Recently updated"
          subtitle="Newest analysis sets, one per type"
        />
        <SmartLink href={VIEW_ALL_HREF} className={`text-[14px] ${TEXT_LINK}`}>
          View all →
        </SmartLink>
      </div>
      <div
        role="table"
        aria-labelledby="recently-updated"
        className="overflow-hidden rounded-[8px] border border-pkb-line bg-white"
      >
        <div role="rowgroup" className="hidden md:block">
          <div
            role="row"
            className={`${ROW_GRID} bg-pkb-head px-[20px] py-[12px] text-[12px] font-bold uppercase tracking-[0.05em] text-pkb-body`}
          >
            <span role="columnheader">Name</span>
            <span role="columnheader">Category</span>
            <span role="columnheader">Released</span>
            <span role="columnheader">Download</span>
          </div>
        </div>
        <div role="rowgroup">
          {rows.map((row) => (
            <div
              key={row.accession}
              role="row"
              className={`${ROW_GRID} items-center border-t border-pkb-line-soft px-[20px] py-[14px] text-[14px] first:border-t-0 hover:bg-[#f1f9f9] md:first:border-t`}
            >
              <span role="cell" className="min-w-0">
                <SmartLink
                  href={row.path}
                  className={`rounded-[2px] font-semibold !text-pkb underline-offset-2 hover:!text-pkb-dark hover:underline ${FOCUS_RING}`}
                >
                  {row.name}
                </SmartLink>
                <span className="block text-[12px] text-pkb-muted">
                  {row.accession}
                </span>
              </span>
              <span role="cell">{row.category}</span>
              <span role="cell" className="text-pkb-muted">
                <span className="md:hidden">Released </span>
                <time dateTime={row.released}>{row.releasedLabel}</time>
              </span>
              <span role="cell" className="mt-[6px] md:mt-0">
                <a
                  href={row.downloadHref}
                  aria-label={
                    row.isDirectDownload
                      ? `Download ${row.name}`
                      : `Download files for ${row.name} (opens the object page)`
                  }
                  className={`inline-flex items-center gap-[6px] whitespace-nowrap rounded-[6px] border-[1.5px] border-pkb px-[12px] py-[6px] text-[13px] font-bold !text-pkb no-underline hover:bg-pkb-tint hover:!text-pkb ${FOCUS_RING}`}
                >
                  Download
                  <DownloadIcon />
                </a>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

LandingRecent.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      accession: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      released: PropTypes.string.isRequired,
      releasedLabel: PropTypes.string.isRequired,
      downloadHref: PropTypes.string.isRequired,
      isDirectDownload: PropTypes.bool.isRequired,
    })
  ).isRequired,
};
