/* eslint-disable react/prop-types */
"use strict";
import React from "react";
import { useContext } from "react";
import SessionContext from "../session-context";
export function FileModalTitle({ item, children }) {
  const { collectionTitles } = useContext(SessionContext);
  const fileType = item["@type"][0];
  return /* @__PURE__ */ React.createElement(
    "div",
    { className: "my-[-6px]" },
    children,
    /* @__PURE__ */ React.createElement(
      "div",
      { className: "text-xs font-semibold" },
      collectionTitles?.[fileType] || fileType
    )
  );
}
