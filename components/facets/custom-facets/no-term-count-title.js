// node_modules
import PropTypes from "prop-types";
// components/facets/custom-facets
import StandardTitleElement from "./standard-title-element";

/**
 * Appears the same as StandardTitle but without the facet term count indicator.
 */
export default function NoTermCountTitle({
  facet,
  isFacetOpen = false,
  isEditOrderMode = false,
}) {
  return (
    <StandardTitleElement
      field={facet.field}
      description={facet.description}
      isFacetOpen={isFacetOpen}
      isEditOrderMode={isEditOrderMode}
    >
      {facet.title}
    </StandardTitleElement>
  );
}

NoTermCountTitle.propTypes = {
  // Facet object from search results
  facet: PropTypes.shape({
    field: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  // True if the facet displays all its terms
  isFacetOpen: PropTypes.bool,
  // True when editing the facet order
  isEditOrderMode: PropTypes.bool,
};
