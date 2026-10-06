// node_modules
import { XMarkIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
// components/facets
import facetRegistry from "./facet-registry";
// components
import { Tooltip, TooltipRef, useTooltip } from "../tooltip";

/**
 * Displays the quick-hide button for optional facets.
 */
function OptionalQuickHide({
  facet,
  onOptionalFacetQuickHideChange,
  isFacetOpen,
}) {
  const tooltipAttr = useTooltip(`quick-hide-${facet.field}`);

  return (
    <>
      <TooltipRef tooltipAttr={tooltipAttr}>
        <button
          type="button"
          data-testid={`optional-facet-quick-hide-button-${facet.field}`}
          onClick={() => onOptionalFacetQuickHideChange(facet.field)}
          aria-label={`Hide optional ${facet.title} filter`}
          className={`cursor-pointer pl-1 ${
            isFacetOpen
              ? "text-optional-facet-quick-hide-open hover:bg-optional-facet-quick-hide-hover-open"
              : "text-optional-facet-quick-hide-closed hover:bg-optional-facet-quick-hide-hover-closed"
          }`}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </TooltipRef>
      <Tooltip tooltipAttr={tooltipAttr}>
        Hide optional {facet.title} filter. You can display optional filters
        with the <b>Optional Filters</b> button.
      </Tooltip>
    </>
  );
}

OptionalQuickHide.propTypes = {
  // Optional facet to hide
  facet: PropTypes.shape({
    field: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  // Called with the facet field when the user clicks the quick-hide button
  onOptionalFacetQuickHideChange: PropTypes.func.isRequired,
  // True if the facet is open
  isFacetOpen: PropTypes.bool.isRequired,
};

/**
 * Displays a single facet with its title and terms. Clicking the title opens or closes the facet.
 * The children, normally the facet terms, appear below the title.
 */
export default function Facet({
  facet,
  searchResults,
  updateQuery,
  updateOpen,
  onOptionalFacetQuickHideChange = () => {},
  isFacetOpen = false,
  isEditOrderMode = false,
  isOptional = false,
  children,
}) {
  const Title = facetRegistry.title.lookup(facet.field);

  return (
    <div
      className="border-t border-panel"
      data-testid={`facet-container-${facet.field}`}
    >
      <div
        className={`flex ${
          isFacetOpen ? "bg-facet-title" : "bg-white dark:bg-black"
        }`}
      >
        {isOptional && !isEditOrderMode && (
          <OptionalQuickHide
            facet={facet}
            onOptionalFacetQuickHideChange={onOptionalFacetQuickHideChange}
            isFacetOpen={isFacetOpen}
          />
        )}
        <button
          type="button"
          onClick={updateOpen}
          className={`min-w-0 flex-1 py-2 pr-4 ${
            isEditOrderMode ? "cursor-ns-resize" : "cursor-pointer"
          } ${isOptional && !isEditOrderMode ? "pl-1" : "pl-5"}`}
          data-testid={`facettrigger-${facet.field}`}
          aria-expanded={isFacetOpen}
        >
          <Title
            facet={facet}
            searchResults={searchResults}
            updateQuery={updateQuery}
            isFacetOpen={isFacetOpen}
            isEditOrderMode={isEditOrderMode}
          />
        </button>
      </div>
      {children}
    </div>
  );
}

Facet.propTypes = {
  // Facet object from search results
  facet: PropTypes.shape({
    field: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    terms: PropTypes.array,
  }).isRequired,
  // Search results from data provider
  searchResults: PropTypes.object.isRequired,
  // Called with the new query string when the user selects a facet term
  updateQuery: PropTypes.func.isRequired,
  // Called when the user clicks the facet title to open or close the facet
  updateOpen: PropTypes.func.isRequired,
  // Called with the facet field when the user clicks the optional-facet quick-hide button
  onOptionalFacetQuickHideChange: PropTypes.func,
  // True if the facet displays all its terms
  isFacetOpen: PropTypes.bool,
  // True when editing the facet order
  isEditOrderMode: PropTypes.bool,
  // True if the facet is an optional facet the user chose to display
  isOptional: PropTypes.bool,
};
