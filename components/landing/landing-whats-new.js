// node_modules
import PropTypes from "prop-types";
// components
import { FOCUS_RING, SectionHeading, SmartLink } from "./landing-common";
// lib
import { formatReleaseNoteDate } from "../../lib/whats-new";

/**
 * What's new: a compact strip of the newest release notes. Each card is one link to the notes'
 * `href`, opening in the same tab. Cards sit in a single row from the md breakpoint up and stack
 * below it. Renders nothing when there are no notes.
 */
export default function LandingWhatsNew({ notes }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="whats-new" className="flex flex-col gap-[12px]">
      <SectionHeading id="whats-new" title="What's new" />
      <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 md:grid-cols-3 md:gap-[16px]">
        {notes.map((note) => (
          <li key={`${note.date}-${note.title}`} className="flex min-w-0">
            <SmartLink
              href={note.href}
              className={`group block w-full min-w-0 rounded-[8px] border border-t-[3px] border-pkb-line border-t-pkb bg-white px-[16px] py-[12px] !text-pkb-ink no-underline hover:!text-pkb-ink ${FOCUS_RING}`}
            >
              <time
                dateTime={note.date}
                className="block text-[12px] text-pkb-muted"
              >
                {formatReleaseNoteDate(note.date)}
              </time>
              <span className="mt-[2px] block text-[15px] font-semibold leading-snug text-pkb underline-offset-2 group-hover:text-pkb-dark group-hover:underline">
                {note.title}
              </span>
              <span className="mt-[4px] block text-[13px] leading-snug text-pkb-body">
                {note.summary}
              </span>
            </SmartLink>
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
