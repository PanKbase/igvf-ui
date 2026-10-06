// components/facets/custom-facets
import AnnotationTypeTagLabel from "./custom-facets/annotation-type-tag-label";
import AnnotationTypeTermLabel from "./custom-facets/annotation-type-term-label";
import AuditTitle from "./custom-facets/audit-title";
import DateRangeTagLabel from "./custom-facets/date-range-tag-label";
import DateRangeTerms from "./custom-facets/date-range-terms";
import DeComparisonClassTagLabel from "./custom-facets/de-comparison-class-tag-label";
import DeComparisonClassTermLabel from "./custom-facets/de-comparison-class-term-label";
import DeMethodTagLabel from "./custom-facets/de-method-tag-label";
import DeMethodTermLabel from "./custom-facets/de-method-term-label";
import GenderTitle from "./custom-facets/gender-title";
import InternalActionAuditTerms from "./custom-facets/audit-internal-action-terms";
import NoTermCountTitle from "./custom-facets/no-term-count-title";
import StandardTagLabel from "./custom-facets/standard-tag-label";
import StandardTermLabel from "./custom-facets/standard-term-label";
import StandardTerms from "./custom-facets/standard-terms";
import StandardTitle from "./custom-facets/standard-title";
import TaxaTagLabel from "./custom-facets/taxa-tag-label";
import TaxaTermLabel from "./custom-facets/taxa-term-label";
import TypeTerm from "./custom-facets/type-terms";

/**
 * Registry of custom facet components for the term label, terms (basically the entire facet sans
 * title), and the facet title. The keys within each section are the facet field names, and the
 * values are the custom component to use for that facet. Sort each section by the alphabetically
 * by key, but with `standard` at the end.
 */
const facetRegistry = {
  // Custom tag labels.
  tagLabel: {
    annotation_type: AnnotationTypeTagLabel,
    creation_timestamp: DateRangeTagLabel,
    de_comparison_class: DeComparisonClassTagLabel,
    de_method: DeMethodTagLabel,
    "donors.taxa": TaxaTagLabel,
    release_timestamp: DateRangeTagLabel,
    taxa: TaxaTagLabel,
    standard: StandardTagLabel,
  },

  // Custom term labels and document counts for a standard facet term.
  termLabel: {
    annotation_type: AnnotationTypeTermLabel,
    de_comparison_class: DeComparisonClassTermLabel,
    de_method: DeMethodTermLabel,
    "donors.taxa": TaxaTermLabel,
    taxa: TaxaTermLabel,
    standard: StandardTermLabel,
  },

  // Custom terms, basically controlling the appearance of the entire facet sans title.
  terms: {
    "audit.INTERNAL_ACTION.category": InternalActionAuditTerms,
    creation_timestamp: DateRangeTerms,
    release_timestamp: DateRangeTerms,
    type: TypeTerm,
    standard: StandardTerms,
  },

  // Custom facet titles.
  title: {
    "audit.ERROR.category": AuditTitle,
    "audit.INTERNAL_ACTION.category": AuditTitle,
    "audit.NOT_COMPLIANT.category": AuditTitle,
    "audit.WARNING.category": AuditTitle,
    creation_timestamp: NoTermCountTitle,
    gender: GenderTitle,
    release_timestamp: NoTermCountTitle,
    standard: StandardTitle,
  },
};

facetRegistry.tagLabel.lookup = function (field) {
  return facetRegistry.tagLabel[field] || facetRegistry.tagLabel.standard;
};

facetRegistry.termLabel.lookup = function (field) {
  return facetRegistry.termLabel[field] || facetRegistry.termLabel.standard;
};

facetRegistry.terms.lookup = function (field) {
  return facetRegistry.terms[field] || facetRegistry.terms.standard;
};

facetRegistry.title.lookup = function (field) {
  return facetRegistry.title[field] || facetRegistry.title.standard;
};

export default facetRegistry;
