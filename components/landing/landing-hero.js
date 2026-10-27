// node_modules
import PropTypes from "prop-types";
// components
import { FOCUS_RING, SmartLink, TEXT_LINK } from "./landing-common";
import { LandingBreadcrumb } from "./landing-shell";

const USER_GUIDE_PATH = "/help/general-help/user-guide/";

/**
 * Landing page hero: breadcrumb, title, search box, and suggestion chips. The search box is a
 * plain GET form, so it works before JavaScript loads and lands on `/search/?searchTerm=<q>`.
 */
export default function LandingHero({ tryChips }) {
  return (
    <section aria-label="Search" className="flex flex-col gap-[20px]">
      <LandingBreadcrumb
        items={[{ label: "Data", href: "/browse/" }, { label: "Data Library" }]}
      />
      <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[48px]">
        PanKbase Data Library
      </h1>
      <div className="h-[3px] w-[56px] bg-pkb" aria-hidden="true" />
      <form
        action="/search/"
        method="get"
        role="search"
        className="flex max-w-[900px] flex-col gap-[10px] md:flex-row"
      >
        <input
          name="searchTerm"
          type="search"
          aria-label="Search the PanKbase Data Library"
          placeholder="Search donors, assays, genes…"
          autoComplete="off"
          className="box-border h-[56px] w-full min-w-0 rounded-[8px] md:flex-1 border-[1.5px] border-[#7d869c] bg-white px-[18px] text-[16px] text-pkb-ink placeholder:text-pkb-muted focus:border-pkb focus:outline focus:outline-[3px] focus:outline-offset-1 focus:outline-pkb-dark"
        />
        <button
          type="submit"
          className={`h-[56px] rounded-[8px] bg-pkb px-[30px] text-[16px] font-semibold text-white hover:bg-pkb-dark ${FOCUS_RING}`}
        >
          Search
        </button>
      </form>
      <div className="flex max-w-[900px] flex-wrap items-center justify-between gap-x-[24px] gap-y-[12px]">
        {tryChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="text-[14px] text-pkb-muted">Try:</span>
            {tryChips.map((chip) => (
              <SmartLink
                key={chip.label}
                href={chip.href}
                className={`rounded-full border border-[#cdd2de] bg-white px-[13px] py-[5px] text-[14px] !text-pkb-ink no-underline hover:border-pkb hover:!text-pkb ${FOCUS_RING}`}
              >
                {chip.label}
              </SmartLink>
            ))}
          </div>
        )}
        <SmartLink
          href={USER_GUIDE_PATH}
          className={`text-[14px] ${TEXT_LINK}`}
        >
          New here? Read the user guide →
        </SmartLink>
      </div>
    </section>
  );
}

LandingHero.propTypes = {
  // Suggestion chips, each linking to a real filter
  tryChips: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
};
