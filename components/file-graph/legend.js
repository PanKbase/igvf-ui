/* eslint-disable react/prop-types */
"use strict";
import React from "react";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import Icon from "../icon";
import SessionContext from "../session-context";
import { fileSetTypeColorMap } from "./types";
export function Legend({ fileSetTypes }) {
  const { collectionTitles } = useContext(SessionContext);
  return /* @__PURE__ */ React.createElement(
    "div",
    { className: "border-t border-data-border py-2" },
    /* @__PURE__ */ React.createElement(
      "div",
      { className: "mb-1 flex justify-center gap-1" },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className:
            "flex items-center gap-0.5 border border-gray-800 px-1 text-sm dark:border-gray-400",
        },
        /* @__PURE__ */ React.createElement(Icon.FileSet, {
          className: "h-4 w-4",
        }),
        "File Set"
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className:
            "flex items-center gap-0.5 border border-gray-800 px-1 text-sm dark:border-gray-400",
        },
        /* @__PURE__ */ React.createElement(DocumentTextIcon, {
          className: "h-4 w-4",
        }),
        "File"
      )
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      { className: "flex flex-wrap justify-center gap-1" },
      Object.entries(fileSetTypeColorMap).map(([fileSetType, color]) => {
        if (fileSetTypes.includes(fileSetType)) {
          return /* @__PURE__ */ React.createElement(
            "div",
            {
              key: fileSetType,
              className: `${color.bg} flex items-center gap-0.5 border border-gray-800 px-2 py-0.5 text-xs font-semibold text-black dark:border-gray-400 dark:text-white`,
            },
            collectionTitles?.[fileSetType] || fileSetType
          );
        }
      })
    )
  );
}
