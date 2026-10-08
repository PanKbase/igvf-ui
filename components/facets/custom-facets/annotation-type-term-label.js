// node_modules
import PropTypes from "prop-types";
// lib
import { getAnnotationTypeTitle } from "../../../lib/annotation-type";

/**
 * Facet term label for annotation_type showing the human-readable title.
 */
export default function AnnotationTypeTermLabel({ term, isNegative }) {
  const label = getAnnotationTypeTitle(String(term.key_as_string || term.key));
  return (
    <div className="flex grow items-center justify-between gap-2 text-sm font-normal leading-[1.1]">
      <div>{label}</div>
      {!isNegative && <div>{term.doc_count}</div>}
    </div>
  );
}

AnnotationTypeTermLabel.propTypes = {
  // Single term from a facet from the search results
  term: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    key_as_string: PropTypes.string,
    doc_count: PropTypes.number.isRequired,
  }).isRequired,
  // True if the term is negated
  isNegative: PropTypes.bool.isRequired,
};
