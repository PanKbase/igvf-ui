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
  SearchListItemSupplementSummary,
  SearchListItemTitle,
  SearchListItemType,
  SearchListItemUniqueId,
} from "./search-list-item";

export default function AnalysisSet({ item: analysisSet }) {
  // Use description if available, otherwise use summary, then fall back to file_set_type + assay_title
  function getTitle() {
    if (analysisSet.description) {
      return analysisSet.description;
    }
    if (analysisSet.summary) {
      return analysisSet.summary;
    }
    const parts = [];
    if (analysisSet.file_set_type) {
      parts.push(analysisSet.file_set_type);
    }
    if (analysisSet.assay_title) {
      parts.push(analysisSet.assay_title);
    }
    return parts.length > 0 ? parts.join(" of ") : "";
  }

  return (
    <SearchListItemContent>
      <SearchListItemMain>
        <SearchListItemUniqueId>
          <SearchListItemType item={analysisSet} />
          {analysisSet.accession}
        </SearchListItemUniqueId>
        <SearchListItemTitle>{getTitle()}</SearchListItemTitle>
        <SearchListItemMeta>
          <span key="lab">
            {Array.isArray(analysisSet.award)
              ? analysisSet.award.map(award => award.title).join(", ")
              : analysisSet.award.title
            }
          </span>
        </SearchListItemMeta>
        <SearchListItemSupplement>
          <SearchListItemSupplementAlternateAccessions item={analysisSet} />
          <SearchListItemSupplementSummary item={analysisSet} />
        </SearchListItemSupplement>
      </SearchListItemMain>
      <SearchListItemQuality item={analysisSet} />
    </SearchListItemContent>
  );
}

AnalysisSet.propTypes = {
  // Single analysis set search-result object to display on a search-result list page
  item: PropTypes.object.isRequired,
};
