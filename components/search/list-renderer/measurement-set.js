// node_modules
import PropTypes from "prop-types";
// components/search/list-renderer
import {
  SearchListItemContent,
  SearchListItemMain,
  SearchListItemMeta,
  SearchListItemQuality,
  SearchListItemSupplement,
  SearchListItemSupplementAlternateAccessions,
  SearchListItemSupplementContent,
  SearchListItemSupplementLabel,
  SearchListItemSupplementSection,
  SearchListItemTitle,
  SearchListItemType,
  SearchListItemUniqueId,
} from "./search-list-item";

function measurementSetAssayLabel(item) {
  const term = item.assay_term;
  if (term?.term_name !== undefined && term.term_name !== null) {
    return Array.isArray(term.term_name)
      ? term.term_name.filter(Boolean).join(", ")
      : String(term.term_name);
  }
  if (item.preferred_assay_title) {
    return item.preferred_assay_title;
  }
  return "";
}

export default function MeasurementSet({ item: measurementSet }) {
  // Collect the summary of the sample object in the measurement set if available. MeasurementSet
  // objects can have zero or one sample object, so we only need to check the first one.
  const sampleSummary = measurementSet.samples?.[0].summary || "";
  const isSupplementsVisible =
    measurementSet.alternate_accessions?.length > 0 || sampleSummary;
  const assayLabel = measurementSetAssayLabel(measurementSet);

  return (
    <SearchListItemContent>
      <SearchListItemMain>
        <SearchListItemUniqueId>
          <SearchListItemType item={measurementSet} />
          {measurementSet.accession}
        </SearchListItemUniqueId>
        <SearchListItemTitle>{measurementSet.summary}</SearchListItemTitle>
        <SearchListItemMeta>
          {assayLabel ? <div key="assay">{assayLabel}</div> : null}
        </SearchListItemMeta>
        {isSupplementsVisible && (
          <SearchListItemSupplement>
            <SearchListItemSupplementAlternateAccessions
              item={measurementSet}
            />
            {sampleSummary && (
              <SearchListItemSupplementSection>
                <SearchListItemSupplementLabel>
                  Sample Summary
                </SearchListItemSupplementLabel>
                <SearchListItemSupplementContent>
                  {sampleSummary}
                </SearchListItemSupplementContent>
              </SearchListItemSupplementSection>
            )}
          </SearchListItemSupplement>
        )}
      </SearchListItemMain>
      <SearchListItemQuality item={measurementSet} />
    </SearchListItemContent>
  );
}

MeasurementSet.propTypes = {
  // Single measurement set search-result object to display on a search-result list page
  item: PropTypes.object.isRequired,
};
