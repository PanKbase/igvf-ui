/**
 * Derive pre- vs post-shipment phase for Primary Islet from `biosample_type`, with fallbacks
 * from which metric fields are populated (no hardcoded type strings beyond parsing).
 * When inferring from metrics, post-shipment viability is indicated by either
 * `post_shipment_islet_viability` or `post_shipment_viability_quantitative` (distinct fields).
 * @param {object} item Primary islet object
 * @returns {"pre-shipment"|"post-shipment"|null}
 */
function isDefined(value) {
  return value !== undefined && value !== null;
}

export function getPrimaryIsletPhase(item) {
  const raw = item?.biosample_type;
  if (raw !== undefined && raw !== null && raw !== "") {
    const s = String(raw).trim().toLowerCase();
    if (s.includes("post") && s.includes("ship")) {
      return "post-shipment";
    }
    if (s.includes("pre") && s.includes("ship")) {
      return "pre-shipment";
    }
  }
  const hasPostShipmentViability =
    isDefined(item?.post_shipment_islet_viability) ||
    isDefined(item?.post_shipment_viability_quantitative);

  const hasPostShipmentMetrics =
    hasPostShipmentViability ||
    (item?.post_shipment_purity !== undefined &&
      item?.post_shipment_purity !== null) ||
    (item?.post_shipment_viability_qualitative !== undefined &&
      item?.post_shipment_viability_qualitative !== null) ||
    (item?.post_shipment_culture_time !== undefined &&
      item?.post_shipment_culture_time !== null) ||
    (item?.post_shipment_culture_media !== undefined &&
      item?.post_shipment_culture_media !== null) ||
    (item?.post_shipment_culture_temperature !== undefined &&
      item?.post_shipment_culture_temperature !== null);

  if (
    hasPostShipmentMetrics &&
    (item?.prep_viability === undefined || item?.prep_viability === null)
  ) {
    return "post-shipment";
  }
  /* Both isolation and post-receipt viability: treat as post-shipment when unlabeled. */
  if (isDefined(item?.prep_viability) && hasPostShipmentViability) {
    return "post-shipment";
  }
  if (isDefined(item?.prep_viability) && !hasPostShipmentViability) {
    return "pre-shipment";
  }
  return null;
}

export function primaryIsletBiosampleTypeDisplay(item, phase) {
  if (phase) {
    return phase === "post-shipment" ? "Post-shipment" : "Pre-shipment";
  }
  if (item?.biosample_type) {
    return String(item.biosample_type);
  }
  return "—";
}
