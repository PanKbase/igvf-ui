// node_modules
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
// components
import LinkedIdAndStatus from "./linked-id-and-status";
// lib
import { API_URL } from "../lib/constants";
import { ButtonLink } from "./form-elements";

const FILE_NOT_FOUND = "file not found";
const PENDING = "pending";

/**
 * Return the URL to download a file, preferring `file_url` over the system `@@download` path.
 */
export function getFileDownloadUrl(file) {
  if (file.file_url) {
    return file.file_url;
  }
  if (file.href) {
    return `${API_URL}${file.href}`;
  }
  return null;
}

/**
 * Display a file-download link and download icon. Files without an `upload_status` of `file not
 * found` or `pending` have a disabled download link, as do files with controlled access and an
 * Anvil URL.
 */
export function FileDownload({ file, className = "" }) {
  const isDownloadDisabledByStatus = [FILE_NOT_FOUND, PENDING].includes(
    file.upload_status
  );
  const isDownloadDisabledByAnvil = Boolean(
    file.controlled_access && file.anvil_url
  );
  const downloadUrl = getFileDownloadUrl(file);

  if (!downloadUrl) {
    return null;
  }

  const isExternalDownload =
    downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://");

  return (
    <ButtonLink
      label={`Download file ${file.accession}`}
      href={downloadUrl}
      type="secondary"
      size="sm"
      isDisabled={isDownloadDisabledByStatus || isDownloadDisabledByAnvil}
      isExternal={isExternalDownload}
      className={className}
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
      Download
    </ButtonLink>
  );
}

FileDownload.propTypes = {
  // File to download
  file: PropTypes.object.isRequired,
  // Tailwind CSS classes for the download icon
  className: PropTypes.string,
};

/**
 * File download link for the file object page headers.
 */
export function FileHeaderDownload({ file }) {
  return (
    <div
      className="flex grow items-center px-1"
      data-testid="file-header-download"
    >
      <FileDownload file={file} />
    </div>
  );
}

FileHeaderDownload.propTypes = {
  // File to download
  file: PropTypes.object.isRequired,
};

/**
 * Display a file's accession and download link on one row.
 */
export function FileAccessionAndDownload({ file, isTargetBlank = false }) {
  return (
    <div>
      <div className="flex items-center gap-1">
        <LinkedIdAndStatus item={file} isTargetBlank={isTargetBlank}>
          {file.accession}
        </LinkedIdAndStatus>
      </div>
    </div>
  );
}

FileAccessionAndDownload.propTypes = {
  // File to link to and download
  file: PropTypes.object.isRequired,
  isTargetBlank: PropTypes.bool,
};
