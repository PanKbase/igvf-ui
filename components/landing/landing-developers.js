// node_modules
import PropTypes from "prop-types";
// components
import { useCopyAction } from "../copy-button";
import { FOCUS_RING, SmartLink, TEXT_LINK } from "./landing-common";
import { CheckIcon, CopyIcon } from "./landing-icons";

const CURL_EXAMPLE =
  'curl "https://data.pankbase.org/search/?type=MeasurementSet&assay_term.term_name=single-cell+RNA+sequencing+assay&format=json"';

const CARD =
  "flex min-w-0 flex-col gap-[14px] rounded-[6px] border border-l-4 border-pkb-line border-l-pkb bg-white p-[24px]";

/**
 * Code box with a copy button. The "Copied" text sits in a polite live region so screen reader
 * users hear the confirmation.
 */
function CurlExample() {
  const { isCopied, initiateCopy } = useCopyAction(CURL_EXAMPLE);

  return (
    <div className="relative min-w-0 rounded-[8px] bg-pkb-code py-[16px] pl-[16px] pr-[56px]">
      <code className="block break-all font-mono text-[13px] leading-[1.6] text-[#e6eaf5]">
        {CURL_EXAMPLE}
      </code>
      <button
        type="button"
        onClick={initiateCopy}
        aria-label="Copy curl command"
        className="absolute right-[10px] top-[10px] flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-[#7a86b0] bg-[#1f2745] text-white hover:bg-pkb focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7fd6d6]"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <span
        aria-live="polite"
        className="absolute right-[52px] top-[19px] text-[12px] text-[#7fd6d6]"
      >
        {isCopied ? "Copied" : ""}
      </span>
    </div>
  );
}

/**
 * Developer block: links to the API, scripts, schema and standards, and a working curl example.
 */
export function LandingDevelopers() {
  return (
    <div className={CARD}>
      <h2 className="text-[22px] font-bold">For developers</h2>
      <p className="text-[15px]">
        Everything here is available through the REST API.
      </p>
      <div className="flex flex-wrap gap-x-[20px] gap-y-[8px] text-[14px]">
        <SmartLink
          href="https://pankbase.github.io/pankbase-client-openapi-spec"
          className={TEXT_LINK}
        >
          API reference
        </SmartLink>
        <SmartLink
          href="https://github.com/PanKbase/PanKbase-data-library-scripts"
          className={TEXT_LINK}
        >
          Example scripts (GitHub) ↗
        </SmartLink>
        <SmartLink href="/profiles/" className={TEXT_LINK}>
          Schema
        </SmartLink>
        <SmartLink href="/standards/" className={TEXT_LINK}>
          Data standards
        </SmartLink>
      </div>
      <CurlExample />
    </div>
  );
}

/**
 * Documentation block. The optional `resourceLink` adds the Resource analysis sets, which have no
 * tile in Browse by analysis.
 */
export function LandingDocumentation({ resourceLink = null }) {
  const docs = [
    {
      title: "User guide",
      description: "How to search, filter and download from the Data Library.",
      href: "/help/general-help/user-guide/",
    },
    {
      title: "Data standards",
      description:
        "Metadata and processing standards used across PanKbase data.",
      href: "/standards/",
    },
    {
      title: "Data Library schema",
      description: "Object types and properties behind every record.",
      href: "/profiles/",
    },
  ];
  if (resourceLink) {
    docs.push({
      title: "Resource analysis sets",
      description: "Metadata tables and reference resources for the library.",
      href: resourceLink.href,
    });
  }

  return (
    <div className={CARD}>
      <h2 className="text-[22px] font-bold">Documentation</h2>
      <ul className="m-0 flex list-none flex-col p-0">
        {docs.map((doc) => (
          <li key={doc.title} className="border-t border-pkb-line-soft">
            <SmartLink
              href={doc.href}
              className={`group block py-[10px] no-underline ${FOCUS_RING}`}
            >
              <span className="block font-bold text-pkb group-hover:underline">
                {doc.title} →
              </span>
              <span className="block text-[14px] text-pkb-body">
                {doc.description}
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

LandingDocumentation.propTypes = {
  resourceLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
  }),
};

/**
 * The developer and documentation blocks side by side on wide screens, stacked on narrow ones.
 */
export function LandingDeveloperBand({ resourceLink = null }) {
  return (
    <section className="grid grid-cols-1 gap-[24px] min-[1000px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <LandingDevelopers />
      <LandingDocumentation resourceLink={resourceLink} />
    </section>
  );
}

LandingDeveloperBand.propTypes = {
  resourceLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
  }),
};

/**
 * Strip pointing people who use the data to the citation and data-use policies.
 */
export function LandingCitation() {
  return (
    <section
      aria-label="Citing PanKbase data"
      className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px] rounded-[8px] border border-pkb-line bg-white px-[20px] py-[16px] text-[14px]"
    >
      <span className="font-semibold">Using PanKbase data?</span>
      <SmartLink
        href="https://pankbase.org/policies.html"
        className={TEXT_LINK}
      >
        How to cite and data-use policies
      </SmartLink>
    </section>
  );
}
