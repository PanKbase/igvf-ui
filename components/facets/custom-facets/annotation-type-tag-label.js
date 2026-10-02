// node_modules
import PropTypes from "prop-types";
// lib
import { getAnnotationTypeTitle } from "../../../lib/annotation-type";
import { getFilterTerm } from "../../../lib/facets";

/**
 * Facet tag label for annotation_type showing the human-readable title.
 */
export default function AnnotationTypeTagLabel({ filter }) {
  const term = getFilterTerm(filter);
  if (term === "NOT" || term === "ANY") {
    return <>{term}</>;
  }
  return <>{getAnnotationTypeTitle(term)}</>;
}

AnnotationTypeTagLabel.propTypes = {
  // Filter object from search results
  filter: PropTypes.shape({
    // Object property the filter represents
    field: PropTypes.string.isRequired,
    // Value of the object property
    term: PropTypes.string.isRequired,
  }).isRequired,
};
