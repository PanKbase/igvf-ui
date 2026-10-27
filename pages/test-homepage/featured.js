// components
import FeaturedPage from "../../components/landing/featured-page";

/**
 * Featured datasets page, served at /test-homepage/featured for team review. It isn't in the main
 * navigation and tells search engines not to index it. It needs no live data; every card comes from
 * the featured-datasets config.
 */
export default function TestHomepageFeatured() {
  return <FeaturedPage />;
}

export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return { props: {} };
}
