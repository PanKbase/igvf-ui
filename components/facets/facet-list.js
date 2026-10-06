// node_modules
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Fragment } from "react";
// components
import {
  standardAnimationTransition,
  standardAnimationVariants,
} from "../animation";
// components/facets
import Facet from "./facet";
import facetRegistry from "./facet-registry";
// lib
import { splitPathAndQueryString } from "../../lib/query-utils";

/**
 * Displays all the facets in a flat list. Each facet appears collapsed or expanded according to
 * `openedFacets`. It also handles the user clicking on a facet term to add or remove it from the
 * search query, and navigates to the URL with the updated query string. While editing the facet
 * order, the facets appear without their terms and the user can drag them into a new order.
 */
export function FacetList({
  searchResults,
  facets,
  openedFacets,
  onFacetOpen,
  onReorder = () => {},
  optionalFacetsConfigForType = [],
  onOptionalFacetQuickHideChange = () => {},
  isEditOrderMode = false,
}) {
  const router = useRouter();
  const { path } = splitPathAndQueryString(searchResults["@id"]);

  // When a user selection in the facet terms changes, receive the updated query string and
  // navigate to the new URL without scrolling to the top of the page.
  function updateQuery(queryString) {
    router.push(`${path}?${queryString}`, undefined, { scroll: false });
  }

  // Wrapper components that conditionally render Reorder or Fragment.
  const ListWrapper = isEditOrderMode ? Reorder.Group : "div";
  const ItemWrapper = isEditOrderMode ? Reorder.Item : Fragment;

  const listProps = isEditOrderMode
    ? {
        axis: "y",
        values: facets,
        onReorder,
        className: "isolate",
      }
    : {};

  return (
    <ListWrapper {...listProps}>
      {facets.map((facet) => {
        const Terms = facetRegistry.terms.lookup(facet.field);
        const isFacetOpen =
          !isEditOrderMode && Boolean(openedFacets[facet.field]);
        const itemProps = isEditOrderMode
          ? {
              value: facet,
              style: { boxShadow: "0 0 0 rgba(0,0,0,0)" },
              className: "relative",
              whileDrag: {
                zIndex: 200,
                scale: 1.02,
                boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                borderBottom: "1px solid var(--color-panel-border)",
              },
            }
          : {};

        return (
          <ItemWrapper key={facet.field} {...itemProps}>
            <Facet
              facet={facet}
              searchResults={searchResults}
              updateQuery={updateQuery}
              updateOpen={(e) => onFacetOpen(e, facet.field)}
              onOptionalFacetQuickHideChange={onOptionalFacetQuickHideChange}
              isFacetOpen={isFacetOpen}
              isEditOrderMode={isEditOrderMode}
              isOptional={
                Boolean(facet.optional) &&
                optionalFacetsConfigForType.includes(facet.field)
              }
            >
              <AnimatePresence>
                {isFacetOpen && (
                  <motion.div
                    data-testid={`facet-terms-${facet.field}`}
                    className="overflow-hidden"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    transition={standardAnimationTransition}
                    variants={standardAnimationVariants}
                  >
                    <div className="px-2 py-2">
                      <Terms
                        facet={facet}
                        searchResults={searchResults}
                        updateQuery={updateQuery}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Facet>
          </ItemWrapper>
        );
      })}
    </ListWrapper>
  );
}

FacetList.propTypes = {
  // Search results from the data provider
  searchResults: PropTypes.object.isRequired,
  // Facets to display in the list, in display order
  facets: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  // Maps facet fields to true if the facet is open
  openedFacets: PropTypes.objectOf(PropTypes.bool).isRequired,
  // Called with the click event and facet field when the user opens or closes a facet
  onFacetOpen: PropTypes.func.isRequired,
  // Called with the reordered facets when the user drags facets in edit-order mode
  onReorder: PropTypes.func,
  // Fields of the optional facets the user chose to display
  optionalFacetsConfigForType: PropTypes.arrayOf(PropTypes.string),
  // Called with the facet field when the user hides an optional facet with its quick-hide button
  onOptionalFacetQuickHideChange: PropTypes.func,
  // True when editing the facet order
  isEditOrderMode: PropTypes.bool,
};
