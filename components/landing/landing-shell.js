// node_modules
import Head from "next/head";
import PropTypes from "prop-types";
// components
import { FOCUS_RING, SmartLink } from "./landing-common";

/**
 * Breadcrumb trail. Items with an `href` link; the last item is the current page and doesn't.
 */
export function LandingBreadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px] text-[14px] text-pkb-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-[10px]">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-pkb-ink"
                >
                  {item.label}
                </span>
              ) : (
                <SmartLink
                  href={item.href}
                  className={`rounded-[2px] !text-pkb underline-offset-2 hover:!text-pkb-dark hover:underline ${FOCUS_RING}`}
                >
                  {item.label}
                </SmartLink>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

LandingBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};

/**
 * Shared page shell for the landing page and the Featured datasets page: the document head with
 * `noindex`, the tinted panel, and the responsive page padding and section spacing. These pages
 * are for team review, so they ask search engines to skip them.
 */
export default function LandingShell({ title, children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {/* Cancels the padding the app puts around pages, so the panel runs edge to edge on phones. */}
      <div className="-mx-3 bg-pkb-canvas text-pkb-ink md:mx-0 md:rounded-[12px]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[40px] px-[20px] pb-[48px] pt-[32px] leading-[1.45] md:gap-[56px] md:px-[32px] md:pb-[64px] md:pt-[48px]">
          {children}
        </div>
      </div>
    </>
  );
}

LandingShell.propTypes = {
  // Document title
  title: PropTypes.string.isRequired,
};
