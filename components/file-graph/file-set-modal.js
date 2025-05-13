/* eslint-disable react/prop-types */
"use strict";
import React from "react";
import Link from "next/link";
import AliasList from "../alias-list";
import {
  DataPanel,
  DataArea,
  DataItemLabel,
  DataItemValue,
} from "../data-area";
import { FileAccessionAndDownload } from "../file-download";
import Modal from "../modal";
import SeparatedList from "../separated-list";
import SortableGrid from "../sortable-grid";
import Status from "../status";
import { FileModalTitle } from "./file-modal-title";
const filesColumns = [
  {
    id: "accession",
    title: "Accession",
    display: ({ source }) =>
      /* @__PURE__ */ React.createElement(FileAccessionAndDownload, {
        file: source,
        isTargetBlank: true,
      }),
  },
  {
    id: "file_format",
    title: "File Format",
    sorter: (item) => item.file_format.toLowerCase(),
  },
  {
    id: "content_type",
    title: "Content Type",
    sorter: (item) => item.content_type.toLowerCase(),
  },
  {
    id: "input_file_for",
    title: "Input File For",
    display: ({ source, meta }) => {
      const { nativeFiles } = meta;
      const inputFileFor = source.input_file_for;
      if (inputFileFor.length > 0) {
        const childFiles = inputFileFor
          .map((inputFileId) =>
            nativeFiles.find((file) => file["@id"] === inputFileId)
          )
          .filter((file) => file);
        if (childFiles.length > 0) {
          return /* @__PURE__ */ React.createElement(
            SeparatedList,
            { isCollapsible: true },
            childFiles.map((file) =>
              /* @__PURE__ */ React.createElement(
                Link,
                {
                  key: file["@id"],
                  href: file["@id"],
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                file.accession
              )
            )
          );
        }
      }
      return null;
    },
  },
  {
    id: "status",
    title: "Status",
    display: ({ source }) =>
      /* @__PURE__ */ React.createElement(Status, { status: source.status }),
  },
  {
    id: "upload_status",
    title: "Upload Status",
    display: ({ source }) =>
      /* @__PURE__ */ React.createElement(Status, {
        status: source.upload_status,
      }),
  },
];
export function FileSetModal({ node, nativeFiles, onClose }) {
  const { fileSet } = node;
  return /* @__PURE__ */ React.createElement(
    Modal,
    { isOpen: true, onClose },
    /* @__PURE__ */ React.createElement(
      Modal.Header,
      { onClose },
      /* @__PURE__ */ React.createElement(
        FileModalTitle,
        { item: fileSet },
        /* @__PURE__ */ React.createElement(
          Link,
          {
            href: fileSet["@id"],
            target: "_blank",
            rel: "noopener noreferrer",
          },
          fileSet.accession
        )
      )
    ),
    /* @__PURE__ */ React.createElement(
      DataPanel,
      { className: "border-none" },
      /* @__PURE__ */ React.createElement(
        DataArea,
        null,
        fileSet.aliases?.length > 0 &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(DataItemLabel, null, "Aliases"),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              /* @__PURE__ */ React.createElement(AliasList, {
                aliases: fileSet.aliases,
              })
            )
          ),
        fileSet.file_set_type &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(
              DataItemLabel,
              null,
              "File Set Type"
            ),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              fileSet.file_set_type
            )
          ),
        fileSet.summary &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(DataItemLabel, null, "Summary"),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              fileSet.summary
            )
          ),
        /* @__PURE__ */ React.createElement(DataItemLabel, null, "Status"),
        /* @__PURE__ */ React.createElement(
          DataItemValue,
          null,
          /* @__PURE__ */ React.createElement(Status, {
            status: fileSet.status,
          })
        )
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        { className: "mt-4" },
        /* @__PURE__ */ React.createElement(SortableGrid, {
          data: node.files,
          columns: filesColumns,
          keyProp: "@id",
          meta: { nativeFiles },
          pager: {},
        })
      )
    )
  );
}
