// node_modules
import Link from "next/link";
import PropTypes from "prop-types";

/**
 * Paths of the two landing pages. When the redesigned landing page replaces the home page, change
 * these in one place.
 */
export const LANDING_PATH = "/test-homepage/";
export const FEATURED_PATH = "/test-homepage/featured/";

/**
 * Visible focus indicator shared by every interactive element on the landing pages. The dark teal
 * outline has at least 7:1 contrast against the white and tinted backgrounds.
 */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-pkb-dark";

/**
 * Classes for a text link in the landing page body. Link colors use Tailwind's `!` modifier, for
 * the base and hover states, because styles/globals.css sets `a { color: ... !important }` and
 * `a:hover { color: ... !important }`; only another `!important` rule with higher specificity wins.
 */
export const TEXT_LINK = `font-semibold !text-pkb underline-offset-2 hover:!text-pkb-dark hover:underline ${FOCUS_RING} rounded-[2px]`;

/**
 * Classes for the h2 of each landing page section.
 */
export const SECTION_TITLE = "text-[24px] font-bold text-pkb-ink";

/**
 * Format a count with thousands separators. The locale is fixed so the server and browser render
 * the same text.
 * @param {number} count Number to format
 * @returns {string} Formatted number, e.g. "3,739"
 */
export function formatCount(count) {
  return count.toLocaleString("en-US");
}

/**
 * Link to either a page in this app, using client-side navigation, or an external URL. Paths
 * beginning with a single slash count as internal.
 */
export function SmartLink({ href, children, ...props }) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

SmartLink.propTypes = {
  // Path or URL to link to
  href: PropTypes.string.isRequired,
};

/**
 * Heading block for a landing page section: an h2 with a muted line below it.
 */
export function SectionHeading({ id, title, subtitle = "" }) {
  return (
    <div>
      <h2 id={id} className={SECTION_TITLE}>
        {title}
      </h2>
      {subtitle && <p className="text-[14px] text-pkb-muted">{subtitle}</p>}
    </div>
  );
}

SectionHeading.propTypes = {
  // id of the h2, for labeling its section
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
