// node_modules
import Link from "next/link";
import PropTypes from "prop-types";
import { useMemo } from "react";
// components
import DbxrefList from "./dbxref-list";
import SeparatedList from "./separated-list";
import Status from "./status";

export function parseHlaRow(row) {
  if (typeof row !== "string") {
    return null;
  }

  const parts = row.split(",").map((p) => p.trim()).filter(Boolean);

  const KNOWN_METHODS = new Set(["OPO", "NGS", "RT-PCR", "SSO", "."]);
  const isBlob = parts.length > 3 && KNOWN_METHODS.has(parts[2]);

  if (isBlob) {
    const rows = [];
    for (let i = 0; i + 2 < parts.length; i += 3) {
      const locus = parts[i];
      const allelePart = parts[i + 1];
      const method = parts[i + 2];
      const [a1, a2] = allelePart.split("-");
      rows.push({
        locus,
        allele1: !a1 || a1 === "." ? "—" : a1,
        allele2: !a2 || a2 === "." ? "—" : a2,
        method: method === "." ? "—" : method,
      });
    }
    return rows;
  }

  if (parts.length >= 3) {
    const [locus, allelePart, ...methodParts] = parts;
    const [a1, a2] = allelePart.split("-");
    return [{
      locus,
      allele1: !a1 || a1 === "." ? "—" : a1,
      allele2: !a2 || a2 === "." ? "—" : a2,
      method: methodParts.join(", ") || "—",
    }];
  }

  return null;
}

function formatDiabetesChipText(description) {
  if (!description || description === "-") {
    return null;
  }
  return description.replace(/\s+/g, " ").trim();
}

/** Placeholder / missing dataset_tissue groups genotyping-style rows under one heading. */
function dataAvailableTissueHeading(datasetTissue) {
  if (datasetTissue === undefined || datasetTissue === null) {
    return "Genetics";
  }
  const s = String(datasetTissue).trim();
  if (s === "" || s === "-" || s === "—") {
    return "Genetics";
  }
  return s;
}

function hba1cStatusClass(hba1c) {
  if (hba1c === undefined || hba1c === null || Number.isNaN(hba1c)) {
    return "";
  }
  if (hba1c >= 6.5) {
    return "text-red-700 dark:text-red-400";
  }
  if (hba1c >= 5.7) {
    return "text-amber-700 dark:text-amber-400";
  }
  return "text-emerald-700 dark:text-emerald-400";
}

function MetricCard({ label, value, valueClass = "", sub }) {
  return (
    <div className="min-w-[7.5rem] flex-1 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/50">
      <div className="text-sm font-semibold text-data-label dark:text-gray-400">
        {label}
      </div>
      <div
        className={`mt-1 text-base font-medium tabular-nums text-data-value ${valueClass}`}
      >
        {value}
      </div>
      {sub ? (
        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {sub}
        </div>
      ) : null}
    </div>
  );
}

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  valueClass: PropTypes.string,
  sub: PropTypes.node,
};

function FieldPair({ label, children, monoValue = false }) {
  if (children === undefined || children === null || children === "") {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
        {label}
      </dt>
      <dd
        className={`text-sm font-medium text-data-value ${monoValue ? "tabular-nums" : ""}`}
      >
        {children}
      </dd>
    </div>
  );
}

FieldPair.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  monoValue: PropTypes.bool,
};

function AutoantibodyCard({ name, positive, value, assay }) {
  const isPos = positive === true;
  const isNeg = positive === false;
  const badge = isPos ? (
    <span className="rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
      Positive
    </span>
  ) : isNeg ? (
    <span className="rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
      Negative
    </span>
  ) : (
    <span className="rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      N/A
    </span>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </span>
        {badge}
      </div>
      {value !== undefined && value !== null ? (
        <div className="mt-2 text-sm font-medium tabular-nums text-data-value">
          {value}{" "}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            unit/ml
          </span>
        </div>
      ) : (
        <div className="mt-2 text-xs text-gray-400">No value</div>
      )}
      {assay?.length > 0 ? (
        <div className="mt-1.5 text-xs leading-snug text-gray-500 dark:text-gray-400">
          {assay.join(", ")}
        </div>
      ) : null}
    </div>
  );
}

AutoantibodyCard.propTypes = {
  name: PropTypes.string.isRequired,
  positive: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  assay: PropTypes.arrayOf(PropTypes.string),
};

const T1D_METHODS = new Set(["GRS2", "T1GRS"]);

function GrsMethodCard({ entry }) {
  const { method, overall_score: overall, sub_scores: subs, metadata } = entry;
  const isT1d = T1D_METHODS.has(method);
  const isPT2d = method === "pT2D_deCorpio";
  const barPct =
    typeof overall === "number" && isT1d
      ? Math.round(Math.min(100, Math.max(0, overall * 100)))
      : null;

  const clusterSubs = useMemo(() => {
    if (!Array.isArray(subs)) {
      return [];
    }
    return subs.filter((s) =>
      String(s.label).toLowerCase().includes("cluster")
    );
  }, [subs]);

  const dominantCluster =
    clusterSubs.length === 0
      ? null
      : clusterSubs.reduce(
          (best, s) =>
            best === null || Number(s.value) > Number(best.value) ? s : best,
          null
        );

  const nonClusterSubs = useMemo(() => {
    if (!Array.isArray(subs)) {
      return [];
    }
    return subs.filter(
      (s) => !String(s.label).toLowerCase().includes("cluster")
    );
  }, [subs]);

  const legacyMhc =
    !subs?.length && entry.mhc_only !== undefined ? entry.mhc_only : null;
  const legacyNonMhc =
    !subs?.length && entry.non_mhc_only !== undefined
      ? entry.non_mhc_only
      : null;

  return (
    <details className="group rounded-lg border border-gray-200 bg-white open:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <summary className="cursor-pointer list-none rounded-lg px-4 py-3 marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
            {method}
          </span>
          <span className="text-2xl font-light tabular-nums text-gray-900 dark:text-gray-100">
            {overall}
          </span>
          {isT1d && barPct !== null ? (
            <span className="ml-auto hidden text-xs text-gray-500 sm:inline">
              0–1 scale
            </span>
          ) : null}
        </div>
        {isT1d && barPct !== null ? (
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full rounded bg-gray-800 dark:bg-gray-200"
              style={{ width: `${barPct}%` }}
              title={`${barPct}%`}
            />
          </div>
        ) : null}
      </summary>
      <div className="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800">
        {nonClusterSubs.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {nonClusterSubs.map((s) => (
              <div
                key={s.label}
                className="rounded border border-gray-100 bg-gray-50/80 px-2.5 py-2 dark:border-gray-800 dark:bg-gray-950/40"
              >
                <div className="text-xs font-semibold text-data-label dark:text-gray-400">
                  {String(s.label).replace(/_/g, " ")}
                </div>
                <div className="text-sm font-medium tabular-nums text-data-value">
                  {s.value}
                </div>
                {s.description ? (
                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {s.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {legacyMhc !== null || legacyNonMhc !== null ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {legacyMhc !== null ? (
              <div className="rounded border border-gray-100 bg-gray-50/80 px-2.5 py-2 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="text-xs font-semibold text-data-label dark:text-gray-400">
                  MHC-only
                </div>
                <div className="text-sm font-medium tabular-nums text-data-value">
                  {legacyMhc}
                </div>
              </div>
            ) : null}
            {legacyNonMhc !== null ? (
              <div className="rounded border border-gray-100 bg-gray-50/80 px-2.5 py-2 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="text-xs font-semibold text-data-label dark:text-gray-400">
                  Non-MHC-only
                </div>
                <div className="text-sm font-medium tabular-nums text-data-value">
                  {legacyNonMhc}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {isPT2d && clusterSubs.length > 0 ? (
          <div>
            <div className="mb-1.5 text-sm font-semibold text-data-label dark:text-gray-400">
              Clusters
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {clusterSubs.map((s) => {
                const isDom = dominantCluster && s.label === dominantCluster.label;
                return (
                  <div
                    key={s.label}
                    className={`rounded-md border px-2 py-2 text-center ${
                      isDom
                        ? "border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950/40"
                    }`}
                  >
                    <div className="text-xs font-semibold text-data-label dark:text-gray-400">
                      {String(s.label).replace(/_/g, " ")}
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-data-value">
                      {s.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {metadata &&
        (metadata.publication ||
          metadata.version ||
          metadata.ancestry ||
          Object.keys(metadata).length > 0) ? (
          <footer className="border-t border-gray-100 pt-2 text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {metadata.publication ? (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Publication:
                </span>{" "}
                {metadata.publication}
              </div>
            ) : null}
            {metadata.version ? (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Version:
                </span>{" "}
                {metadata.version}
              </div>
            ) : null}
            {metadata.ancestry ? (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Ancestry:
                </span>{" "}
                {metadata.ancestry}
              </div>
            ) : null}
            {Object.entries(metadata)
              .filter(
                ([key]) =>
                  !["publication", "version", "ancestry"].includes(key)
              )
              .map(([key, val]) => (
                <div key={key}>
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {key.replace(/_/g, " ")}:
                  </span>{" "}
                  {typeof val === "object" ? JSON.stringify(val) : String(val)}
                </div>
              ))}
          </footer>
        ) : null}
      </div>
    </details>
  );
}

GrsMethodCard.propTypes = {
  entry: PropTypes.object.isRequired,
};

/**
 * Clinical dashboard layout for human donor detail pages (lab-report / EHR style).
 */
export default function HumanDonorClinicalDashboard({
  item,
  diabetesStatus = [],
  otherTissue = [],
  humanDonorIdentifiers = [],
}) {
  const ge =
    item.genetic_predicted_ethnicities || item.genetic_ethnicities || [];

  const ageDisplay =
    item.age !== undefined && item.age !== null && item.age > 0
      ? `${item.age}`
      : "—";

  const bmiDisplay =
    item.bmi !== undefined && item.bmi !== null && item.bmi > 0
      ? `${item.bmi}`
      : "—";

  const hba1cVal =
    item.hba1c !== undefined && item.hba1c !== null ? Number(item.hba1c) : null;
  const hbaDisplay = hba1cVal !== null && !Number.isNaN(hba1cVal) ? hba1cItemDisplay(hba1cVal) : "—";

  const cPeptideDisplay =
    item.c_peptide !== undefined && item.c_peptide !== null
      ? String(item.c_peptide)
      : "—";

  const dmDurDisplay =
    item.diabetes_duration !== undefined && item.diabetes_duration !== null
      ? String(item.diabetes_duration)
      : "—";

  const chipText = formatDiabetesChipText(item.diabetes_status_description);

  const dataByTissue = useMemo(() => {
    if (!item.data_available?.length) {
      return {};
    }
    const map = {};
    for (const row of item.data_available) {
      const t = dataAvailableTissueHeading(row.dataset_tissue);
      if (!map[t]) {
        map[t] = [];
      }
      map[t].push(row);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.data_available]);

  const hasAab =
    item.aab_gada_value !== undefined ||
    item.aab_gada !== undefined ||
    item.aab_ia2_value !== undefined ||
    item.aab_ia2 !== undefined ||
    item.aab_iaa_value !== undefined ||
    item.aab_iaa !== undefined ||
    item.aab_znt8_value !== undefined ||
    item.aab_znt8 !== undefined;

  const hlaRows = Array.isArray(item.hla_typing)
    ? item.hla_typing.flatMap((row) => parseHlaRow(row) ?? [])
    : [];

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-12 sm:px-6 lg:px-8">
        {/* HEADER BAND */}
        <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {item.accession || "—"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              {item.status ? (
                <span className="inline-flex items-center gap-2">
                  <Status status={item.status} />
                  {item.status === "released" ? null : (
                    <span className="sr-only">{item.status}</span>
                  )}
                </span>
              ) : null}
              {item.rrid ? (
                <span>
                  <span className="text-gray-500">RRID</span>{" "}
                  <span className="font-medium text-data-value">
                    {item.rrid}
                  </span>
                </span>
              ) : null}
              {item.center_donor_id ? (
                <span>
                  <span className="text-gray-500">Program Donor ID</span>{" "}
                  <span className="font-medium text-data-value">
                    {item.center_donor_id}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {/* SUMMARY STATS */}
        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
            Clinical summary
          </h2>
          <div className="flex flex-wrap gap-3">
            {chipText ? (
              <MetricCard label="Diabetes status" value={chipText} />
            ) : null}
            <MetricCard label="BMI" value={bmiDisplay} />
            <MetricCard
              label="HbA1c %"
              value={hbaDisplay}
              valueClass={hba1cStatusClass(hba1cVal)}
            />
            <MetricCard
              label="C-Peptide (ng/ml)"
              value={cPeptideDisplay}
            />
            <MetricCard label="Diabetes duration" value={dmDurDisplay} />
          </div>
        </section>

        {/* DEMOGRAPHICS */}
        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
            Demographics
          </h2>
          <dl className="space-y-3">
            <FieldPair label="Age (y)" monoValue>
              {ageDisplay}
            </FieldPair>
            <FieldPair label="Gender">{item.gender}</FieldPair>
            <FieldPair label="Genetic sex">{item.biological_sex}</FieldPair>
            {ge.length > 0 ? (
              <FieldPair label="Predicted genetic ancestry">
                {ge.map((eth, i) => (
                  <span key={i}>
                    {eth.ethnicity}
                    {eth.percentage !== undefined
                      ? ` (${eth.percentage}%)`
                      : ""}
                    {i < ge.length - 1 ? ", " : ""}
                  </span>
                ))}
              </FieldPair>
            ) : null}
            {item.self_reported_ethnicities?.length > 0 ? (
              <FieldPair label="Reported ethnicity">
                {item.self_reported_ethnicities.join(", ")}
              </FieldPair>
            ) : null}
          </dl>
        </section>

        {/* ADDITIONAL CLINICAL */}
        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
            Additional clinical
          </h2>
          <dl className="space-y-3">
            <FieldPair label="Diabetes (ontology)">
                  {Array.isArray(diabetesStatus) && diabetesStatus.length > 0 ? (
                    <SeparatedList>
                      {diabetesStatus.map((status) => (
                        <Link key={status["@id"]} href={status["@id"]}>
                          {status.term_id}
                        </Link>
                      ))}
                    </SeparatedList>
                  ) : (
                    <span className="text-gray-500">No ontology term</span>
                  )}
                </FieldPair>
                <FieldPair label="T1D stage">{item.t1d_stage}</FieldPair>
                <FieldPair label="Derived diabetes status">
                  {item.derived_diabetes_status ? (
                    <span
                      className={
                        item.derived_diabetes_status.toLowerCase() === "diabetes"
                          ? "font-medium text-red-700 dark:text-red-400"
                          : item.derived_diabetes_status
                                .toLowerCase()
                                .includes("prediabetes")
                            ? "font-medium text-amber-700 dark:text-amber-400"
                            : item.derived_diabetes_status
                                  .toLowerCase()
                                  .includes("normal")
                              ? "text-emerald-700 dark:text-emerald-400"
                              : ""
                      }
                    >
                      {item.derived_diabetes_status}
                    </span>
                  ) : null}
                </FieldPair>
                <FieldPair label="Diabetes status (HbA1c adjusted)">
                  {item.diabetes_status_hba1c}
                </FieldPair>
                <FieldPair label="Family history of diabetes">
                  {item.family_history_of_diabetes}
                </FieldPair>
                {item.family_history_of_diabetes_relationship?.length > 0 ? (
                  <FieldPair label="Family history relationship">
                    {item.family_history_of_diabetes_relationship.join(", ")}
                  </FieldPair>
                ) : null}
                {item.other_disease_states?.length > 0 ? (
                  <FieldPair label="Other disease states">
                    {item.other_disease_states.join(", ")}
                  </FieldPair>
                ) : null}
                <FieldPair label="Living donor">
                  {item.living_donor !== undefined
                    ? item.living_donor
                      ? "Yes"
                      : "No"
                    : null}
                </FieldPair>
                <FieldPair label="Cause of death">{item.cause_of_death}</FieldPair>
                <FieldPair label="Donation type">{item.donation_type}</FieldPair>
                <FieldPair label="Hospital stay (h)">{item.hospital_stay}</FieldPair>
                {item.glucose_loweing_theraphy?.length > 0 ? (
                  <FieldPair label="Glucose lowering therapy">
                    {item.glucose_loweing_theraphy.join(", ")}
                  </FieldPair>
                ) : null}
                {item.other_theraphy?.length > 0 ? (
                  <FieldPair label="Medication">
                    {item.other_theraphy.join(", ")}
                  </FieldPair>
                ) : null}
          </dl>
        </section>

        {/* AUTOANTIBODIES */}
        {hasAab ? (
          <section>
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
              Autoantibodies
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <AutoantibodyCard
                name="GADA"
                positive={item.aab_gada}
                value={item.aab_gada_value}
                assay={item.aab_gada_assay}
              />
              <AutoantibodyCard
                name="IAA"
                positive={item.aab_iaa}
                value={item.aab_iaa_value}
                assay={item.aab_iaa_assay}
              />
              <AutoantibodyCard
                name="IA2"
                positive={item.aab_ia2}
                value={item.aab_ia2_value}
                assay={item.aab_ia2_assay}
              />
              <AutoantibodyCard
                name="ZNT8"
                positive={item.aab_znt8}
                value={item.aab_znt8_value}
                assay={item.aab_znt8_assay}
              />
            </div>
          </section>
        ) : null}

        {/* HLA */}
        {(hlaRows.length > 0 || item.hla_status) && (
          <section>
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
              HLA typing
            </h2>
            {item.hla_status ? (
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>{" "}
                {item.hla_status}
              </p>
            ) : null}
            {hlaRows.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-sm font-semibold text-data-label dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                      <th className="px-3 py-2">Locus</th>
                      <th className="px-3 py-2">Allele 1</th>
                      <th className="px-3 py-2">Allele 2</th>
                      <th className="px-3 py-2">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {hlaRows.map((r, i) => (
                      <tr
                        key={`${r.locus}-${i}`}
                        className="bg-white dark:bg-gray-950"
                      >
                        <td className="px-3 py-2 text-sm font-medium text-data-value">
                          {r.locus}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium tabular-nums text-data-value">
                          {r.allele1 || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium tabular-nums text-data-value">
                          {r.allele2 || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {r.method || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        )}

        {/* GENETIC RISK SCORE */}
        {item.genetic_risk_score?.length > 0 ? (
          <section>
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
              Genetic risk score
            </h2>
            <div className="space-y-3">
              {item.genetic_risk_score.map((entry, idx) => (
                <GrsMethodCard key={`${entry.method}-${idx}`} entry={entry} />
              ))}
            </div>
          </section>
        ) : null}

        {/* DATA AVAILABLE */}
        {item.data_available?.length > 0 ? (
          <section>
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
              Data available
            </h2>
            <div className="space-y-5">
              {Object.entries(dataByTissue).map(([tissue, rows]) => (
                <div key={tissue}>
                  <h3 className="mb-2 text-sm font-semibold text-data-label dark:text-gray-400">
                    {tissue}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {rows.map((row, i) => (
                      <div
                        key={`${row.dataset}-${i}`}
                        className="inline-flex flex-wrap items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {row.dataset}
                        </span>
                        {row.dataset_link ? (
                          <a
                            href={row.dataset_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-700 underline dark:text-blue-400"
                          >
                            Access dataset
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* SUPPLEMENTARY */}
        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
            Supplementary
          </h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            {item.collections?.length > 0 ? (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {item.collections.map((c) => {
                  const isHpap = String(c).toUpperCase().includes("HPAP");
                  return (
                    <span
                      key={c}
                      title="Collection"
                      className={`rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        isHpap
                          ? "border-amber-500 bg-amber-50 text-amber-950 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200"
                          : "border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {c}
                    </span>
                  );
                })}
              </div>
            ) : null}

            {humanDonorIdentifiers?.length > 0 ? (
              <FieldPair label="Identifiers">
                <SeparatedList isCollapsible>
                  {humanDonorIdentifiers.map((id) => (
                    <span key={id}>{id}</span>
                  ))}
                </SeparatedList>
              </FieldPair>
            ) : null}

            <dl className="grid gap-3 sm:grid-cols-2">
              <FieldPair label="Pancreas tissue available">
                {item.pancreas_tissue_available !== undefined
                  ? item.pancreas_tissue_available
                    ? "Yes"
                    : "No"
                  : null}
              </FieldPair>
              <FieldPair label="Other tissues">
                {Array.isArray(otherTissue) && otherTissue.length > 0 ? (
                  <SeparatedList>
                    {otherTissue.map((tissue) => (
                      <Link key={tissue["@id"]} href={tissue["@id"]}>
                        {tissue.term_id}
                      </Link>
                    ))}
                  </SeparatedList>
                ) : (
                  "—"
                )}
              </FieldPair>
            </dl>

            {item.publication_data?.length > 0 ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  Publication data
                </div>
                <DbxrefList dbxrefs={item.publication_data} isCollapsible />
              </div>
            ) : null}

            {item.publication_identifiers?.length > 0 ? (
              <FieldPair label="Publication identifiers">
                {item.publication_identifiers.join(", ")}
              </FieldPair>
            ) : null}

            {item.phenotypic_features?.length > 0 ? (
              <FieldPair label="Phenotypic features">
                {item.phenotypic_features.join(", ")}
              </FieldPair>
            ) : null}
            <FieldPair label="Description">{item.description}</FieldPair>
            {item.dbxrefs?.length > 0 ? (
              <div>
                <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
                  External resources
                </div>
                <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
              </div>
            ) : null}
            <FieldPair label="Identifiers (item)">
              {item.identifiers?.length > 0
                ? item.identifiers.join(", ")
                : null}
            </FieldPair>
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
          </div>
        </section>
      </div>
    </div>
  );
}

function hba1cItemDisplay(v) {
  return v.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

HumanDonorClinicalDashboard.propTypes = {
  item: PropTypes.object.isRequired,
  diabetesStatus: PropTypes.arrayOf(PropTypes.object),
  otherTissue: PropTypes.arrayOf(PropTypes.object),
  humanDonorIdentifiers: PropTypes.arrayOf(PropTypes.string),
};

HumanDonorClinicalDashboard.defaultProps = {
  diabetesStatus: [],
  otherTissue: [],
  humanDonorIdentifiers: [],
};

/** Properties rendered by this dashboard (for unknown-property handling elsewhere). */
HumanDonorClinicalDashboard.displayedProperties = [
  "accession",
  "status",
  "rrid",
  "center_donor_id",
  "gender",
  "biological_sex",
  "human_donor_identifiers",
  "genetic_predicted_ethnicities",
  "genetic_ethnicities",
  "self_reported_ethnicities",
  "diabetes_status_description",
  "age",
  "bmi",
  "hba1c",
  "c_peptide",
  "diabetes_duration",
  "diabetes_status",
  "t1d_stage",
  "derived_diabetes_status",
  "diabetes_status_hba1c",
  "family_history_of_diabetes",
  "family_history_of_diabetes_relationship",
  "other_disease_states",
  "living_donor",
  "cause_of_death",
  "donation_type",
  "hospital_stay",
  "glucose_loweing_theraphy",
  "other_theraphy",
  "aab_gada",
  "aab_gada_value",
  "aab_gada_assay",
  "aab_iaa",
  "aab_iaa_value",
  "aab_iaa_assay",
  "aab_ia2",
  "aab_ia2_value",
  "aab_ia2_assay",
  "aab_znt8",
  "aab_znt8_value",
  "aab_znt8_assay",
  "hla_typing",
  "hla_status",
  "genetic_risk_score",
  "data_available",
  "pancreas_tissue_available",
  "other_tissues_available",
  "publication_data",
  "publication_identifiers",
  "collections",
  "phenotypic_features",
  "description",
  "dbxrefs",
  "identifiers",
  "url",
];
