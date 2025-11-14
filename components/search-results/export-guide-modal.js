// node_modules
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
// components
import { Button } from "../form-elements";
import Modal from "../modal";
import { Tooltip, TooltipRef, useTooltip } from "../tooltip";

/**
 * Display a modal with the export guide content.
 */
function ExportGuideContent() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h3>How to Export Data as TSV</h3>

      <h4>Quick Start</h4>
      <ol>
        <li><strong>Switch to Report View</strong>: Click the table/grid view button (tabular view) to see data in a table format</li>
        <li><strong>Select Columns</strong>: Click the &ldquo;Columns&rdquo; button to choose which fields to include</li>
        <li><strong>Download</strong>: Click &ldquo;Download metadata as TSV&rdquo; to export your data</li>
      </ol>

      <h4>Step-by-Step Instructions</h4>

      <h5>Step 1: Navigate to Report View</h5>
      <ul>
        <li>Look for the view switcher buttons in the top toolbar</li>
        <li>Click the <strong>table/grid icon</strong> button to switch from list view to report (tabular) view</li>
        <li>The report view displays data in a table format with columns</li>
      </ul>

      <h5>Step 2: Customize Columns</h5>
      <ol>
        <li><strong>Click the &ldquo;Columns&rdquo; button</strong> in the toolbar
          <ul>
            <li>The button is located next to the view switcher buttons</li>
            <li>It may show an indicator if some columns are currently hidden</li>
          </ul>
        </li>
        <li><strong>In the Columns modal</strong>:
          <ul>
            <li>Check the boxes next to columns you want to <strong>include</strong> in your export</li>
            <li>Uncheck boxes for columns you want to <strong>exclude</strong></li>
            <li>Use &ldquo;Show All&rdquo; to include all available columns</li>
            <li>Use &ldquo;Hide All&rdquo; to exclude all optional columns (ID column will always remain)</li>
            <li>Note: The <strong>ID column cannot be hidden</strong> and will always be included</li>
          </ul>
        </li>
        <li><strong>Click &ldquo;Close&rdquo;</strong> when you&apos;re done selecting columns</li>
      </ol>

      <h5>Step 3: Download Your Data</h5>
      <ol>
        <li><strong>Click &ldquo;Download metadata as TSV&rdquo; button</strong>
          <ul>
            <li>The button is located next to the Columns button</li>
            <li>It includes a download icon and clear text label</li>
          </ul>
        </li>
        <li><strong>Your browser will download the file</strong>
          <ul>
            <li>The file will be named based on your search query</li>
            <li>It will be in TSV format (tab-separated values)</li>
            <li>You can open it in Excel, Google Sheets, or any spreadsheet application</li>
          </ul>
        </li>
      </ol>

      <h4>What Gets Exported?</h4>
      <ul>
        <li><strong>Only visible columns</strong> are included in the TSV export</li>
        <li>The columns you see in the table are the columns that will be exported</li>
        <li>If you hide a column using the Columns button, it won&apos;t be in the export</li>
        <li>The ID column is always included, even if you try to hide it</li>
      </ul>

      <h4>Tips</h4>
      <ul>
        <li><strong>Preview before exporting</strong>: The table view shows exactly what will be exported</li>
        <li><strong>Customize for your needs</strong>: Select only the columns relevant to your analysis</li>
        <li><strong>Save time</strong>: Use &ldquo;Show All&rdquo; or &ldquo;Hide All&rdquo; to quickly adjust column visibility</li>
        <li><strong>Multiple exports</strong>: You can export the same data multiple times with different column selections</li>
      </ul>

      <h4>Troubleshooting</h4>
      <p><strong>Q: I don&apos;t see the &ldquo;Download metadata as TSV&rdquo; button</strong></p>
      <ul>
        <li>Make sure you&apos;re in <strong>Report view</strong> (table/grid view), not List view</li>
        <li>The download button only appears in report view</li>
      </ul>

      <p><strong>Q: The exported file doesn&apos;t include the columns I selected</strong></p>
      <ul>
        <li>Make sure you clicked &ldquo;Close&rdquo; in the Columns modal after making your selections</li>
        <li>Verify the columns are visible in the table before downloading</li>
      </ul>

      <p><strong>Q: How do I know which columns are selected?</strong></p>
      <ul>
        <li>Look at the table - visible columns are selected</li>
        <li>The Columns button may show an indicator if some columns are hidden</li>
        <li>Open the Columns modal to see the full list and current selections</li>
      </ul>
    </div>
  );
}

/**
 * Display a button that opens a modal with export guide instructions.
 */
export default function ExportGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipAttr = useTooltip("export-guide");

  return (
    <>
      <TooltipRef tooltipAttr={tooltipAttr}>
        <div>
          <Button
            onClick={() => setIsOpen(true)}
            type="secondary"
            size="md"
            hasIconOnly={true}
            label="Show export guide"
            className="h-full"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </Button>
        </div>
      </TooltipRef>
      <Tooltip tooltipAttr={tooltipAttr}>
        How to export data and select columns
      </Tooltip>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} testid="export-guide-modal">
        <Modal.Header onClose={() => setIsOpen(false)}>
          <h2>Exporting Data as TSV - User Guide</h2>
        </Modal.Header>
        <Modal.Body>
          <ExportGuideContent />
        </Modal.Body>
        <Modal.Footer>
          <Button type="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
