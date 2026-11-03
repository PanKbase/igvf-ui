// node_modules
import PropTypes from "prop-types";
// components
import { FeaturedGrid } from "./featured-card";
import {
  FEATURED_PATH,
  SectionHeading,
  SmartLink,
  TEXT_LINK,
} from "./landing-common";
import { LandingCitation, LandingDeveloperBand } from "./landing-developers";
import LandingDonors from "./landing-donors";
import LandingHero from "./landing-hero";
import LandingRecent from "./landing-recent";
import LandingShell from "./landing-shell";
import LandingStats from "./landing-stats";
import { AnalysisTiles, AssayTiles } from "./landing-tiles";
// lib
import { getLandingFeaturedDatasets } from "../../lib/featured-datasets";

/**
 * Featured datasets section of the landing page: the first few cards plus a link to the page with
 * all of them.
 */
function LandingFeatured() {
  return (
    <section
      aria-labelledby="featured-datasets"
      className="flex flex-col gap-[16px]"
    >
      <div className="flex items-end justify-between gap-[12px]">
        <SectionHeading id="featured-datasets" title="Featured datasets" />
        <SmartLink href={FEATURED_PATH} className={`text-[14px] ${TEXT_LINK}`}>
          All featured →
        </SmartLink>
      </div>
      <FeaturedGrid datasets={getLandingFeaturedDatasets()} />
    </section>
  );
}

/**
 * Body of the redesigned Data Library landing page. Each live-data section renders only when its
 * query succeeded and has something to show; the static developer, documentation and citation
 * blocks always render.
 */
export default function LandingPage({ data }) {
  return (
    <LandingShell title="PanKbase Data Library">
      <LandingHero tryChips={data.tryChips} />
      {data.stats && <LandingStats stats={data.stats} />}
      {data.assayTiles.length > 0 && <AssayTiles tiles={data.assayTiles} />}
      {data.analysisTiles.length > 0 && (
        <AnalysisTiles tiles={data.analysisTiles} />
      )}
      {(data.donorChips.length > 0 || data.autoantibodyChip) && (
        <LandingDonors
          conditionChips={data.donorChips}
          autoantibodyChip={data.autoantibodyChip}
        />
      )}
      <LandingFeatured />
      {data.recent.length > 0 && <LandingRecent rows={data.recent} />}
      <LandingDeveloperBand resourceLink={data.resourceLink} />
      <LandingCitation />
    </LandingShell>
  );
}

const chipPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.string,
});

LandingPage.propTypes = {
  // Live data from `getLandingData()`
  data: PropTypes.shape({
    stats: PropTypes.shape({
      donors: PropTypes.number.isRequired,
      measurementSets: PropTypes.number.isRequired,
      analysisSets: PropTypes.number.isRequired,
    }),
    assayTiles: PropTypes.arrayOf(chipPropType).isRequired,
    analysisTiles: PropTypes.arrayOf(chipPropType).isRequired,
    donorChips: PropTypes.arrayOf(chipPropType).isRequired,
    autoantibodyChip: chipPropType,
    resourceLink: chipPropType,
    recent: PropTypes.arrayOf(PropTypes.object).isRequired,
    tryChips: PropTypes.arrayOf(chipPropType).isRequired,
  }).isRequired,
};
