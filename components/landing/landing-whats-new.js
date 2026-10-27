// node_modules
import PropTypes from "prop-types";
// components
import {
  FOCUS_RING,
  SectionHeading,
  SmartLink,
  TEXT_LINK,
} from "./landing-common";
// lib
import { formatReleaseNoteDate, NEWS_URL } from "../../lib/whats-new";

/**
 * What's new: a compact strip of the newest release notes, one card each. Cards sit in a single
 * row from the md breakpoint up and stack below it. Renders nothing when there are no notes.
 */
export default function LandingWhatsNew({ notes }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="whats-new" className="flex flex-col gap-[12px]">
      <div className="flex items-end justify-between gap-[12px]">
        <SectionHeading id="whats-new" title="What's new" />
        <SmartLink href={NEWS_URL} className={`text-[14px] ${TEXT_LINK}`}>
          All updates →
        </SmartLink>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 md:grid-cols-3 md:gap-[16px]">
        {notes.map((note) => (
          <li
            key={`${note.date}-${note.title}`}
            className="min-w-0 rounded-[8px] border border-t-[3px] border-pkb-line border-t-pkb bg-white px-[16px] py-[12px]"
          >
            <time
              dateTime={note.date}
              className="block text-[12px] text-pkb-muted"
            >
              {formatReleaseNoteDate(note.date)}
            </time>
            <SmartLink
              href={note.href}
              className={`mt-[2px] block rounded-[2px] text-[15px] font-semibold leading-snug !text-pkb underline-offset-2 hover:!text-pkb-dark hover:underline ${FOCUS_RING}`}
            >
              {note.title}
            </SmartLink>
            <p className="mt-[4px] text-[13px] leading-snug text-pkb-body">
              {note.summary}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

LandingWhatsNew.propTypes = {
  // Release notes to show, already sorted and limited by `getNewestReleaseNotes()`
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
};
