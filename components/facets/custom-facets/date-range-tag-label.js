// node_modules
import PropTypes from "prop-types";
// lib
import { UC } from "../../../lib/constants";
import { formatLongDate, stringToDate } from "../../../lib/dates";

/**
 * Display the facet tag label for date-range terms. This handles gte:yyyy-mm-dd and lte:yyyy-mm-dd
 * and converts them to `≥ Month Day, Year` and `≤ Month Day, Year`. It also handles
 * gt:yyyy-mm-dd and lt:yyyy-mm-dd using greater-than and less-than signs. It also handles the
 * wildcard. Anything else is displayed as is to let the user delete it.
 */
export default function DateRangeTagLabel({ filter }) {
  const operatorMatch = filter.term.match(/^(gte|lte|gt|lt):(.+)/);
  if (operatorMatch) {
    const [, operatorName, value] = operatorMatch;
    const date = stringToDate(value);
    if (!isNaN(date.getTime())) {
      const operators = { gte: UC.ge, lte: UC.le, gt: ">", lt: "<" };
      return (
        <span>
          {operators[operatorName]} {formatLongDate(date)}
        </span>
      );
    }
  }

  // If the filter term is `release_timestamp=*`, display a tag with "Exists." If
  // `release_timestamp!=*`, display a tag with "None."
  if (filter.term === "*") {
    const isNegative = filter.field.endsWith("!");
    return <span>{isNegative ? "None" : "Exists"}</span>;
  }

  // If the filter term is anything else, just display the term as is to let the user delete it.
  return <span>{filter.term}</span>;
}

DateRangeTagLabel.propTypes = {
  // Filter object for the facet
  filter: PropTypes.shape({
    field: PropTypes.string.isRequired,
    term: PropTypes.string.isRequired,
  }).isRequired,
};
