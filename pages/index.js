// node_modules
import PropTypes from "prop-types";
// components
import LandingPage from "../components/landing/landing-page";
// lib
import { EMPTY_LANDING_DATA, getLandingData } from "../lib/landing-server";

/**
 * Data Library landing page, served at /. The old /test-homepage review URL redirects here.
 */
export default function Home({ landing }) {
  return <LandingPage data={landing} />;
}

Home.propTypes = {
  // Live counts and rows from igvfd, cached for about five minutes
  landing: PropTypes.object.isRequired,
};

export async function getServerSideProps() {
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
