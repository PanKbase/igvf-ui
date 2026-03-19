// node_modules
import PropTypes from "prop-types";

/**
 * Displays the facet title for the gender field as "Gender".
 */
export default function GenderTitle({ facet }) {
  return (
    <h2
      className="mb-1 bg-facet-title text-center text-base font-medium text-facet-title"
      data-testid={`facettitle-${facet.field}`}
    >
      Gender
    </h2>
  );
}

GenderTitle.propTypes = {
  // Facet object to display the title for
  facet: PropTypes.shape({
    // Facet property name
    field: PropTypes.string.isRequired,
    // Facet title (ignored, we use "Gender" instead)
    title: PropTypes.string.isRequired,
  }).isRequired,
};
