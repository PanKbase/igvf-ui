/* eslint-disable react/prop-types */
"use strict";
import React from "react";
import * as d3Dag from "d3-dag";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import { useContext, useEffect, useState } from "react";
import { Group } from "@visx/group";
import { LinkHorizontal } from "@visx/shape";
import { DataAreaTitle, DataPanel } from "../data-area";
import GlobalContext from "../global-context";
import Icon from "../icon";
import { truncateText } from "../../lib/general";
import { FileModal } from "./file-modal";
import { FileSetModal } from "./file-set-modal";
import { Legend } from "./legend";
import {
  collectRelevantFileSetTypes,
  generateGraphData,
  NODE_HEIGHT,
  NODE_WIDTH,
  trimIsolatedNodes,
} from "./lib";
import {
  fileSetTypeColorMap,
  isFileNodeData,
  isFileSetNodeData,
  MAX_NODES_TO_DISPLAY,
} from "./types";
function GraphNode({
  node,
  onNodeClick,
  background,
  label,
  isNodeSelected,
  isRounded = false,
  className = "",
  children,
}) {
  return /* @__PURE__ */ React.createElement(
    Group,
    {
      top: node.x,
      left: node.y,
      style: { cursor: "pointer" },
      onClick: () => onNodeClick(node.data),
      tabIndex: 0,
      "aria-label": label,
      className,
    },
    /* @__PURE__ */ React.createElement("rect", {
      height: NODE_HEIGHT,
      width: NODE_WIDTH,
      x: -NODE_WIDTH / 2,
      y: -NODE_HEIGHT / 2,
      opacity: 1,
      className: `stroke-gray-800 dark:stroke-gray-400 ${background.fill}`,
      strokeWidth: 1,
      ...(isRounded ? { rx: 10, ry: 10 } : {}),
    }),
    isNodeSelected &&
      /* @__PURE__ */ React.createElement("rect", {
        height: NODE_HEIGHT + 8,
        width: NODE_WIDTH + 8,
        x: -NODE_WIDTH / 2 - 4,
        y: -NODE_HEIGHT / 2 - 4,
        fill: "transparent",
        opacity: 1,
        className: "stroke-gray-800 dark:stroke-white",
        strokeWidth: 3,
        ...(isRounded ? { rx: 14, ry: 14 } : {}),
      }),
    children
  );
}
function Graph({ fileSet, nativeFiles, graphData }) {
  const [loadedDag, setLoadedDag] = useState(null);
  const { darkMode } = useContext(GlobalContext);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      const dag = d3Dag.dagStratify()(graphData);
      const layout = d3Dag
        .sugiyama()
        .coord(d3Dag.coordGreedy())
        .decross(d3Dag.decrossOpt().large("large"))
        .layering(d3Dag.layeringLongestPath())
        .nodeSize((node) => {
          return node ? [NODE_HEIGHT * 2, NODE_WIDTH * 1.8] : [0, 0];
        });
      const { width, height } = layout(dag);
      setLoadedDag(dag);
      setLayoutHeight(width);
      setLayoutWidth(height);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function onNodeClick(nodeData) {
    setSelectedNode(nodeData);
  }
  return loadedDag
    ? /* @__PURE__ */ React.createElement(
        "div",
        { className: "overflow-x-auto" },
        /* @__PURE__ */ React.createElement(
          "svg",
          { className: "mx-auto", width: layoutWidth, height: layoutHeight },
          /* @__PURE__ */ React.createElement(
            "defs",
            null,
            /* @__PURE__ */ React.createElement(
              "marker",
              {
                id: "arrow",
                viewBox: "0 -5 10 10",
                refX: "20",
                refY: "0",
                markerWidth: "10",
                markerHeight: "10",
                orient: "auto",
                className: "fill-black dark:fill-white",
              },
              /* @__PURE__ */ React.createElement("path", {
                d: "M0,-5L10,0L0,5",
              })
            )
          ),
          /* @__PURE__ */ React.createElement(
            Group,
            { top: 0, left: 0 },
            loadedDag.links().map((link, i) => {
              return /* @__PURE__ */ React.createElement(LinkHorizontal, {
                key: `link-${i}`,
                data: link,
                className: "stroke-black dark:stroke-white",
                strokeWidth: "1",
                fill: "none",
                x: (node) => node.y - NODE_WIDTH / 2 + 10,
                markerEnd: "url(#arrow)",
              });
            }),
            loadedDag.descendants().map((node, i) => {
              const graphNode = node.data;
              if (isFileNodeData(graphNode)) {
                const isNodeSelected = selectedNode?.id === graphNode.id;
                const background =
                  fileSetTypeColorMap[fileSet["@type"][0]] ||
                  fileSetTypeColorMap.unknown;
                const foreground = darkMode.enabled ? "#ffffff" : "#000000";
                return /* @__PURE__ */ React.createElement(
                  GraphNode,
                  {
                    key: i,
                    node,
                    onNodeClick,
                    background,
                    label: `File ${graphNode.file.accession}, file format ${graphNode.file.file_format}, content type ${graphNode.file.content_type}`,
                    isNodeSelected,
                    className: "relative",
                  },
                  /* @__PURE__ */ React.createElement(DocumentTextIcon, {
                    className: "absolute",
                    x: NODE_WIDTH / 2 - 18,
                    y: -NODE_HEIGHT / 2 + 2,
                    width: 16,
                    height: 16,
                  }),
                  /* @__PURE__ */ React.createElement(
                    "text",
                    {
                      y: "-8px",
                      fontSize: 12,
                      textAnchor: "middle",
                      fontWeight: "bold",
                      fill: foreground,
                    },
                    graphNode.file.accession
                  ),
                  /* @__PURE__ */ React.createElement(
                    "text",
                    {
                      y: "6px",
                      fontSize: 12,
                      textAnchor: "middle",
                      fill: foreground,
                    },
                    graphNode.file.file_format
                  ),
                  /* @__PURE__ */ React.createElement(
                    "text",
                    {
                      y: "18px",
                      fontSize: 12,
                      textAnchor: "middle",
                      fill: foreground,
                    },
                    truncateText(graphNode.file.content_type, 24)
                  )
                );
              }
              if (isFileSetNodeData(graphNode)) {
                const isNodeSelected = selectedNode?.id === graphNode.id;
                const background =
                  fileSetTypeColorMap[graphNode.fileSet["@type"][0]] ||
                  fileSetTypeColorMap.unknown;
                const foreground = darkMode.enabled ? "#ffffff" : "#000000";
                return /* @__PURE__ */ React.createElement(
                  GraphNode,
                  {
                    key: i,
                    node,
                    onNodeClick,
                    background,
                    label: `File set ${graphNode.fileSet.title}`,
                    isNodeSelected,
                    isRounded: true,
                  },
                  /* @__PURE__ */ React.createElement(Icon.FileSet, {
                    className: "absolute",
                    x: NODE_WIDTH / 2 - 18,
                    y: -NODE_HEIGHT / 2 + 1,
                    width: 16,
                    height: 16,
                  }),
                  /* @__PURE__ */ React.createElement(
                    "text",
                    {
                      y: "-8px",
                      fontSize: 12,
                      textAnchor: "middle",
                      fontWeight: "bold",
                      fill: foreground,
                    },
                    graphNode.fileSet.accession
                  ),
                  /* @__PURE__ */ React.createElement(
                    "text",
                    {
                      y: "6px",
                      fontSize: 12,
                      textAnchor: "middle",
                      fill: foreground,
                    },
                    graphNode.files.length,
                    " ",
                    graphNode.files.length === 1 ? "file" : "files"
                  ),
                  graphNode.fileSet.file_set_type &&
                    /* @__PURE__ */ React.createElement(
                      "text",
                      {
                        y: "18px",
                        fontSize: 12,
                        textAnchor: "middle",
                        fill: foreground,
                      },
                      truncateText(graphNode.fileSet.file_set_type, 24)
                    ),
                  /* @__PURE__ */ React.createElement(
                    "text",
                    {
                      y: "6px",
                      fontSize: 12,
                      textAnchor: "middle",
                      fill: foreground,
                    },
                    graphNode.files.length,
                    " ",
                    graphNode.files.length === 1 ? "file" : "files"
                  )
                );
              }
              return null;
            })
          )
        ),
        selectedNode &&
          isFileNodeData(selectedNode) &&
          /* @__PURE__ */ React.createElement(FileModal, {
            node: selectedNode,
            onClose: () => setSelectedNode(null),
          }),
        selectedNode &&
          isFileSetNodeData(selectedNode) &&
          /* @__PURE__ */ React.createElement(FileSetModal, {
            node: selectedNode,
            nativeFiles,
            onClose: () => setSelectedNode(null),
          })
      )
    : /* @__PURE__ */ React.createElement(
        "div",
        { className: "flex h-16 items-center justify-center italic" },
        "Loading\u2026"
      );
}
export function FileGraph({
  fileSet,
  files,
  derivedFromFiles,
  fileFileSets,
  title = "File Association Graph",
  pagePanels,
  pagePanelId,
}) {
  const isExpanded = pagePanels.isExpanded(pagePanelId);
  const data = generateGraphData(files, fileFileSets, derivedFromFiles);
  const trimmedData = trimIsolatedNodes(data);
  const isGraphTooLarge = trimmedData.length > MAX_NODES_TO_DISPLAY;
  const relevantFileSetTypes = !isGraphTooLarge
    ? collectRelevantFileSetTypes(trimmedData, fileSet)
    : [];
  if (trimmedData.length > 0) {
    return /* @__PURE__ */ React.createElement(
      "section",
      { role: "region", "aria-labelledby": "file-graph" },
      /* @__PURE__ */ React.createElement(
        DataAreaTitle,
        null,
        /* @__PURE__ */ React.createElement(
          DataAreaTitle.Expander,
          {
            pagePanels,
            pagePanelId,
            label: `${title} table`,
          },
          /* @__PURE__ */ React.createElement(
            "div",
            { id: "file-graph" },
            title
          )
        )
      ),
      isExpanded &&
        /* @__PURE__ */ React.createElement(
          "div",
          { className: "overflow-hidden [&>div]:p-0" },
          /* @__PURE__ */ React.createElement(
            DataPanel,
            null,
            !isGraphTooLarge
              ? /* @__PURE__ */ React.createElement(
                  React.Fragment,
                  null,
                  /* @__PURE__ */ React.createElement(Graph, {
                    fileSet,
                    nativeFiles: files,
                    graphData: trimmedData,
                  }),
                  /* @__PURE__ */ React.createElement(Legend, {
                    fileSetTypes: relevantFileSetTypes,
                  })
                )
              : /* @__PURE__ */ React.createElement(
                  "div",
                  { className: "p-4 text-center italic" },
                  "Graph too large to display"
                )
          )
        )
    );
  }
}
