// components
import { FeaturedGrid } from "./featured-card";
import {
  FOCUS_RING,
  LANDING_PATH,
  SECTION_TITLE,
  SmartLink,
} from "./landing-common";
import LandingShell, { LandingBreadcrumb } from "./landing-shell";
// lib
import { FEATURED_DATASETS } from "../../lib/featured-datasets";

/**
 * Body of the Featured datasets page: all the featured cards from the shared config, under the
 * same page shell as the landing page.
 */
export default function FeaturedPage() {
  return (
    <LandingShell title="Featured datasets | PanKbase Data Library">
      <header className="flex flex-col gap-[20px]">
        <LandingBreadcrumb
          items={[
            { label: "Data Library", href: LANDING_PATH },
            { label: "Featured datasets" },
          ]}
        />
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[48px]">
          Featured datasets
        </h1>
        <div className="h-[3px] w-[56px] bg-pkb" aria-hidden="true" />
        <p className="text-[16px] text-pkb-body md:text-[18px]">
          Curated datasets and resources from the PanKbase Data Library.
        </p>
      </header>
      <section
        aria-labelledby="all-datasets"
        className="flex flex-col gap-[16px]"
      >
        <h2 id="all-datasets" className={SECTION_TITLE}>
          {`All ${FEATURED_DATASETS.length} datasets`}
        </h2>
        <FeaturedGrid datasets={FEATURED_DATASETS} />
      </section>
      <SmartLink
        href={LANDING_PATH}
        className={`self-start rounded-[2px] text-[14px] font-semibold !text-pkb underline-offset-2 hover:!text-pkb-dark hover:underline ${FOCUS_RING}`}
      >
        ← Back to Data Library
      </SmartLink>
    </LandingShell>
  );
}
