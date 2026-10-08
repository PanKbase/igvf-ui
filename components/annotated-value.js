// node_modules
import PropTypes from "prop-types";
// components
import { Tooltip, TooltipRef, useTooltip } from "./tooltip";

/**
 * Display an item with an annotation that appears in a tooltip. If no annotation is provided,
 * this renders the children without any underline nor tooltip.
 */
export function AnnotatedItem({
  tooltipKey,
  annotation = "",
  className = "",
  children,
}) {
  const tooltipAttr = useTooltip(tooltipKey);

  if (annotation) {
    return (
      <>
        <TooltipRef tooltipAttr={tooltipAttr}>
          <span
            className={`underline decoration-gray-400 decoration-dotted underline-offset-2 ${className}`}
          >
            {children}
          </span>
        </TooltipRef>
        <Tooltip tooltipAttr={tooltipAttr}>{annotation}</Tooltip>
      </>
    );
  }
  return <span>{children}</span>;
}

AnnotatedItem.propTypes = {
  // Unique key for the tooltip
  tooltipKey: PropTypes.string.isRequired,
  // Text to show in the tooltip; no tooltip and no underline if empty
  annotation: PropTypes.string,
  // Additional Tailwind CSS classes for the element wrapping the children when annotated
  className: PropTypes.string,
};
