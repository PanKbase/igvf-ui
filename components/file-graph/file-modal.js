/* eslint-disable react/prop-types */
"use strict";
import React from "react";
import { TableCellsIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import AliasList from "../alias-list";
import {
  DataPanel,
  DataArea,
  DataItemLabel,
  DataItemValue,
} from "../data-area";
import { FileDownload } from "../file-download";
import { ButtonLink } from "../form-elements";
import Modal from "../modal";
import Status from "../status";
import { FileModalTitle } from "./file-modal-title";
import { dataSize, truthyOrZero } from "../../lib/general";
export function FileModal({ node, onClose }) {
  const { file } = node;
  const derivedFromReportLink = `/multireport/?type=File&input_file_for=${file["@id"]}`;
  return /* @__PURE__ */ React.createElement(
    Modal,
    { isOpen: true, onClose },
    /* @__PURE__ */ React.createElement(
      Modal.Header,
      { onClose },
      /* @__PURE__ */ React.createElement(
        FileModalTitle,
        { item: file },
        /* @__PURE__ */ React.createElement(
          "div",
          { className: "flex items-center gap-1" },
          /* @__PURE__ */ React.createElement(
            Link,
            { href: file["@id"], target: "_blank", rel: "noopener noreferrer" },
            file.accession
          ),
          /* @__PURE__ */ React.createElement(FileDownload, { file })
        )
      )
    ),
    /* @__PURE__ */ React.createElement(
      DataPanel,
      { className: "border-none" },
      /* @__PURE__ */ React.createElement(
        DataArea,
        null,
        file.aliases?.length > 0 &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(DataItemLabel, null, "Aliases"),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              /* @__PURE__ */ React.createElement(AliasList, {
                aliases: file.aliases,
              })
            )
          ),
        /* @__PURE__ */ React.createElement(
          DataItemLabel,
          null,
          "Content Type"
        ),
        /* @__PURE__ */ React.createElement(
          DataItemValue,
          null,
          file.content_type
        ),
        /* @__PURE__ */ React.createElement(DataItemLabel, null, "File Format"),
        /* @__PURE__ */ React.createElement(
          DataItemValue,
          null,
          file.file_format
        ),
        truthyOrZero(file.file_size) &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(
              DataItemLabel,
              null,
              "File Size"
            ),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              dataSize(file.file_size)
            )
          ),
        /* @__PURE__ */ React.createElement(DataItemLabel, null, "Summary"),
        /* @__PURE__ */ React.createElement(DataItemValue, null, file.summary),
        file.lab &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(DataItemLabel, null, "Lab"),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              /* @__PURE__ */ React.createElement(
                Link,
                {
                  href: file.lab["@id"],
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                file.lab.title
              )
            )
          ),
        /* @__PURE__ */ React.createElement(DataItemLabel, null, "Statuses"),
        /* @__PURE__ */ React.createElement(
          DataItemValue,
          { className: "flex items-center gap-1" },
          /* @__PURE__ */ React.createElement(Status, { status: file.status }),
          /* @__PURE__ */ React.createElement(Status, {
            status: file.upload_status,
          })
        ),
        file.derived_from?.length > 0 &&
          /* @__PURE__ */ React.createElement(
            React.Fragment,
            null,
            /* @__PURE__ */ React.createElement(
              DataItemLabel,
              null,
              "Report of Files This File Derives From"
            ),
            /* @__PURE__ */ React.createElement(
              DataItemValue,
              null,
              /* @__PURE__ */ React.createElement(
                ButtonLink,
                {
                  href: derivedFromReportLink,
                  size: "sm",
                  isInline: true,
                  isExternal: true,
                },
                /* @__PURE__ */ React.createElement(TableCellsIcon, {
                  className: "h-4 w-4",
                })
              )
            )
          )
      )
    )
  );
}
