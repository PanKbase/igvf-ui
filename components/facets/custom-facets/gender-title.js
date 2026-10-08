// node_modules
import PropTypes from "prop-types";
// components/facets/custom-facets
import StandardTitleElement from "./standard-title-element";
// components/facets
import { FacetTermCount } from "../facet-term-count";

/**
 * Displays the facet title for the gender field as "Gender", regardless of the title the data
 * provider supplies.
 */
export default function GenderTitle({
  facet,
  searchResults,
  isFacetOpen = false,
  isEditOrderMode = false,
}) {
  return (
    <>
      <StandardTitleElement
        field={facet.field}
        description={facet.description}
        isFacetOpen={isFacetOpen}
        isEditOrderMode={isEditOrderMode}
      >
        Gender
      </StandardTitleElement>
      <FacetTermCount
        facet={facet}
        searchResults={searchResults}
        isFacetOpen={isFacetOpen}
      />
    </>
  );
}

GenderTitle.propTypes = {
  // Facet object to display the title for
  facet: PropTypes.shape({
    // Facet property name
    field: PropTypes.string.isRequired,
    // Facet title (ignored, we use "Gender" instead)
    title: PropTypes.string,
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
