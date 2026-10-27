// node_modules
import PropTypes from "prop-types";
// components
import LandingPage from "../../components/landing/landing-page";
// lib
import { EMPTY_LANDING_DATA, getLandingData } from "../../lib/landing-server";

/**
 * Redesigned Data Library landing page, served at /test-homepage for team review. It isn't in the
 * main navigation and tells search engines not to index it. The live home page at / is unchanged.
 */
export default function TestHomepage({ landing }) {
  return <LandingPage data={landing} />;
}

TestHomepage.propTypes = {
  // Live counts and rows from igvfd, cached for about five minutes
  landing: PropTypes.object.isRequired,
};

export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  // `getLandingData()` already turns request failures into hidden sections. This catch is only a
  // last resort so an unexpected bug can't take down the whole page.
  let landing = EMPTY_LANDING_DATA;
  try {
    landing = await getLandingData();
  } catch (error) {
    console.log("LANDING DATA ERROR: ", error);
  }
  return { props: { landing } };
}
