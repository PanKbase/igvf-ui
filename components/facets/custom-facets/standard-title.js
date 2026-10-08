// node_modules
import PropTypes from "prop-types";
// components/facets/custom-facets
import NoTermCountTitle from "./no-term-count-title";
import StandardTitleElement from "./standard-title-element";
// components/facets
import { FacetTermCount } from "../facet-term-count";
// lib
import { checkForBooleanFacet } from "../../../lib/facets";

export { StandardTitleElement };

/**
 * Displays the standard facet title, using the `title` property of the displayed facet, along
 * with the facet's term count.
 */
export default function StandardTitle({
  facet,
  searchResults,
  isFacetOpen = false,
  isEditOrderMode = false,
}) {
  // Facets that appear to be boolean facets should not display a term count.
  if (checkForBooleanFacet(facet)) {
    return (
      <NoTermCountTitle
        facet={facet}
        isFacetOpen={isFacetOpen}
        isEditOrderMode={isEditOrderMode}
      />
    );
  }

  return (
    <>
      <StandardTitleElement
        field={facet.field}
        description={facet.description}
        isFacetOpen={isFacetOpen}
        isEditOrderMode={isEditOrderMode}
      >
        {facet.title}
      </StandardTitleElement>
      <FacetTermCount
        facet={facet}
        searchResults={searchResults}
        isFacetOpen={isFacetOpen}
      />
    </>
  );
}

StandardTitle.propTypes = {
  // Facet object to display the title for
  facet: PropTypes.shape({
    // Facet property name
    field: PropTypes.string.isRequired,
    // Facet title
    title: PropTypes.string.isRequired,
    // Facet description
    description: PropTypes.string,
    // Facet terms
    terms: PropTypes.array,
  }).isRequired,
  // Search results that include the facet
  searchResults: PropTypes.shape({
    filters: PropTypes.array.isRequired,
  }).isRequired,
  // True if the facet displays all its terms
  isFacetOpen: PropTypes.bool,
  // True when editing the facet order
  isEditOrderMode: PropTypes.bool,
};
