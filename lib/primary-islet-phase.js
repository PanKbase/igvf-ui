/**
 * Derive pre- vs post-shipment phase for Primary Islet from `biosample_type`, with fallbacks
 * from which metric fields are populated (no hardcoded type strings beyond parsing).
 * @param {object} item Primary islet object
 * @returns {"pre-shipment"|"post-shipment"|null}
 */
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
  if (
    item?.post_shipment_islet_viability !== undefined &&
    item?.post_shipment_islet_viability !== null &&
    (item?.prep_viability === undefined || item?.prep_viability === null)
  ) {
    return "post-shipment";
  }
  if (
    item?.prep_viability !== undefined &&
    item?.prep_viability !== null &&
    (item?.post_shipment_islet_viability === undefined ||
      item?.post_shipment_islet_viability === null)
  ) {
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
