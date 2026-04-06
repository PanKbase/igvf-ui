// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
// components
import BiosampleTreatmentsSection from "./biosample-treatments-section";
import DbxrefList from "./dbxref-list";
import SeparatedList from "./separated-list";
import Status from "./status";
import {
  DashboardSectionTitle,
  DiagnosisBadge,
  FieldPair,
  MetricCard,
  PanelColumnTitle,
  formatDiagnosisChipText,
} from "./clinical-dashboard-primitives";
// lib
import { formatDate } from "../lib/dates";
import { truthyOrZero } from "../lib/general";

function hasPassageNumber(v) {
  if (v === undefined || v === null) {
    return false;
  }
  return String(v).trim() !== "";
}

export default function HumanBetaCellLineClinicalDashboard({
  item,
  diseaseTerms = [],
  sources = [],
  partOf = null,
  sampleTerms = [],
  sortedFrom = null,
  treatments = [],
}) {
  const diagnosisChip = formatDiagnosisChipText(item.diabetes_status_description);
  const lotProductSubtitle = [
    item.sample_name,
    [item.lot_id, item.product_id].filter(Boolean).join(" / "),
  ]
    .filter(Boolean)
    .join(" · ");

  const cellDensityDisplay = [item.cell_density, item.cell_density_units]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-12 sm:px-6 lg:px-8">
        <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {item.accession || "—"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              {item.status ? (
                <span className="inline-flex items-center gap-2">
                  <Status status={item.status} />
                </span>
              ) : null}
              {lotProductSubtitle ? (
                <span className="font-medium text-data-value">
                  {lotProductSubtitle}
                </span>
              ) : null}
              {diagnosisChip ? <DiagnosisBadge text={diagnosisChip} /> : null}
            </div>
          </div>
        </header>

        <section>
          <DashboardSectionTitle>Sample summary</DashboardSectionTitle>
          <div className="flex flex-wrap gap-3">
            <MetricCard label="Sample Name" value={item.sample_name || "—"} />
            <MetricCard
              label="Classification"
              value={
                item.classifications?.length
                  ? item.classifications.join(", ")
                  : "—"
              }
            />
          </div>
        </section>

        <section>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <PanelColumnTitle>Identity</PanelColumnTitle>
              <dl className="space-y-3">
                <FieldPair label="Taxa">{item.taxa}</FieldPair>
                <FieldPair label="Sex">{item.gender}</FieldPair>
                <FieldPair label="Age">{item.age}</FieldPair>
                {hasPassageNumber(item.passage_number) ? (
                  <FieldPair label="Passage Number" monoValue>
                    {item.passage_number}
                  </FieldPair>
                ) : null}
                <FieldPair label="Date Obtained">
                  {item.date_obtained ? formatDate(item.date_obtained) : null}
                </FieldPair>
                <FieldPair label="Date Harvested">
                  {item.date_harvested ? formatDate(item.date_harvested) : null}
                </FieldPair>
                <FieldPair label="Cell Density">{cellDensityDisplay || null}</FieldPair>
                {truthyOrZero(item.year_obtained) ? (
                  <FieldPair label="Year Obtained" monoValue>
                    {item.year_obtained}
                  </FieldPair>
                ) : null}
              </dl>
            </div>
            <div>
              <PanelColumnTitle>Clinical &amp; culture</PanelColumnTitle>
              <dl className="space-y-3">
                <FieldPair label="Disease Terms">
                  {diseaseTerms?.length > 0 ? (
                    <SeparatedList>
                      {diseaseTerms.map((t) => (
                        <Link key={t["@id"]} href={t["@id"]}>
                          {t.term_name}
                        </Link>
                      ))}
                    </SeparatedList>
                  ) : (
                    <span className="text-gray-500">No ontology term</span>
                  )}
                </FieldPair>
                <FieldPair label="Growth Medium">{item.growth_medium}</FieldPair>
                <FieldPair label="Coating Condition">
                  {item.coating_condition}
                </FieldPair>
                <FieldPair label="Excision Status">{item.excision_status}</FieldPair>
                <FieldPair label="Authentication">{item.authentication}</FieldPair>
                <FieldPair label="Nucleic Acid Delivery">
                  {item.nucleic_acid_delivery}
                </FieldPair>
              </dl>
            </div>
          </div>
        </section>

        <section>
          <DashboardSectionTitle>Provenance</DashboardSectionTitle>
          <dl className="space-y-3">
            <FieldPair label="Sources">
              {sources?.length > 0 ? (
                <SeparatedList>
                  {sources.map((s) => (
                    <Link key={s["@id"]} href={s["@id"]}>
                      {s.title}
                    </Link>
                  ))}
                </SeparatedList>
              ) : null}
            </FieldPair>
            <FieldPair label="Sample Terms">
              {sampleTerms?.length > 0 ? (
                <SeparatedList>
                  {sampleTerms.map((t) => (
                    <Link key={t["@id"]} href={t["@id"]}>
                      {t.term_name}
                    </Link>
                  ))}
                </SeparatedList>
              ) : null}
            </FieldPair>
            <FieldPair label="Part of Sample">
              {partOf ? (
                <Link href={partOf["@id"]}>{partOf.accession}</Link>
              ) : null}
            </FieldPair>
            <FieldPair label="NIH Institutional Certification">
              {item.nih_institutional_certification}
            </FieldPair>
            <FieldPair label="Cellular Sub Pool">{item.cellular_sub_pool}</FieldPair>
            <FieldPair label="Sorted From Sample">
              {sortedFrom ? (
                <>
                  <Link href={sortedFrom["@id"]}>{sortedFrom.accession}</Link>
                  {item.sorted_from_detail ? (
                    <> {item.sorted_from_detail}</>
                  ) : null}
                </>
              ) : null}
            </FieldPair>
            <FieldPair label="Lot ID">{item.lot_id}</FieldPair>
            <FieldPair label="Product ID">{item.product_id}</FieldPair>
            {truthyOrZero(item.vendor_passage) ? (
              <FieldPair label="Vendor Passage" monoValue>
                {item.vendor_passage}
              </FieldPair>
            ) : null}
          </dl>
        </section>

        <BiosampleTreatmentsSection treatments={treatments} />

        <section>
          <DashboardSectionTitle>Additional information</DashboardSectionTitle>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <FieldPair label="Description">{item.description}</FieldPair>
            {item.url ? (
              <FieldPair label="URL">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-700 dark:text-blue-400"
                >
                  {item.url}
                </a>
              </FieldPair>
            ) : null}
            <FieldPair label="Submitter Comment">{item.submitter_comment}</FieldPair>
            {item.dbxrefs?.length > 0 ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  External resources
                </div>
                <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
              </div>
            ) : null}
            {item.publication_identifiers?.some((id) =>
              String(id).startsWith("PMID:")
            ) ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  Publications
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {item.publication_identifiers
                    .filter((id) => String(id).startsWith("PMID:"))
                    .map((pmid) => {
                      const n = String(pmid).replace(/^PMID:/i, "");
                      return (
                        <a
                          key={pmid}
                          href={`https://pubmed.ncbi.nlm.nih.gov/${n}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 dark:text-blue-400"
                        >
                          {pmid}
                        </a>
                      );
                    })}
                </div>
              </div>
            ) : null}
            {item.publication_identifiers?.some(
              (id) => !String(id).startsWith("PMID:")
            ) ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  Publication identifiers
                </div>
                <DbxrefList
                  dbxrefs={item.publication_identifiers.filter(
                    (id) => !String(id).startsWith("PMID:")
                  )}
                  isCollapsible
                />
              </div>
            ) : null}
            {item.protocols?.length > 0 ? (
              <FieldPair label="Protocols">
                <SeparatedList>
                  {item.protocols.map((p) => (
                    <a
                      key={p}
                      href={p}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 dark:text-blue-400"
                    >
                      {p}
                    </a>
                  ))}
                </SeparatedList>
              </FieldPair>
            ) : null}
            <FieldPair label="Revoke Detail">{item.revoke_detail}</FieldPair>
          </div>
        </section>
      </div>
    </div>
  );
}

HumanBetaCellLineClinicalDashboard.propTypes = {
  item: PropTypes.object.isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object),
  sources: PropTypes.arrayOf(PropTypes.object),
  partOf: PropTypes.object,
  sampleTerms: PropTypes.arrayOf(PropTypes.object),
  sortedFrom: PropTypes.object,
  treatments: PropTypes.arrayOf(PropTypes.object),
};

HumanBetaCellLineClinicalDashboard.defaultProps = {
  diseaseTerms: [],
  sources: [],
  partOf: null,
  sampleTerms: [],
  sortedFrom: null,
  treatments: [],
};
