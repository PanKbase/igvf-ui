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
  YesNoBadge,
  coldIschaemiaClass,
  pmiElevatedClass,
  viabilityHighClass,
} from "./clinical-dashboard-primitives";
// lib
import { formatDate } from "../lib/dates";
import { hasValue } from "../lib/general";
import {
  getPrimaryIsletPhase,
  primaryIsletBiosampleTypeDisplay,
} from "../lib/primary-islet-phase";

/** `post_shipment_*` keys rendered explicitly (exclude from generic `post_shipment_*` fallback). */
const EXPLICIT_POST_SHIPMENT_KEYS = new Set([
  "post_shipment_islet_viability",
  "post_shipment_viability_qualitative",
  "post_shipment_viability_quantitative",
  "post_shipment_purity",
  "post_shipment_culture_time",
  "post_shipment_culture_media",
  "post_shipment_culture_temperature",
]);

const CCF_EUI_HREF = "https://portal.hubmapconsortium.org/ccf-eui";

function isBoolDefined(val) {
  return val !== null && val !== undefined;
}

function SectionEmptyHint({ text }) {
  return (
    <p className="text-sm italic text-gray-500 dark:text-gray-400">{text}</p>
  );
}

SectionEmptyHint.propTypes = {
  text: PropTypes.string.isRequired,
};

function SubsectionHint({ children }) {
  return (
    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{children}</p>
  );
}

SubsectionHint.propTypes = {
  children: PropTypes.node.isRequired,
};

function BooleanFieldRow({ label, value }) {
  if (!isBoolDefined(value)) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
        {label}
      </dt>
      <dd>
        <YesNoBadge value={value} />
      </dd>
    </div>
  );
}

BooleanFieldRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
};

function FacsLinks({ urls }) {
  if (!urls?.length) {
    return null;
  }
  return (
    <SeparatedList>
      {urls.map((u) => (
        <a
          key={u}
          href={u}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 dark:text-blue-400"
        >
          {u}
        </a>
      ))}
    </SeparatedList>
  );
}

FacsLinks.propTypes = {
  urls: PropTypes.arrayOf(PropTypes.string),
};

function formatPurityFirstPercent(purity) {
  if (!Array.isArray(purity) || purity.length === 0) {
    return null;
  }
  const p0 = purity[0];
  if (!hasValue(p0)) {
    return null;
  }
  const s = String(p0).trim();
  if (s.endsWith("%")) {
    return s;
  }
  return `${s}%`;
}

function formatInstitutionalCertificates(item) {
  const v = item.institutional_certificates;
  if (hasValue(v)) {
    if (Array.isArray(v)) {
      return v.map((x) => (typeof x === "object" ? JSON.stringify(x) : String(x))).join(", ");
    }
    return typeof v === "object" ? JSON.stringify(v) : String(v);
  }
  if (hasValue(item.nih_institutional_certification)) {
    return item.nih_institutional_certification;
  }
  return null;
}

function postShipmentExtraDisplay(v) {
  if (!hasValue(v)) {
    return null;
  }
  if (Array.isArray(v)) {
    return v.length ? v.join(", ") : null;
  }
  if (typeof v === "object") {
    return JSON.stringify(v);
  }
  return String(v);
}

export default function PrimaryIsletClinicalDashboard({
  item,
  diseaseTerms = [],
  donors = [],
  partOf = null,
  sampleTerms = [],
  treatments = [],
  children = null,
}) {
  const prepViabilityClass = viabilityHighClass(item.prep_viability);
  const coldClass = coldIschaemiaClass(item.cold_ischaemia_time);
  const warmIschemiaClass = coldIschaemiaClass(item.warm_ischaemia_duration);
  const pmiClass = pmiElevatedClass(item.pmi);

  const preservationDisplay = Array.isArray(item.preservation_method)
    ? item.preservation_method.join(", ")
    : item.preservation_method;

  const facsPurificationUrls = Array.isArray(item.facs_purification)
    ? item.facs_purification.filter(
        (u) =>
          u !== null &&
          u !== undefined &&
          String(u).trim() !== "" &&
          String(u).trim() !== "—"
      )
    : [];

  const postShipmentExtraKeys = Object.keys(item).filter(
    (k) =>
      k.startsWith("post_shipment_") && !EXPLICIT_POST_SHIPMENT_KEYS.has(k)
  );

  const institutionalDisplay = formatInstitutionalCertificates(item);

  // --- Isolation metrics rows ---
  const isolationRows = [];
  if (hasValue(item.prep_viability)) {
    isolationRows.push(
      <FieldPair key="prep_viability" label="Pre-shipment Islet Viability (%)">
        <span className={prepViabilityClass}>{item.prep_viability}</span>
      </FieldPair>
    );
  }
  const purityFirst = formatPurityFirstPercent(item.purity);
  if (purityFirst) {
    isolationRows.push(
      <FieldPair key="purity" label="Pre-shipment Islet Purity (%)">
        {purityFirst}
      </FieldPair>
    );
  }
  if (hasValue(item.pre_shipment_culture_time)) {
    isolationRows.push(
      <FieldPair key="pre_culture_t" label="Pre-shipment Culture Time (hours)">
        {item.pre_shipment_culture_time}
      </FieldPair>
    );
  }
  if (hasValue(item.pre_shipment_culture_media)) {
    isolationRows.push(
      <FieldPair key="pre_culture_m" label="Pre-shipment Culture Media">
        {item.pre_shipment_culture_media}
      </FieldPair>
    );
  }
  if (hasValue(item.pre_shipment_culture_temperature)) {
    isolationRows.push(
      <FieldPair
        key="pre_culture_temp"
        label="Pre-shipment Culture Temperature (ºC)"
      >
        {item.pre_shipment_culture_temperature}
      </FieldPair>
    );
  }
  if (hasValue(item.cold_ischaemia_time)) {
    isolationRows.push(
      <FieldPair key="cold_isch" label="Cold Ischaemia Time (hours)">
        <span className={coldClass}>{item.cold_ischaemia_time}</span>
      </FieldPair>
    );
  }
  if (hasValue(item.warm_ischaemia_duration)) {
    isolationRows.push(
      <FieldPair key="warm_isch" label="Warm Ischaemia Duration (hours)">
        <span className={warmIschemiaClass}>{item.warm_ischaemia_duration}</span>
      </FieldPair>
    );
  }
  if (hasValue(item.digest_time)) {
    isolationRows.push(
      <FieldPair key="digest" label="Pancreas Digest Time (hours)">
        {item.digest_time}
      </FieldPair>
    );
  }
  if (hasValue(item.percentage_trapped)) {
    isolationRows.push(
      <FieldPair key="pct_trap" label="Percentage Trapped (%)">
        {`${item.percentage_trapped}`.replace(/%$/, "")}%
      </FieldPair>
    );
  }
  if (hasValue(item.islet_yield)) {
    isolationRows.push(
      <FieldPair key="yield" label="Islet Yield (IEQ)">
        {item.islet_yield}
      </FieldPair>
    );
  }
  if (hasValue(item.pancreas_weight)) {
    isolationRows.push(
      <FieldPair key="panc_w" label="IEQ/Pancreas Weight (grams)">
        {item.pancreas_weight}
      </FieldPair>
    );
  }
  if (hasValue(item.date_obtained)) {
    isolationRows.push(
      <FieldPair key="harvest" label="Date Harvested">
        {formatDate(item.date_obtained)}
      </FieldPair>
    );
  }
  if (facsPurificationUrls.length > 0) {
    isolationRows.push(
      <FieldPair key="facs" label="FACS Purification">
        <FacsLinks urls={facsPurificationUrls} />
      </FieldPair>
    );
  }
  if (item.purity_assay?.length > 0) {
    isolationRows.push(
      <FieldPair key="purity_assay" label="Purity Assay">
        {item.purity_assay.join(", ")}
      </FieldPair>
    );
  }
  if (isBoolDefined(item.hand_picked)) {
    isolationRows.push(
      <FieldPair key="hand" label="Hand Picked">
        <YesNoBadge value={item.hand_picked} />
      </FieldPair>
    );
  }

  // --- Post-transfer rows ---
  const postTransferRows = [];
  if (hasValue(item.post_shipment_islet_viability)) {
    postTransferRows.push(
      <FieldPair
        key="ps_via"
        label="Post-Shipment Islet Viability (%)"
      >
        {item.post_shipment_islet_viability}
      </FieldPair>
    );
  }
  if (hasValue(item.post_shipment_viability_qualitative)) {
    const q = String(item.post_shipment_viability_qualitative).trim();
    postTransferRows.push(
      <FieldPair key="ps_vq" label="Post-Shipment Viability (imaging / qualitative)">
        {/^https?:\/\//i.test(q) ? (
          <a
            href={q}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 dark:text-blue-400"
          >
            {item.post_shipment_viability_qualitative}
          </a>
        ) : (
          item.post_shipment_viability_qualitative
        )}
      </FieldPair>
    );
  }
  if (hasValue(item.post_shipment_viability_quantitative)) {
    postTransferRows.push(
      <FieldPair
        key="ps_vquant"
        label="Post-Shipment Viability (quantitative %)"
      >
        {item.post_shipment_viability_quantitative}
      </FieldPair>
    );
  }
  if (hasValue(item.post_shipment_purity)) {
    postTransferRows.push(
      <FieldPair key="ps_pur" label="Post-Shipment Islet Purity (%)">
        {item.post_shipment_purity}
      </FieldPair>
    );
  }
  if (hasValue(item.post_shipment_culture_time)) {
    postTransferRows.push(
      <FieldPair key="ps_ct" label="Post-Shipment Culture Time (hours)">
        {item.post_shipment_culture_time}
      </FieldPair>
    );
  }
  if (hasValue(item.post_shipment_culture_media)) {
    postTransferRows.push(
      <FieldPair key="ps_cm" label="Post-Shipment Culture Media">
        {item.post_shipment_culture_media}
      </FieldPair>
    );
  }
  if (hasValue(item.post_shipment_culture_temperature)) {
    postTransferRows.push(
      <FieldPair key="ps_ctemp" label="Post-Shipment Culture Temperature">
        {item.post_shipment_culture_temperature}
      </FieldPair>
    );
  }
  if (isBoolDefined(item.islets_shipped)) {
    postTransferRows.push(
      <FieldPair key="shipped" label="Were the Islets Shipped?">
        <YesNoBadge value={item.islets_shipped} />
      </FieldPair>
    );
  }
  if (hasValue(item.shipping_temperature)) {
    postTransferRows.push(
      <FieldPair key="ship_temp" label="Shipping Temperature (ºC)">
        {item.shipping_temperature}
      </FieldPair>
    );
  }
  if (hasValue(item.shipping_media)) {
    postTransferRows.push(
      <FieldPair key="ship_med" label="Shipping Media">
        {item.shipping_media}
      </FieldPair>
    );
  }
  if (hasValue(item.transit_time)) {
    postTransferRows.push(
      <FieldPair key="transit" label="Transit Time (hours)">
        {item.transit_time}
      </FieldPair>
    );
  }
  for (const key of postShipmentExtraKeys) {
    if (key.startsWith("@")) {
      continue;
    }
    const disp = postShipmentExtraDisplay(item[key]);
    if (!hasValue(disp)) {
      continue;
    }
    postTransferRows.push(
      <FieldPair
        key={key}
        label={key
          .replace(/^post_shipment_/, "")
          .replace(/_/g, " ")}
      >
        {disp}
      </FieldPair>
    );
  }

  // --- Identity rows ---
  const identityRows = [];
  if (hasValue(item.taxa)) {
    identityRows.push(
      <FieldPair key="taxa" label="Taxa">
        {item.taxa}
      </FieldPair>
    );
  }
  if (sampleTerms?.length > 0) {
    identityRows.push(
      <FieldPair key="st" label="Sample Terms">
        <SeparatedList>
          {sampleTerms.map((t) => (
            <Link key={t["@id"]} href={t["@id"]}>
              {t.term_name}
            </Link>
          ))}
        </SeparatedList>
      </FieldPair>
    );
  }
  if (diseaseTerms?.length > 0) {
    identityRows.push(
      <FieldPair key="dt" label="Disease Terms">
        <SeparatedList>
          {diseaseTerms.map((t) => (
            <Link key={t["@id"]} href={t["@id"]}>
              {t.term_name}
            </Link>
          ))}
        </SeparatedList>
      </FieldPair>
    );
  }

  // --- Quality & morphology ---
  const qualityRows = [];
  if (isBoolDefined(item.islet_morphology)) {
    qualityRows.push(
      <BooleanFieldRow
        key="morph"
        label="Islet Morphology"
        value={item.islet_morphology}
      />
    );
  }
  if (isBoolDefined(item.islet_histology)) {
    qualityRows.push(
      <BooleanFieldRow
        key="hist"
        label="Islet Histology"
        value={item.islet_histology}
      />
    );
  }
  if (isBoolDefined(item.islet_function_available)) {
    qualityRows.push(
      <BooleanFieldRow
        key="func"
        label="Islet Function Available"
        value={item.islet_function_available}
      />
    );
  }
  if (hasValue(preservationDisplay)) {
    qualityRows.push(
      <FieldPair key="pres" label="Preservation Method">
        {preservationDisplay}
      </FieldPair>
    );
  }

  // --- Provenance ---
  const provenanceRows = [];
  if (hasValue(item.isolation_center)) {
    provenanceRows.push(
      <FieldPair key="iso" label="Isolation Center">
        {item.isolation_center}
      </FieldPair>
    );
  }
  if (hasValue(item.rrid)) {
    provenanceRows.push(
      <FieldPair key="rrid" label="RRID">
        {item.rrid}
      </FieldPair>
    );
  }
  if (hasValue(item.ccf_id)) {
    provenanceRows.push(
      <FieldPair key="ccf" label="CCF Identifier">
        <a
          href={CCF_EUI_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 dark:text-blue-400"
        >
          {item.ccf_id}
        </a>
      </FieldPair>
    );
  }
  if (hasValue(item.pmi)) {
    provenanceRows.push(
      <FieldPair key="pmi" label="Post-mortem Interval (hours)">
        <span className={pmiClass}>{item.pmi}</span>
      </FieldPair>
    );
  }
  if (partOf?.["@id"]) {
    provenanceRows.push(
      <FieldPair key="part" label="Part of Sample">
        <Link href={partOf["@id"]}>
          {hasValue(partOf.accession) ? partOf.accession : partOf["@id"]}
        </Link>
      </FieldPair>
    );
  }
  if (hasValue(institutionalDisplay)) {
    provenanceRows.push(
      <FieldPair key="inst" label="Institutional Certificates">
        {institutionalDisplay}
      </FieldPair>
    );
  }
  const provenanceDbxrefsBlock =
    item.dbxrefs?.length > 0 ? (
      <div key="dbx">
        <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
          External Resources
        </div>
        <DbxrefList dbxrefs={item.dbxrefs} isCollapsible />
      </div>
    ) : null;

  // --- Additional information ---
  const additionalRows = [];
  if (hasValue(item.description)) {
    additionalRows.push(
      <FieldPair key="desc" label="Description">
        {item.description}
      </FieldPair>
    );
  }
  if (item.protocols?.length > 0) {
    additionalRows.push(
      <FieldPair key="prot" label="Protocols">
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
    );
  }
  if (hasValue(item.submitter_comment)) {
    additionalRows.push(
      <FieldPair key="sub" label="Submitter Comment">
        {item.submitter_comment}
      </FieldPair>
    );
  }
  if (hasValue(item.revoke_detail)) {
    additionalRows.push(
      <FieldPair key="rev" label="Revoke Detail">
        {item.revoke_detail}
      </FieldPair>
    );
  }
  if (item.publication_identifiers?.length > 0) {
    additionalRows.push(
      <div key="pub">
        <div className="mb-1 text-sm font-semibold text-data-label dark:text-gray-400">
          Publication Identifiers
        </div>
        <DbxrefList
          dbxrefs={item.publication_identifiers}
          isCollapsible
        />
      </div>
    );
  }

  const headerDiseasePills =
    diseaseTerms?.filter((t) => hasValue(t.term_name)) ?? [];

  const primaryIsletPhase = getPrimaryIsletPhase(item);
  const biosampleTypeLabel = primaryIsletBiosampleTypeDisplay(
    item,
    primaryIsletPhase
  );
  const hasBiosampleTypeInfo =
    primaryIsletPhase !== null || hasValue(item.biosample_type);

  const showBiosampleSummary =
    hasValue(item.isolation_center) ||
    hasValue(item.organ_source) ||
    (Array.isArray(donors) && donors.length > 0) ||
    hasBiosampleTypeInfo;

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-12 sm:px-6 lg:px-8">
        <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {item.accession}
            </h1>
            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
              {item.status ? (
                <span className="inline-flex items-center gap-2">
                  <Status status={item.status} />
                </span>
              ) : null}
              {(hasValue(item.isolation_center) ||
                hasValue(item.organ_source)) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-data-value">
                  {hasValue(item.isolation_center) ? (
                    <span>{item.isolation_center}</span>
                  ) : null}
                  {hasValue(item.organ_source) ? (
                    <span>{item.organ_source}</span>
                  ) : null}
                </div>
              )}
              {headerDiseasePills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {headerDiseasePills.map((t) => (
                    <DiagnosisBadge key={t["@id"]} text={t.term_name} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {showBiosampleSummary ? (
          <section>
            <DashboardSectionTitle>Biosample Summary</DashboardSectionTitle>
            <div className="flex flex-wrap gap-3">
              {hasValue(item.isolation_center) ? (
                <MetricCard
                  label="Islet Isolation Center"
                  value={item.isolation_center}
                />
              ) : null}
              {hasValue(item.organ_source) ? (
                <MetricCard label="Organ Source" value={item.organ_source} />
              ) : null}
              {Array.isArray(donors) && donors.length > 0 ? (
                <MetricCard
                  label={
                    donors.length > 1 ? "Donor accessions" : "Donor accession"
                  }
                  value={
                    <SeparatedList>
                      {donors.map((d) => (
                        <Link
                          key={d["@id"]}
                          href={d["@id"]}
                          className="text-blue-700 dark:text-blue-400"
                        >
                          {d.accession ?? d["@id"]}
                        </Link>
                      ))}
                    </SeparatedList>
                  }
                />
              ) : null}
              {hasBiosampleTypeInfo ? (
                <MetricCard
                  label="Biosample type"
                  value={biosampleTypeLabel}
                />
              ) : null}
            </div>
          </section>
        ) : null}

        <section>
          <DashboardSectionTitle>Identity</DashboardSectionTitle>
          {identityRows.length === 0 ? (
            <SectionEmptyHint text="No data recorded yet" />
          ) : (
            <dl className="space-y-3">{identityRows}</dl>
          )}
        </section>

        <section>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <DashboardSectionTitle>Pre-shipment Metrics</DashboardSectionTitle>
              <SubsectionHint>Data captured at time of isolation</SubsectionHint>
              {isolationRows.length === 0 ? (
                <SectionEmptyHint text="No data recorded yet" />
              ) : (
                <dl className="space-y-3">{isolationRows}</dl>
              )}
            </div>
            <div>
              <DashboardSectionTitle>Post-shipment Metrics</DashboardSectionTitle>
              <SubsectionHint>Data captured at time of receipt/use</SubsectionHint>
              {postTransferRows.length === 0 ? (
                <SectionEmptyHint text="No post-shipment data recorded yet" />
              ) : (
                <dl className="space-y-3">{postTransferRows}</dl>
              )}
            </div>
          </div>
        </section>

        <section>
          <DashboardSectionTitle>Quality &amp; Morphology</DashboardSectionTitle>
          {qualityRows.length === 0 ? (
            <SectionEmptyHint text="No data recorded yet" />
          ) : (
            <dl className="space-y-3">{qualityRows}</dl>
          )}
        </section>

        <section>
          <DashboardSectionTitle>Provenance</DashboardSectionTitle>
          {provenanceRows.length === 0 && !provenanceDbxrefsBlock ? (
            <SectionEmptyHint text="No data recorded yet" />
          ) : (
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              {provenanceRows.length > 0 ? (
                <dl className="space-y-3">{provenanceRows}</dl>
              ) : null}
              {provenanceDbxrefsBlock}
            </div>
          )}
        </section>

        <BiosampleTreatmentsSection treatments={treatments} />
        {children}

        {additionalRows.length > 0 ? (
          <section>
            <DashboardSectionTitle>Additional information</DashboardSectionTitle>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              {additionalRows}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

PrimaryIsletClinicalDashboard.propTypes = {
  item: PropTypes.object.isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object),
  donors: PropTypes.arrayOf(PropTypes.object),
  partOf: PropTypes.object,
  sampleTerms: PropTypes.arrayOf(PropTypes.object),
  treatments: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};

PrimaryIsletClinicalDashboard.defaultProps = {
  diseaseTerms: [],
  donors: [],
  partOf: null,
  sampleTerms: [],
  treatments: [],
  children: null,
};
