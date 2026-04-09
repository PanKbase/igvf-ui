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
  FieldPair,
  MetricCard,
  PanelColumnTitle,
} from "./clinical-dashboard-primitives";
// lib
import { formatDate } from "../lib/dates";
import { truthyOrZero } from "../lib/general";

export default function PrimaryCellClinicalDashboard({
  item,
  diseaseTerms: _diseaseTerms = [],
  partOf = null,
  sampleTerms = [],
  sortedFrom = null,
  sources = [],
  treatments = [],
  children = null,
}) {
  const primaryTerm = sampleTerms?.[0];
  const subtitle = [item.taxa, primaryTerm?.term_name]
    .filter(Boolean)
    .join(" · ");

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
              {subtitle ? (
                <span className="font-medium text-data-value">{subtitle}</span>
              ) : null}
            </div>
          </div>
        </header>

        <section>
          <DashboardSectionTitle>Biosample summary</DashboardSectionTitle>
          <div className="flex flex-wrap gap-3">
            {item.taxa ? (
              <MetricCard label="Taxa" value={item.taxa} />
            ) : null}
            <MetricCard
              label="Sample Term"
              value={
                primaryTerm ? (
                  <Link
                    className="text-blue-700 dark:text-blue-400"
                    href={primaryTerm["@id"]}
                  >
                    {primaryTerm.term_name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
          </div>
        </section>

        <section>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <PanelColumnTitle>Sample Identity</PanelColumnTitle>
              <dl className="space-y-3">
                {item.taxa ? (
                  <FieldPair label="Taxa">{item.taxa}</FieldPair>
                ) : null}
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
                {truthyOrZero(item.passage_number) ? (
                  <FieldPair label="Passage Number" monoValue>
                    {item.passage_number}
                  </FieldPair>
                ) : null}
                <FieldPair label="Date Harvested">
                  {item.date_obtained ? formatDate(item.date_obtained) : null}
                </FieldPair>
                <FieldPair label="Starting Amount">
                  {truthyOrZero(item.starting_amount)
                    ? `${item.starting_amount}${
                        item.starting_amount_units
                          ? ` ${item.starting_amount_units}`
                          : ""
                      }`
                    : null}
                </FieldPair>
                <FieldPair label="Cellular Sub Pool">{item.cellular_sub_pool}</FieldPair>
                <FieldPair label="Part of Sample">
                  {partOf ? (
                    <Link href={partOf["@id"]}>{partOf.accession}</Link>
                  ) : null}
                </FieldPair>
              </dl>
            </div>
            <div>
              <PanelColumnTitle>Clinical</PanelColumnTitle>
              <dl className="space-y-3">
                {_diseaseTerms?.length > 0 ? (
                  <FieldPair label="Disease Terms">
                    <SeparatedList>
                      {_diseaseTerms.map((t) => (
                        <Link key={t["@id"]} href={t["@id"]}>
                          {t.term_name}
                        </Link>
                      ))}
                    </SeparatedList>
                  </FieldPair>
                ) : null}
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
                <FieldPair label="NIH Institutional Certification">
                  {item.nih_institutional_certification}
                </FieldPair>
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
              </dl>
            </div>
          </div>
        </section>

        <BiosampleTreatmentsSection treatments={treatments} />
        {children}

        <section>
          <DashboardSectionTitle>Additional information</DashboardSectionTitle>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <FieldPair label="Description">{item.description}</FieldPair>
            {item.dbxrefs?.length > 0 ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  External resources
                </div>
                <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
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
            <FieldPair label="Submitter Comment">{item.submitter_comment}</FieldPair>
            <FieldPair label="Revoke Detail">{item.revoke_detail}</FieldPair>
            {item.publication_identifiers?.length > 0 ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  Publication identifiers
                </div>
                <DbxrefList
                  dbxrefs={item.publication_identifiers}
                  isCollapsible
                />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

PrimaryCellClinicalDashboard.propTypes = {
  item: PropTypes.object.isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object),
  partOf: PropTypes.object,
  sampleTerms: PropTypes.arrayOf(PropTypes.object),
  sortedFrom: PropTypes.object,
  sources: PropTypes.arrayOf(PropTypes.object),
  treatments: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};

PrimaryCellClinicalDashboard.defaultProps = {
  diseaseTerms: [],
  partOf: null,
  sampleTerms: [],
  sortedFrom: null,
  sources: [],
  treatments: [],
  children: null,
};
