// node_modules
import PropTypes from "prop-types";
// components
import { Tooltip, TooltipRef, useTooltip } from "../tooltip";
// lib
import { getTermSelections } from "../../lib/facets";

/**
 * Tailwind CSS classes for each kind of indicator, depending on whether the facet is open.
 */
const indicatorClasses = {
  selected: {
    open: "bg-facet-counter-open-selected border-facet-counter-open-selected",
    closed: "bg-facet-counter-selected border-facet-counter-selected",
  },
  negative: {
    open: "bg-facet-counter-open-negative border-facet-counter-open-negative",
    closed: "bg-facet-counter-negative border-facet-counter-negative",
  },
  nonSelected: {
    open: "border-facet-counter-open",
    closed: "border-facet-counter",
  },
};

/**
 * Displays a representation of the count of terms and selections in a facet. Each term has a small
 * indicator, filled for selected terms and negatively selected terms, and empty for the others.
 */
export function FacetTermCount({ facet, searchResults, isFacetOpen = false }) {
  const tooltipAttr = useTooltip(`facet-counter-${facet.field}`);
  const { selectedTerms, negativeTerms, nonSelectedTerms } = getTermSelections(
    facet,
    searchResults.filters
  );

  // Build the help text for the aria label and the tooltip.
  const termCount = Array.isArray(facet.terms) ? facet.terms.length : 0;
  const helpText = `${
    selectedTerms.length + negativeTerms.length
  } selected of ${termCount} ${termCount === 1 ? "term" : "terms"}`;

  const openKey = isFacetOpen ? "open" : "closed";
  const indicators = [
    ...selectedTerms.map((term) => ({ term, kind: "selected" })),
    ...negativeTerms.map((term) => ({ term, kind: "negative" })),
    ...nonSelectedTerms.map((term) => ({ term, kind: "nonSelected" })),
  ];

  // Terms might repeat across kinds, so use the loop index as part of the React key.
  return (
    <>
      <TooltipRef tooltipAttr={tooltipAttr}>
        <div
          className="facet-term-count-mask flex gap-0.5 overflow-hidden"
          data-testid={`facet-term-count-${facet.field}`}
          aria-label={helpText}
        >
          {indicators.map(({ term, kind }, i) => (
            <div
              key={`${term}-${i}`}
              className={`h-1.5 w-2.5 flex-none border ${indicatorClasses[kind][openKey]}`}
            />
          ))}
        </div>
      </TooltipRef>
      <Tooltip tooltipAttr={tooltipAttr}>{helpText}</Tooltip>
    </>
  );
}

FacetTermCount.propTypes = {
  // Facet to display the term count for
  facet: PropTypes.shape({
    field: PropTypes.string.isRequired,
    terms: PropTypes.array,
  }).isRequired,
  // Search results the facet belongs to
  searchResults: PropTypes.shape({
    filters: PropTypes.array.isRequired,
  }).isRequired,
  // True if the facet is open
  isFacetOpen: PropTypes.bool,
};
