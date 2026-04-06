// node_modules
import PropTypes from "prop-types";
// components
import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemList,
  DataItemValue,
  DataPanel,
} from "./data-area";

const ISLET_ASSAY_FIELDS = [
  ["islet_purification_method", "Islet Purification for Functional Assay"],
  ["total_islets_for_assay", "Total Number of Islets for Functional Assay"],
  ["islet_diameter", "Islet Size/Diameter (μm)"],
  ["islet_purity_for_assay", "Islet Purity for Functional Assay (%)"],
  ["islet_volume_ieq", "Islet Cell Volume for Functional Assay (IEQ)"],
  ["islet_endocrine_composition", "Islet Endocrine Cell Composition (%)"],
  ["perifusion_protocol", "Perifusion Protocol"],
  ["base_media", "Base Media"],
  ["stimuli_secretagogues", "Stimuli or Secretagogues"],
  ["perifusion_flow_rate", "Perifusion Flow Rate"],
  ["perifusion_fraction_volume", "Perifusion Fraction Volume"],
  ["fraction_collection_time", "Fraction Collection Time (min)"],
];

function linkIfUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return value;
  }
  if (/^https?:\/\//i.test(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 dark:text-blue-400"
      >
        {value}
      </a>
    );
  }
  return value;
}

/**
 * Renders perifunctional / islet assay metadata from measurement_set when any field is present.
 */
export default function MeasurementSetIsletAssayDetails({ measurementSet }) {
  const hasAny = ISLET_ASSAY_FIELDS.some(
    ([key]) =>
      measurementSet[key] !== undefined && measurementSet[key] !== null
  );
  const hasHormones =
    measurementSet.hormone_assays?.length > 0;
  const hasDataUrl =
    measurementSet.data_url !== undefined && measurementSet.data_url !== null;

  if (!hasAny && !hasHormones && !hasDataUrl) {
    return null;
  }

  return (
    <>
      <DataAreaTitle>Islet functional assay (perifusion)</DataAreaTitle>
      <DataPanel>
        <DataArea>
          {ISLET_ASSAY_FIELDS.map(([key, label]) => {
            const v = measurementSet[key];
            if (v === undefined || v === null || v === "") {
              return null;
            }
            return (
              <FragmentRow key={key} label={label}>
                {key === "stimuli_secretagogues" ? (
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-gray-800 dark:text-gray-200">
                    {String(v)}
                  </pre>
                ) : key === "perifusion_protocol" ? (
                  linkIfUrl(v)
                ) : (
                  String(v)
                )}
              </FragmentRow>
            );
          })}
          {hasHormones ? (
            <FragmentRow label="Hormone Assays">
              <DataItemList isCollapsible>
                {measurementSet.hormone_assays}
              </DataItemList>
            </FragmentRow>
          ) : null}
          {hasDataUrl ? (
            <FragmentRow label="Data URL">
              <a
                href={measurementSet.data_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-400"
              >
                {measurementSet.data_url}
              </a>
            </FragmentRow>
          ) : null}
        </DataArea>
      </DataPanel>
    </>
  );
}

function FragmentRow({ label, children }) {
  return (
    <>
      <DataItemLabel>{label}</DataItemLabel>
      <DataItemValue>{children}</DataItemValue>
    </>
  );
}

FragmentRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

MeasurementSetIsletAssayDetails.propTypes = {
  measurementSet: PropTypes.object.isRequired,
};
