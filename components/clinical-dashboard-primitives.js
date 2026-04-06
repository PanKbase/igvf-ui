// node_modules
import PropTypes from "prop-types";

/**
 * Shared layout primitives matching HumanDonorClinicalDashboard styling.
 */

export function MetricCard({ label, value, valueClass = "", sub }) {
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

export function FieldPair({ label, children, monoValue = false }) {
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

export function DashboardSectionTitle({ children }) {
  return (
    <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-light text-gray-900 dark:border-gray-800 dark:text-gray-100">
      {children}
    </h2>
  );
}

DashboardSectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export function PanelColumnTitle({ children }) {
  return (
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-data-label dark:text-gray-400">
      {children}
    </h3>
  );
}

PanelColumnTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export function formatDiagnosisChipText(description) {
  if (!description || description === "-") {
    return null;
  }
  return String(description).replace(/\s+/g, " ").trim();
}

export function DiagnosisBadge({ text }) {
  if (!text) {
    return null;
  }
  return (
    <span className="rounded border border-amber-500 bg-amber-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200">
      {text}
    </span>
  );
}

DiagnosisBadge.propTypes = {
  text: PropTypes.string,
};

export function YesNoBadge({ value }) {
  if (value === undefined || value === null) {
    return null;
  }
  const yes = value === true;
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
        yes
          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {yes ? "Yes" : "No"}
    </span>
  );
}

YesNoBadge.propTypes = {
  value: PropTypes.bool,
};

export function viabilityHighClass(pct) {
  if (pct === undefined || pct === null || Number.isNaN(Number(pct))) {
    return "";
  }
  const n = Number(pct);
  if (n >= 70) {
    return "text-emerald-700 dark:text-emerald-400";
  }
  return "";
}

export function coldIschaemiaClass(hours) {
  if (hours === undefined || hours === null || Number.isNaN(Number(hours))) {
    return "";
  }
  const n = Number(hours);
  if (n >= 12) {
    return "text-amber-700 dark:text-amber-400";
  }
  return "";
}

export function pmiElevatedClass(hours) {
  if (hours === undefined || hours === null || Number.isNaN(Number(hours))) {
    return "";
  }
  const n = Number(hours);
  if (n >= 24) {
    return "text-amber-700 dark:text-amber-400";
  }
  return "";
}
