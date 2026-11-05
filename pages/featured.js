// components
import FeaturedPage from "../components/landing/featured-page";

/**
 * Featured datasets page, served at /featured. The old /test-homepage/featured review URL
 * redirects here. It needs no live data; every card comes from the featured-datasets config.
 */
export default function Featured() {
  return <FeaturedPage />;
}
