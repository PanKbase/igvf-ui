// node_modules
import { useAuth0 } from "@auth0/auth0-react";
import {
  AdjustmentsHorizontalIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/20/solid";
import _ from "lodash";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
// components/facets
import { FacetList } from "./facet-list";
import { OptionalFacetsConfigModal } from "./optional-facets-config";
// components
import { DataPanel } from "../data-area";
import { Button } from "../form-elements";
import HelpTip from "../help-tip";
import { Tooltip, TooltipRef, useTooltip } from "../tooltip";
// lib
import {
  applyFacetOrder,
  checkOptionalFacetsConfigurable,
  clearFacetOrder,
  getFacetOpenState,
  getFacetOrder,
  getOptionalFacetsConfigForType,
  getOptionalFacetsFromConfig,
  getSpecificSearchTypes,
  getVisibleFacets,
  loadFacetConfig,
  mergeSearchConfigIntoFacets,
  saveOptionalFacetsConfigForType,
  setFacetOpenState,
  setFacetOrder,
} from "../../lib/facets";
import FetchRequest from "../../lib/fetch-request";

/**
 * Set the open state of all the given facets.
 * @param {array} facets Facets to update
 * @param {boolean} openAll True to open all facets, false to close all facets
 * @returns {object} Map of facet fields to their open state
 */
function setAllFacetOpenState(facets, openAll) {
  return Object.fromEntries(facets.map((facet) => [facet.field, openAll]));
}

/**
 * Generate the updated open/closed state of all facets after the user clicks a facet title to
 * open or close it. If the user holds down the alt or option key while clicking, it toggles all
 * the facets at once.
 * @param {object} e Event from the user clicking a facet title
 * @param {string} field Field name of the facet title that was clicked
 * @param {array} visibleFacets Facets currently visible
 * @param {object} openedFacets Map of facet fields to their current open state
 * @returns {object} Map of facet fields to their updated open state
 */
function updateOpenFacets(e, field, visibleFacets, openedFacets) {
  if (e.altKey || e.metaKey) {
    return setAllFacetOpenState(visibleFacets, !openedFacets[field]);
  }
  return { ...openedFacets, [field]: !openedFacets[field] };
}

/**
 * Display a button that clears all the currently selected facets.
 */
function ClearAll({ searchResults }) {
  const router = useRouter();

  // Get all the currently selected facet fields except for the "type" facet.
  const selectedFields = searchResults.filters
    .map((filter) => filter.field)
    .filter((field) => field !== "type");
  const uniqueSelectedFields = [...new Set(selectedFields)];

  function onClearAll() {
    router.push(searchResults.clear_filters, undefined, { scroll: false });
  }

  return (
    <Button
      label="Clear all filters"
      onClick={onClearAll}
      type="secondary"
      size="sm"
      className="grow"
      isDisabled={uniqueSelectedFields.length === 0}
    >
      Clear Filters
    </Button>
  );
}

ClearAll.propTypes = {
  // Search results from the data provider
  searchResults: PropTypes.object.isRequired,
};

/**
 * Display controls for expanding and collapsing all facets.
 */
function AllFacetsControls({ onAllFacets }) {
  const collapseTooltipAttr = useTooltip("collapse-all");
  const expandTooltipAttr = useTooltip("expand-all");

  return (
    <div className="flex gap-1">
      <TooltipRef tooltipAttr={expandTooltipAttr}>
        <div className="h-full">
          <Button
            label="Open all facets"
            onClick={() => onAllFacets(true)}
            type="secondary"
            size="sm"
            className="h-full"
            hasIconCircleOnly
          >
            <ArrowsPointingOutIcon />
          </Button>
        </div>
      </TooltipRef>
      <Tooltip tooltipAttr={expandTooltipAttr}>
        Expand all filters, or hold down the Alt key and expand one filter to
        expand all
      </Tooltip>
      <TooltipRef tooltipAttr={collapseTooltipAttr}>
        <div className="h-full">
          <Button
            label="Close all facets"
            onClick={() => onAllFacets(false)}
            type="secondary"
            size="sm"
            className="h-full"
            hasIconCircleOnly
          >
            <ArrowsPointingInIcon />
          </Button>
        </div>
      </TooltipRef>
      <Tooltip tooltipAttr={collapseTooltipAttr}>
        Collapse all filters, or hold down the Alt key and collapse one filter
        to collapse all
      </Tooltip>
    </div>
  );
}

AllFacetsControls.propTypes = {
  // Called with true to open all facets, or false to close all facets
  onAllFacets: PropTypes.func.isRequired,
};

/**
 * Display controls for configuring optional facets and editing facet order.
 */
function ConfigFacetsControl({
  selectedType,
  allFacets,
  onEditModeChange,
  showEditOrder,
  optionalFacetsConfigForType,
  onOptionalFacetsConfigSave,
  showOptionalFacetsControl,
}) {
  const editOrderTooltipAttr = useTooltip("edit-order");
  const optionalFacetsTooltipAttr = useTooltip("optional-facets");

  // Tracks whether the optional-facets configuration modal is open.
  const [isOptionalFacetsConfigOpen, setIsOptionalFacetsConfigOpen] =
    useState(false);

  // Called when the user saves the optional-facets configuration from the modal.
  function onSaveOptionalFacetsConfigForType(newConfig) {
    onOptionalFacetsConfigSave(newConfig);
    setIsOptionalFacetsConfigOpen(false);
  }

  return (
    <div className="flex gap-1">
      {showEditOrder && (
        <>
          <TooltipRef tooltipAttr={editOrderTooltipAttr}>
            <div className="grow">
              <Button
                label="Edit facet order"
                onClick={() => onEditModeChange("ENTER")}
                type="secondary"
                size="sm"
                className="w-full gap-1"
                id="edit-order-button"
              >
                <ArrowsUpDownIcon />
                Filter Order
              </Button>
            </div>
          </TooltipRef>
          <Tooltip tooltipAttr={editOrderTooltipAttr}>
            Enter a mode to change the order of the filters. While in this mode
            you can drag and drop the filters to any order convenient for you.
          </Tooltip>
        </>
      )}
      {showOptionalFacetsControl && (
        <>
          <TooltipRef tooltipAttr={optionalFacetsTooltipAttr}>
            <div className="grow">
              <Button
                label="Configure optional filters"
                onClick={() => setIsOptionalFacetsConfigOpen(true)}
                type="secondary"
                size="sm"
                className="w-full gap-1"
                id="optional-facets-button"
              >
                <AdjustmentsHorizontalIcon />
                Optional Filters
              </Button>
            </div>
          </TooltipRef>
          <Tooltip tooltipAttr={optionalFacetsTooltipAttr}>
            Choose which optional filters to display. Optional filters do not
            appear by default but you can show specific ones here.
          </Tooltip>
        </>
      )}
      {isOptionalFacetsConfigOpen && (
        <OptionalFacetsConfigModal
          selectedType={selectedType}
          visibleOptionalFacets={optionalFacetsConfigForType}
          allFacets={allFacets}
          onSave={onSaveOptionalFacetsConfigForType}
          onClose={() => setIsOptionalFacetsConfigOpen(false)}
        />
      )}
    </div>
  );
}

ConfigFacetsControl.propTypes = {
  // Currently selected single search type
  selectedType: PropTypes.string.isRequired,
  // All facets available for the type, including optional ones that aren't currently visible
  allFacets: PropTypes.array.isRequired,
  // Called with the edit-mode change the user requests
  onEditModeChange: PropTypes.func.isRequired,
  // True to show the edit-order button
  showEditOrder: PropTypes.bool.isRequired,
  // Fields of the optional facets the user chose to display
  optionalFacetsConfigForType: PropTypes.arrayOf(PropTypes.string).isRequired,
  // Called with the new optional-facets configuration when the user saves it
  onOptionalFacetsConfigSave: PropTypes.func.isRequired,
  // True to show the optional-facets configuration button
  showOptionalFacetsControl: PropTypes.bool.isRequired,
};

/**
 * Display buttons to save, cancel, or reset the facet-order edits while in edit-order mode.
 */
function EditOrderButton({ isEditOrderMode, onEditModeChange }) {
  if (isEditOrderMode) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          type="primary"
          onClick={() => onEditModeChange("SAVE")}
          className="flex-1 basis-0"
        >
          Done
        </Button>
        <Button
          size="sm"
          type="secondary"
          onClick={() => onEditModeChange("CANCEL")}
          className="flex-1 basis-0"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          type="warning"
          onClick={() => onEditModeChange("RESET")}
          className="flex-1 basis-0"
        >
          Reset
        </Button>
      </div>
    );
  }
  return null;
}

EditOrderButton.propTypes = {
  // True if the facet order is being edited
  isEditOrderMode: PropTypes.bool.isRequired,
  // Called with the edit-mode change the user requests
  onEditModeChange: PropTypes.func.isRequired,
};

/**
 * Display the facet area including the Clear Filters button, the controls to expand and collapse
 * facets, configure optional facets, and change the facet order, and the facets themselves.
 *
 * The search results' facets don't yet include `optional`, `category`, and `description`, so
 * these come from the search config. Search pages load that config on the server and pass it in
 * `facetConfig`; if it's missing, this component loads it from the cached search-config registry.
 *
 * Users' open/closed facets, facet order, and optional-facet choices persist in localStorage for
 * searches for a single type.
 */
export default function FacetSection({ searchResults, facetConfig = null }) {
  const { isAuthenticated } = useAuth0();
  const types = getSpecificSearchTypes(searchResults);
  const typesKey = types.join(",");
  const selectedType = types.length === 1 ? types[0] : "";

  // Facet config loaded on the client when the page didn't supply it.
  const [loadedConfig, setLoadedConfig] = useState({ key: "", config: null });
  const hasSuppliedConfig = Boolean(facetConfig);
  const isConfigPending =
    !hasSuppliedConfig && types.length > 0 && loadedConfig.key !== typesKey;
  const activeFacetConfig = hasSuppliedConfig
    ? facetConfig
    : loadedConfig.config;

  // Persisted user preferences for the selected type. They load after mount because localStorage
  // doesn't exist during server rendering.
  const [optionalFacetsConfigForType, setOptionalFacetsConfigForType] =
    useState([]);
  const [savedOrder, setSavedOrder] = useState(null);
  const [openedFacets, setOpenedFacets] = useState({});

  // Edit-order state; `editedOrder` holds the order while the user edits so they can cancel.
  const [isEditOrderMode, setIsEditOrderMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState([]);

  useEffect(() => {
    if (hasSuppliedConfig || types.length === 0) {
      return undefined;
    }
    let isMounted = true;
    loadFacetConfig(searchResults, new FetchRequest()).then((config) => {
      if (isMounted) {
        setLoadedConfig({ key: typesKey, config: config || {} });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [typesKey, hasSuppliedConfig]);

  useEffect(() => {
    setOptionalFacetsConfigForType(
      selectedType ? getOptionalFacetsConfigForType(selectedType) : []
    );
    setSavedOrder(getFacetOrder(selectedType));
    setOpenedFacets(getFacetOpenState(selectedType) || {});
    setIsEditOrderMode(false);
  }, [selectedType]);

  // Merge the search-config properties onto the facets, then pick the ones visible to the user.
  // Memoize the merged facets so the facet objects keep their identities across renders; the
  // drag-to-reorder list relies on stable identities.
  const mergedFacets = useMemo(
    () => mergeSearchConfigIntoFacets(searchResults.facets, activeFacetConfig),
    [searchResults.facets, activeFacetConfig]
  );
  const facets = getVisibleFacets(
    mergedFacets,
    optionalFacetsConfigForType,
    selectedType,
    isAuthenticated
  );

  // All facets the optional-facets modal can offer: optional facets in the search results plus
  // those only in the search config because the current selections dropped them from the results.
  const allFacets = _.uniqBy(
    [...mergedFacets, ...getOptionalFacetsFromConfig(activeFacetConfig)],
    "field"
  );

  // Facets in the user's saved order and, while editing, in the edited order.
  const orderedFacets = applyFacetOrder(facets, savedOrder);
  const editedOrderedFacets = applyFacetOrder(facets, editedOrder);

  // Facets stay closed unless the user opened them or the data provider says to open on load.
  const effectiveOpenedFacets = Object.fromEntries(
    facets.map((facet) => [
      facet.field,
      openedFacets[facet.field] ?? Boolean(facet.open_on_load),
    ])
  );

  // Update and persist the open/closed state of the facets.
  function saveOpen(updatedOpenedFacets) {
    setOpenedFacets(updatedOpenedFacets);
    setFacetOpenState(selectedType, updatedOpenedFacets);
  }

  // Called when the user clicks on a facet title with the facet ID `field` to open or close it.
  function onFacetOpen(e, field) {
    if (!isEditOrderMode) {
      saveOpen(updateOpenFacets(e, field, facets, effectiveOpenedFacets));
    }
  }

  // Called when the user wants to open or close all facets at once.
  function onAllFacets(openAll) {
    saveOpen(setAllFacetOpenState(facets, openAll));
  }

  // Called by the `Reorder` component when the user drags facets to reorder them.
  function onReorder(newOrder) {
    setEditedOrder(newOrder.map((facet) => facet.field));
  }

  // Called when the user enters, saves, cancels edit mode for facet ordering, or resets the order.
  function onEditModeChange(editMode) {
    const defaultOrder = facets.map((facet) => facet.field);
    if (editMode === "ENTER") {
      setIsEditOrderMode(true);
      setEditedOrder(orderedFacets.map((facet) => facet.field));
    } else if (editMode === "SAVE") {
      setIsEditOrderMode(false);
      if (_.isEqual(editedOrder, defaultOrder)) {
        // Back to the default order, so no need to remember a custom order.
        clearFacetOrder(selectedType);
        setSavedOrder(null);
      } else {
        setFacetOrder(selectedType, editedOrder);
        setSavedOrder(editedOrder);
      }
      setEditedOrder([]);
    } else if (editMode === "CANCEL") {
      setIsEditOrderMode(false);
      setEditedOrder([]);
    } else if (editMode === "RESET") {
      setEditedOrder(defaultOrder);
    }
  }

  // Called when the user saves the optional-facets configuration from the modal. Takes an array
  // of optional-facet fields to be visible for the currently selected search `@type`.
  function onOptionalFacetsConfigSave(visibleOptionalFacets) {
    setOptionalFacetsConfigForType(visibleOptionalFacets);
    saveOptionalFacetsConfigForType(selectedType, visibleOptionalFacets);
  }

  // Called when the user quick-hides a specific optional facet.
  function onOptionalFacetQuickHideChange(fieldToHide) {
    onOptionalFacetsConfigSave(
      optionalFacetsConfigForType.filter((field) => field !== fieldToHide)
    );
  }

  // Don't show the facet area until we know which facets are optional.
  if (isConfigPending) {
    return null;
  }

  // Show the controls for optional facets only when searching one type that allows them, and
  // that has optional facets to offer.
  const showOptionalFacetsControl =
    checkOptionalFacetsConfigurable(selectedType) &&
    allFacets.some((facet) => facet.optional);

  // Determine if we should show facets at all.
  if (facets.length > 0 || showOptionalFacetsControl) {
    return (
      <DataPanel className="mb-4 !p-0 lg:mb-0 lg:w-[18.5rem] lg:shrink-0 lg:grow-0 lg:overflow-y-auto">
        <div className="p-4">
          <div className="flex flex-col gap-1">
            {!isEditOrderMode && (
              <>
                <div className="flex gap-1">
                  <ClearAll searchResults={searchResults} />
                  <AllFacetsControls onAllFacets={onAllFacets} />
                </div>
                <ConfigFacetsControl
                  selectedType={selectedType}
                  allFacets={allFacets}
                  onEditModeChange={onEditModeChange}
                  showEditOrder={selectedType !== ""}
                  optionalFacetsConfigForType={optionalFacetsConfigForType}
                  onOptionalFacetsConfigSave={onOptionalFacetsConfigSave}
                  showOptionalFacetsControl={showOptionalFacetsControl}
                />
              </>
            )}
          </div>
          <EditOrderButton
            isEditOrderMode={isEditOrderMode}
            onEditModeChange={onEditModeChange}
          />
          <HelpTip className="mt-4">
            {!isEditOrderMode ? (
              <span>
                Click and hold a term momentarily to select items <i>without</i>{" "}
                that term.
              </span>
            ) : (
              <span>
                Drag and drop filters to change their order. Click <b>Done</b>{" "}
                when finished, or <b>Cancel</b> to revert your latest changes.
                Click <b>Reset</b> to restore the default filter order.
              </span>
            )}
          </HelpTip>
        </div>
        <FacetList
          searchResults={searchResults}
          facets={isEditOrderMode ? editedOrderedFacets : orderedFacets}
          openedFacets={effectiveOpenedFacets}
          onFacetOpen={onFacetOpen}
          onReorder={onReorder}
          isEditOrderMode={isEditOrderMode}
          optionalFacetsConfigForType={optionalFacetsConfigForType}
          onOptionalFacetQuickHideChange={onOptionalFacetQuickHideChange}
        />
      </DataPanel>
    );
  }

  // No displayable facets.
  return null;
}

FacetSection.propTypes = {
  // Search results from data provider
  searchResults: PropTypes.object.isRequired,
  // Facet config (`optional`, `category`, `description`, `title` by facet field) from the search
  // config, loaded on the server; the component loads it on the client if not supplied
  facetConfig: PropTypes.object,
};
