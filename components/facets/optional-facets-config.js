// node_modules
import {
  CheckBadgeIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import _ from "lodash";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
// components
import { AnnotatedItem } from "../annotated-value";
import { Button } from "../form-elements";
import Modal from "../modal";
import SessionContext from "../session-context";

/**
 * Category name used to sort facets with no category last, and displayed as "Other".
 */
const NO_CATEGORY_KEY = "z";

/**
 * Filter the optional facets to only those that should be displayed for this user.
 * @param {array} optionalFacets Optional facets to check
 * @param {object} sessionProperties Session properties from the back end
 * @returns {array} Optional facets to appear at this user's privilege level
 */
function filterOptionalFacets(optionalFacets, sessionProperties) {
  return optionalFacets.filter((facet) => {
    if (facet.field === "audit.INTERNAL_ACTION.category") {
      return sessionProperties?.user !== undefined;
    }
    return true;
  });
}

/**
 * Display the optional-facets configuration modal. The user checks the optional facets to display
 * for the selected type and saves the selection, which the parent persists in localStorage.
 */
export function OptionalFacetsConfigModal({
  selectedType,
  visibleOptionalFacets,
  allFacets,
  onSave,
  onClose,
}) {
  const { sessionProperties } = useContext(SessionContext);

  // Tracks the optional-facets config being modified in the modal.
  const [dynamicConfig, setDynamicConfig] = useState(visibleOptionalFacets);

  // Get only the optional facets for all facets available for the current type.
  const optionalFacets = allFacets.filter((facet) => facet.optional);
  const filteredOptionalFacets = filterOptionalFacets(
    optionalFacets,
    sessionProperties
  );

  // Group each optional facet by their category and sort case insensitively. Any without
  // `category` go into "Other" and get sorted last.
  const groupedOptionalFacets = _.groupBy(
    filteredOptionalFacets,
    (facet) => facet.category || NO_CATEGORY_KEY
  );
  const sortedGroupNames = _.sortBy(
    Object.keys(groupedOptionalFacets),
    (name) => (name === NO_CATEGORY_KEY ? "\uffff" : name.toLowerCase())
  );

  // Called when a field checkbox is clicked to add or remove it from the config.
  function onFieldClick(field) {
    setDynamicConfig((currentConfig) =>
      currentConfig.includes(field)
        ? currentConfig.filter((configField) => configField !== field)
        : [...currentConfig, field]
    );
  }

  return (
    <Modal isOpen onClose={onClose} testid="optional-facets-modal">
      <Modal.Header onClose={onClose}>
        <div>
          Configure Optional Filters
          <div className="text-sm font-normal text-neutral-500">
            Selections are saved in this browser.
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="my-2 grid gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedGroupNames.length === 0 && (
            <p className="col-span-full text-center">
              <i>No optional filters available.</i>
            </p>
          )}
          {sortedGroupNames.map((category) => (
            <div key={category} className="rounded px-2 py-0">
              <h3 className="border-b-2 border-optional-facet-config-divider font-semibold text-optional-facet-config-header">
                {category !== NO_CATEGORY_KEY ? category : "Other"}
              </h3>
              <fieldset data-testid="facet-checkboxes">
                {groupedOptionalFacets[category].map((facet) => (
                  <label
                    key={facet.field}
                    className="flex cursor-pointer items-start py-0.5"
                  >
                    <input
                      className="mr-1 mt-1 cursor-pointer"
                      type="checkbox"
                      id={`optional-facet-${facet.field}`}
                      aria-label={facet.title}
                      checked={dynamicConfig.includes(facet.field)}
                      onChange={() => onFieldClick(facet.field)}
                    />
                    <AnnotatedItem
                      tooltipKey={`optional-facet-modal-${selectedType}-${facet.field}`}
                      annotation={facet.description || ""}
                    >
                      {facet.title}
                    </AnnotatedItem>
                  </label>
                ))}
              </fieldset>
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex w-full items-center justify-between gap-1">
          <Button
            id="clear-optional-facets-modal-button"
            type="secondary"
            className="gap-1"
            onClick={() => setDynamicConfig([])}
          >
            <TrashIcon />
            Clear All
          </Button>
          <div className="flex gap-1">
            <Button
              id="close-optional-facets-modal-button"
              type="secondary"
              className="gap-1"
              onClick={onClose}
            >
              <XCircleIcon />
              Close
            </Button>
            <Button
              id="save-optional-facets-modal-button"
              type="primary"
              className="gap-1"
              onClick={() => onSave(dynamicConfig)}
            >
              <CheckBadgeIcon />
              Save
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

OptionalFacetsConfigModal.propTypes = {
  // Currently selected single search type
  selectedType: PropTypes.string.isRequired,
  // Fields of the optional facets currently configured to be visible
  visibleOptionalFacets: PropTypes.arrayOf(PropTypes.string).isRequired,
  // All facets available for the type, including optional ones not currently visible
  allFacets: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      optional: PropTypes.bool,
      category: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  // Called with the new configuration when the user saves
  onSave: PropTypes.func.isRequired,
  // Called when the user closes the modal without saving
  onClose: PropTypes.func.isRequired,
};
