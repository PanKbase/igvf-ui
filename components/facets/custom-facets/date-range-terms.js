/**
 * Displays a date-range facet as a button that displays the current active date range. When the
 * button is clicked, a modal opens that allows the user to select a new date range.
 */

// node_modules
import PropTypes from "prop-types";
import { useState } from "react";
import { DateRange } from "react-date-range";
// components
import { Button } from "../../form-elements";
import Modal from "../../modal";
// components/facets/custom-facets
import { getFacetDateRange, getFilterDateRange } from "./date-range-lib";
// lib
import {
  dateToDateOnly,
  formatLongDate,
  getSystemDateRange,
} from "../../../lib/dates";
import QueryString from "../../../lib/query-string";
import { splitPathAndQueryString } from "../../../lib/query-utils";
// root
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/**
 * Display a modal containing a date-range picker. The user can select a new date range, and the
 * modal calls `onDateRangeChange` with the new start and end dates when the user clicks the
 * "Apply" button. The modal closes without changes when the user clicks the "Cancel" button.
 */
function DateRangeModal({
  startDate,
  endDate,
  startLimit,
  endLimit,
  onClose,
  onDateRangeChange,
}) {
  const [dateRange, setDateRange] = useState([
    {
      startDate,
      endDate,
      key: "selection",
    },
  ]);

  // The date-range picker doesn't render during a Jest test, so we can't test this function.
  /* istanbul ignore next */
  function handleDateRangeChange(item) {
    setDateRange([item.selection]);
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      widthClasses="w-fit"
      testid="date-range-modal"
    >
      <DateRange
        onChange={handleDateRangeChange}
        editableDateInputs
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={dateRange}
        rangeColors={["#219197"]}
        minDate={startLimit}
        maxDate={endLimit}
        direction="vertical"
        scroll={{ enabled: true }}
      />
      <Modal.Footer>
        <Button type="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() =>
            onDateRangeChange(dateRange[0].startDate, dateRange[0].endDate)
          }
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DateRangeModal.propTypes = {
  // Start date of the range
  startDate: PropTypes.instanceOf(Date).isRequired,
  // End date of the range
  endDate: PropTypes.instanceOf(Date).isRequired,
  // Earliest date that can be selected
  startLimit: PropTypes.instanceOf(Date).isRequired,
  // Latest date that can be selected
  endLimit: PropTypes.instanceOf(Date).isRequired,
  // Called when the modal closes without applying changes
  onClose: PropTypes.func.isRequired,
  // Called with the new start and end dates when the user applies a new date range
  onDateRangeChange: PropTypes.func.isRequired,
};

/**
 * Display a date-range facet as a button that displays the current active date range. When the
 * button is clicked, a modal opens that allows the user to select a new date range.
 */
export default function DateRangeTerms({ searchResults, facet, updateQuery }) {
  // True if the date range modal is open
  const [isOpen, setIsOpen] = useState(false);

  // Extract the date-range terms from the facet and the filters, falling back to the system
  // limits when neither has dates.
  const [earliestFacetDate, latestFacetDate] = getFacetDateRange(facet);
  const [earliestFilterDate, latestFilterDate] = getFilterDateRange(
    facet.field,
    searchResults.filters
  );
  const { startLimit, endLimit } = getSystemDateRange();
  const startDate = earliestFilterDate || earliestFacetDate || startLimit;
  const endDate = latestFilterDate || latestFacetDate || endLimit;

  // Called when the user applies a new date range from the modal, or resets the date range when
  // both dates are null.
  function onDateRangeApply(newStartDate, newEndDate) {
    const { queryString } = splitPathAndQueryString(searchResults["@id"]);
    const query = new QueryString(queryString);

    // Remove any old date-range elements.
    query.deleteKeyValue(facet.field);
    query.deleteKeyValue("from");

    if (newStartDate && newEndDate) {
      query.addKeyValue(facet.field, `gte:${dateToDateOnly(newStartDate)}`);
      query.addKeyValue(facet.field, `lte:${dateToDateOnly(newEndDate)}`);
    }
    updateQuery(query.format());
  }

  // Convert dateRange start and end dates to human-readable format in long form, e.g. November 11,
  // 1918.
  const humanReadableStartDate = formatLongDate(startDate);
  const humanReadableEndDate = formatLongDate(endDate);

  return (
    <>
      <div className="flex flex-col justify-center gap-1 p-2">
        <button
          className="flex w-full rounded border border-button-secondary bg-button-secondary fill-button-secondary px-2 py-1 text-button-secondary"
          onClick={() => setIsOpen(true)}
          data-testid={`date-range-trigger-${facet.field}`}
          aria-label={`${facet.title} range from ${humanReadableStartDate} to ${humanReadableEndDate}`}
        >
          <div className="w-1/2 text-left">
            <div className="text-xs">From</div>
            <div className="text-xs font-semibold">
              {humanReadableStartDate}
            </div>
          </div>
          <div className="w-1/2 text-left">
            <div className="text-xs">To</div>
            <div className="text-xs font-semibold">{humanReadableEndDate}</div>
          </div>
        </button>
        <Button
          size="sm"
          type="secondary"
          id={`date-range-reset-${facet.field}`}
          onClick={() => onDateRangeApply(null, null)}
        >
          Reset Date Range
        </Button>
      </div>
      {isOpen && (
        <DateRangeModal
          onClose={() => setIsOpen(false)}
          startDate={startDate}
          endDate={endDate}
          startLimit={startLimit}
          endLimit={endLimit}
          onDateRangeChange={(newStartDate, newEndDate) => {
            setIsOpen(false);
            onDateRangeApply(newStartDate, newEndDate);
          }}
        />
      )}
    </>
  );
}

DateRangeTerms.propTypes = {
  // Search results that include the facet
  searchResults: PropTypes.shape({
    "@id": PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
  }).isRequired,
  // Date-range facet to display
  facet: PropTypes.shape({
    field: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    terms: PropTypes.array,
  }).isRequired,
  // Called with the new query string when the user selects a new date range
  updateQuery: PropTypes.func.isRequired,
};
