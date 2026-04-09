// node_modules
import PropTypes from "prop-types";
// components
import Collections from "./collections";
import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "./data-area";
//import SeparatedList from "./separated-list";

function hasVisibleAttribution(attribution) {
  if (!attribution) {
    return false;
  }
  if (attribution.collections?.length > 0) {
    return true;
  }
  if (attribution.title) {
    return true;
  }
  return false;
}

/**
 * Displays the attribution properties of an item in its own data panel, typically from a data
 * object with a defined schema.
 */
export default function Attribution({ attribution = null }) {
  if (!hasVisibleAttribution(attribution)) {
    return null;
  }
  return (
    <>
      <DataAreaTitle>Attribution</DataAreaTitle>
      <DataPanel>
        <Collections
          collections={attribution.collections}
          itemType={attribution.type}
        />
        {attribution.title ? (
          <DataArea>
            <DataItemLabel>Title</DataItemLabel>
            <DataItemValue>{attribution.title}</DataItemValue>
          </DataArea>
        ) : null}
      </DataPanel>
    </>
  );
}

Attribution.propTypes = {
  // attribution object needed for attribution panel
  attribution: PropTypes.object,
};
