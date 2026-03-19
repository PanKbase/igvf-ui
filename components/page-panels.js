/* eslint-disable react/prop-types */
"use strict";
import React from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef } from "react";
import { useSessionStorage } from "./browser-storage";
export function usePagePanels(pageId) {
  const pagePanelIds = useRef([]);
  const [storedPanelStates, setStoredPanelStates] = useSessionStorage(
    `page-panel-expanded-${pageId}`,
    JSON.stringify({})
  );
  const expandedPanelStates = JSON.parse(storedPanelStates);
  function setExpanded(panelId, expanded) {
    const newPagePanelStates = {
      ...expandedPanelStates,
      [panelId]: expanded,
    };
    setStoredPanelStates(JSON.stringify(newPagePanelStates));
  }
  function setAllExpanded(expanded) {
    const newPagePanelStates = { ...expandedPanelStates };
    pagePanelIds.current.forEach((panelId) => {
      newPagePanelStates[panelId] = expanded;
    });
    setStoredPanelStates(JSON.stringify(newPagePanelStates));
  }
  function isExpanded(panelId) {
    return expandedPanelStates[panelId] || false;
  }
  function registerExpanded(panelId) {
    if (!pagePanelIds.current.includes(panelId)) {
      pagePanelIds.current.push(panelId);
    }
  }
  useEffect(() => {
    if (Object.keys(expandedPanelStates).length !== 0) {
      const newPagePanelStates = { ...expandedPanelStates };
      pagePanelIds.current.forEach((panelId) => {
        if (!newPagePanelStates[panelId]) {
          newPagePanelStates[panelId] = false;
        }
      });
      setStoredPanelStates(JSON.stringify(newPagePanelStates));
    }
  }, [storedPanelStates]);
  return {
    expandedPanels: expandedPanelStates,
    setExpanded,
    setAllExpanded,
    isExpanded,
    registerExpanded,
  };
}
export function PagePanelButton({ pagePanels, pagePanelId, label, children }) {
  const isExpanded = pagePanels.isExpanded(pagePanelId);
  pagePanels.registerExpanded(pagePanelId);
  function handleClick(event) {
    if (event.ctrlKey || event.altKey) {
      pagePanels.setAllExpanded(!isExpanded);
    } else {
      pagePanels.setExpanded(pagePanelId, !isExpanded);
    }
  }
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      "aria-expanded": pagePanels.expandedPanels[pagePanelId],
      "aria-controls": pagePanelId,
      "aria-label": label,
      className: "flex items-center gap-1",
    },
    isExpanded
      ? /* @__PURE__ */ React.createElement(MinusIcon, { className: "h-6 w-6" })
      : /* @__PURE__ */ React.createElement(PlusIcon, { className: "h-6 w-6" }),
    children
  );
}
