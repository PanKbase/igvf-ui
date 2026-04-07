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
  YesNoBadge,
  coldIschaemiaClass,
  pmiElevatedClass,
  viabilityHighClass,
} from "./clinical-dashboard-primitives";
// lib
import { formatDate } from "../lib/dates";
import { hasTaxaDisplay } from "../lib/general";
import {
  getPrimaryIsletPhase,
  primaryIsletBiosampleTypeDisplay,
} from "../lib/primary-islet-phase";

/** Post-shipment keys rendered explicitly (exclude from generic `post_shipment_*` fallback). */
const EXPLICIT_POST_SHIPMENT_KEYS = new Set([
  "post_shipment_islet_viability",
  "post_shipment_viability_qualitative",
  "post_shipment_viability_quantitative",
  "post_shipment_purity",
  "post_shipment_culture_time",
  "post_shipment_culture_media",
  "post_shipment_culture_temperature",
]);

const HUBMAP_CCF_BASE =
  "https://portal.hubmapconsortium.org/browse/sample/";

function hasQualityMorphologySection(item, preservationDisplay) {
  const hasBool = [
    item.islet_morphology,
    item.islet_histology,
    item.islet_function_available,
    item.hand_picked,
  ].some((v) => v !== undefined && v !== null);
  const hasPurityAssay = item.purity_assay?.length > 0;
  const hasPreservation =
    preservationDisplay &&
    String(preservationDisplay).trim() !== "";
  return hasBool || hasPurityAssay || Boolean(hasPreservation);
}

function hasPostShipmentMetrics(item, postShipmentExtraKeys) {
  const explicit = [
    item.post_shipment_islet_viability,
    item.post_shipment_viability_qualitative,
    item.post_shipment_viability_quantitative,
    item.post_shipment_purity,
    item.post_shipment_culture_time,
    item.post_shipment_culture_media,
    item.post_shipment_culture_temperature,
  ];
  for (const v of explicit) {
    if (v !== undefined && v !== null) {
      if (typeof v === "string" && v.trim() === "") {
        continue;
      }
      return true;
    }
  }
  for (const key of postShipmentExtraKeys) {
    if (key.startsWith("@")) {
      continue;
    }
    const v = item[key];
    if (v !== undefined && v !== null) {
      if (Array.isArray(v) && v.length === 0) {
        continue;
      }
      return true;
    }
  }
  return false;
}

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

export default function PrimaryIsletClinicalDashboard({
  item,
  diseaseTerms = [],
  partOf = null,
  sampleTerms = [],
  treatments = [],
}) {
  const phase = getPrimaryIsletPhase(item);
  const typeLabel = primaryIsletBiosampleTypeDisplay(item, phase);
  const subtitle = [item.isolation_center, item.organ_source]
    .filter(Boolean)
    .join(" · ");

  const showPreShipment = phase !== "post-shipment";
  const showPostShipment = phase === "post-shipment";

  const prepViabilityClass = viabilityHighClass(item.prep_viability);
  const coldClass = coldIschaemiaClass(item.cold_ischaemia_time);
  const warmIschemiaClass = coldIschaemiaClass(item.warm_ischaemia_duration);
  const pmiClass = pmiElevatedClass(item.pmi);

  const preservationDisplay = Array.isArray(item.preservation_method)
    ? item.preservation_method.join(", ")
    : item.preservation_method;

  const postShipmentExtraKeys = Object.keys(item).filter(
    (k) =>
      k.startsWith("post_shipment_") && !EXPLICIT_POST_SHIPMENT_KEYS.has(k)
  );

  const showQualityMorphology = hasQualityMorphologySection(
    item,
    preservationDisplay
  );
  const showPostShipmentMetrics =
    showPostShipment &&
    hasPostShipmentMetrics(item, postShipmentExtraKeys);

  const hasShipmentTransit =
    item.islets_shipped !== undefined ||
    item.shipping_temperature !== undefined ||
    item.shipping_media !== undefined ||
    item.transit_time !== undefined;

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
          <DashboardSectionTitle>Sample summary</DashboardSectionTitle>
          <div className="flex flex-wrap gap-3">
            <MetricCard
              label="Islet Isolation Center"
              value={item.isolation_center || "—"}
            />
            <MetricCard label="Biosample Type" value={typeLabel} />
          </div>
        </section>

        <section>
          <div
            className={
              showPreShipment ? "grid gap-10 lg:grid-cols-2" : "grid gap-10"
            }
          >
            <div>
              <PanelColumnTitle>Identity</PanelColumnTitle>
              <dl className="space-y-3">
                {hasTaxaDisplay(item.taxa) ? (
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
                {diseaseTerms?.length > 0 ? (
                  <FieldPair label="Disease Terms">
                    <SeparatedList>
                      {diseaseTerms.map((t) => (
                        <Link key={t["@id"]} href={t["@id"]}>
                          {t.term_name}
                        </Link>
                      ))}
                    </SeparatedList>
                  </FieldPair>
                ) : null}
              </dl>
            </div>
            {showPreShipment ? (
              <div>
                <PanelColumnTitle>Pre-shipment metrics</PanelColumnTitle>
                <dl className="space-y-3">
                  <FieldPair label="Warm Ischemia Duration / Down Time (hours)">
                    {item.warm_ischaemia_duration !== undefined &&
                    item.warm_ischaemia_duration !== null ? (
                      <span className={warmIschemiaClass}>
                        {item.warm_ischaemia_duration}
                      </span>
                    ) : null}
                  </FieldPair>
                  <FieldPair label="Pancreas Digest Time (minutes)">
                    {item.digest_time !== undefined && item.digest_time !== null
                      ? item.digest_time
                      : null}
                  </FieldPair>
                  <FieldPair label="Percentage Trapped">
                    {item.percentage_trapped !== undefined &&
                    item.percentage_trapped !== null
                      ? `${item.percentage_trapped}%`
                      : null}
                  </FieldPair>
                  <FieldPair label="Pre-Shipment Culture Time (hours)">
                    {item.pre_shipment_culture_time}
                  </FieldPair>
                  <FieldPair label="Pre-Shipment Culture Media">
                    {item.pre_shipment_culture_media}
                  </FieldPair>
                  <FieldPair label="Pre-Shipment Culture Temperature (ºC)">
                    {item.pre_shipment_culture_temperature}
                  </FieldPair>
                  <FieldPair label="FACS Purification">
                    <FacsLinks urls={item.facs_purification} />
                  </FieldPair>
                  <FieldPair label="Islet Yield (IEQ)">{item.islet_yield}</FieldPair>
                  <FieldPair label="IEQ/Pancreas Weight (grams)">
                    {item.pancreas_weight}
                  </FieldPair>
                  <FieldPair label="Date Harvested">
                    {item.date_obtained ? formatDate(item.date_obtained) : null}
                  </FieldPair>
                  <FieldPair label="Pre-Shipment Islet Viability (%)">
                    {item.prep_viability !== undefined &&
                    item.prep_viability !== null ? (
                      <span className={prepViabilityClass}>
                        {item.prep_viability}
                      </span>
                    ) : null}
                  </FieldPair>
                  <FieldPair label="Pre-Shipment Islet Purity (%)">
                    {item.purity?.length > 0 ? item.purity.join(", ") : null}
                  </FieldPair>
                  <FieldPair label="Cold Ischaemia Time (hours)">
                    {item.cold_ischaemia_time !== undefined &&
                    item.cold_ischaemia_time !== null ? (
                      <span className={coldClass}>
                        {item.cold_ischaemia_time}
                      </span>
                    ) : null}
                  </FieldPair>
                  {item.pmi !== undefined && item.pmi !== null ? (
                    <FieldPair label="Post-mortem Interval (hours)">
                      <span className={pmiClass}>{item.pmi}</span>
                    </FieldPair>
                  ) : null}
                </dl>
              </div>
            ) : null}
          </div>
        </section>

        {hasShipmentTransit ? (
          <section>
            <DashboardSectionTitle>Shipment &amp; transit</DashboardSectionTitle>
            <dl className="space-y-3">
              {item.islets_shipped !== undefined &&
              item.islets_shipped !== null ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
                    Were the Islets Shipped?
                  </dt>
                  <dd>
                    <YesNoBadge value={item.islets_shipped} />
                  </dd>
                </div>
              ) : null}
              <FieldPair label="Shipping Temperature (ºC)">
                {item.shipping_temperature}
              </FieldPair>
              <FieldPair label="Shipping Media">{item.shipping_media}</FieldPair>
              <FieldPair label="Transit Time (hours)">{item.transit_time}</FieldPair>
            </dl>
          </section>
        ) : null}

        {showQualityMorphology ? (
          <section>
            <DashboardSectionTitle>Quality &amp; morphology</DashboardSectionTitle>
            <dl className="space-y-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
                  Islet Morphology
                </dt>
                <dd>
                  <YesNoBadge value={item.islet_morphology} />
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
                  Islet Histology
                </dt>
                <dd>
                  <YesNoBadge value={item.islet_histology} />
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
                  Islet Function Available
                </dt>
                <dd>
                  <YesNoBadge value={item.islet_function_available} />
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-data-label dark:text-gray-400">
                  Hand-Picked
                </dt>
                <dd>
                  <YesNoBadge value={item.hand_picked} />
                </dd>
              </div>
              <FieldPair label="Purity Assay">
                {item.purity_assay?.length > 0
                  ? item.purity_assay.join(", ")
                  : null}
              </FieldPair>
              <FieldPair label="Preservation Method">
                {preservationDisplay || null}
              </FieldPair>
            </dl>
          </section>
        ) : null}

        {showPostShipmentMetrics ? (
          <section>
            <DashboardSectionTitle>Post-shipment metrics</DashboardSectionTitle>
            <dl className="space-y-3">
              <FieldPair label="Post-Shipment Islet Viability (%)">
                {item.post_shipment_islet_viability !== undefined &&
                item.post_shipment_islet_viability !== null
                  ? item.post_shipment_islet_viability
                  : null}
              </FieldPair>
              <FieldPair label="Post-Shipment Viability (imaging / qualitative)">
                {item.post_shipment_viability_qualitative ? (
                  /^https?:\/\//i.test(
                    String(item.post_shipment_viability_qualitative).trim()
                  ) ? (
                    <a
                      href={String(item.post_shipment_viability_qualitative).trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 dark:text-blue-400"
                    >
                      {item.post_shipment_viability_qualitative}
                    </a>
                  ) : (
                    item.post_shipment_viability_qualitative
                  )
                ) : null}
              </FieldPair>
              <FieldPair label="Post-Shipment Viability (quantitative %)">
                {item.post_shipment_viability_quantitative}
              </FieldPair>
              <FieldPair label="Post-Shipment Islet Purity (%)">
                {item.post_shipment_purity}
              </FieldPair>
              <FieldPair label="Post-Shipment Culture Time (hours)">
                {item.post_shipment_culture_time}
              </FieldPair>
              <FieldPair label="Post-Shipment Culture Media">
                {item.post_shipment_culture_media}
              </FieldPair>
              <FieldPair label="Post-Shipment Culture Temperature">
                {item.post_shipment_culture_temperature}
              </FieldPair>
              {postShipmentExtraKeys
                .filter((k) => !k.startsWith("@"))
                .map((key) => {
                  const v = item[key];
                  let display = null;
                  if (v !== undefined && v !== null) {
                    if (Array.isArray(v)) {
                      display = v.join(", ");
                    } else if (typeof v === "object") {
                      display = JSON.stringify(v);
                    } else {
                      display = String(v);
                    }
                  }
                  return (
                    <FieldPair
                      key={key}
                      label={key
                        .replace(/^post_shipment_/, "")
                        .replace(/_/g, " ")}
                    >
                      {display}
                    </FieldPair>
                  );
                })}
            </dl>
          </section>
        ) : null}

        <section>
          <DashboardSectionTitle>Provenance</DashboardSectionTitle>
          <dl className="space-y-3">
            <FieldPair label="Islet Isolation Center">
              {item.isolation_center}
            </FieldPair>
            <FieldPair label="rrid">{item.rrid}</FieldPair>
            <FieldPair label="Common Coordinate Framework Identifier">
              {item.ccf_id ? (
                <a
                  href={`${HUBMAP_CCF_BASE}${encodeURIComponent(item.ccf_id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400"
                >
                  {item.ccf_id}
                </a>
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
          </dl>
        </section>

        <BiosampleTreatmentsSection treatments={treatments} />

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

PrimaryIsletClinicalDashboard.propTypes = {
  item: PropTypes.object.isRequired,
  diseaseTerms: PropTypes.arrayOf(PropTypes.object),
  partOf: PropTypes.object,
  sampleTerms: PropTypes.arrayOf(PropTypes.object),
  treatments: PropTypes.arrayOf(PropTypes.object),
};

PrimaryIsletClinicalDashboard.defaultProps = {
  diseaseTerms: [],
  partOf: null,
  sampleTerms: [],
  treatments: [],
};
