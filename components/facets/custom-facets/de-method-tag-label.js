// node_modules
import PropTypes from "prop-types";
// lib
import { getDeMethodTitle } from "../../../lib/analysis-set-de";
import { getFilterTerm } from "../../../lib/facets";

/**
 * Facet tag label for de_method showing a human-readable title.
 */
export default function DeMethodTagLabel({ filter }) {
  const term = getFilterTerm(filter);
  if (term === "NOT" || term === "ANY") {
    return <>{term}</>;
  }
  return <>{getDeMethodTitle(term)}</>;
}

DeMethodTagLabel.propTypes = {
  // Filter object from search results
  filter: PropTypes.shape({
    // Object property the filter represents
    field: PropTypes.string.isRequired,
    // Value of the object property
    term: PropTypes.string.isRequired,
  }).isRequired,
};
