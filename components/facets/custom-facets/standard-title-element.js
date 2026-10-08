// node_modules
import { Bars3Icon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
// components
import { AnnotatedItem } from "../../annotated-value";

/**
 * Alternate facet title renderers can use this to display the standard title with its
 * expand/collapse indicator. That way you can keep the standard functionality and only change
 * something about the title itself.
 */
export default function StandardTitleElement({
  field,
  description = "",
  isFacetOpen = false,
  isEditOrderMode = false,
  children,
}) {
  return (
    <h2
      className={`flex items-center justify-between text-base font-normal ${
        isFacetOpen ? "text-white" : ""
      }`}
      data-testid={`facettitle-${field}`}
    >
      <AnnotatedItem
        annotation={description}
        tooltipKey={`facet-title-${field}`}
        className={isFacetOpen ? "decoration-open-facet-help-underline" : ""}
      >
        <div className="inline-block text-left">{children}</div>
      </AnnotatedItem>
      {isEditOrderMode ? (
        <div className="basis-4">
          <Bars3Icon className="h-4 w-4 fill-gray-400 dark:fill-gray-600" />
        </div>
      ) : (
        <div className="basis-4">
          {isFacetOpen ? (
            <MinusIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </div>
      )}
    </h2>
  );
}

StandardTitleElement.propTypes = {
  // Facet property name
  field: PropTypes.string.isRequired,
  // Facet description to show in a tooltip
  description: PropTypes.string,
  // True if the facet displays all its terms
  isFacetOpen: PropTypes.bool,
  // True when editing the facet order
  isEditOrderMode: PropTypes.bool,
};
