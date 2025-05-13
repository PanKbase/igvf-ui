"use strict";
export const MAX_NODES_TO_DISPLAY = 70;
const FILE_NODE_TYPE = "file";
const FILE_SET_NODE_TYPE = "file-set";
export const fileSetTypeColorMap = {
  AnalysisSet: {
    fill: "fill-file-graph-analysis",
    bg: "bg-file-graph-analysis",
  },
  AuxiliarySet: {
    fill: "fill-file-graph-auxiliary",
    bg: "bg-file-graph-auxiliary",
  },
  ConstructLibrarySet: {
    fill: "fill-file-graph-construct-library",
    bg: "bg-file-graph-construct-library",
  },
  CuratedSet: { fill: "fill-file-graph-curated", bg: "bg-file-graph-curated" },
  MeasurementSet: {
    fill: "fill-file-graph-measurement",
    bg: "bg-file-graph-measurement",
  },
  ModelSet: { fill: "fill-file-graph-model", bg: "bg-file-graph-model" },
  PredictionSet: {
    fill: "fill-file-graph-prediction",
    bg: "bg-file-graph-prediction",
  },
  unknown: { fill: "fill-file-graph-unknown", bg: "bg-file-graph-unknown" },
};
export function isFileNodeData(node) {
  return node.type === FILE_NODE_TYPE;
}
export function isFileSetNodeData(node) {
  return node.type === FILE_SET_NODE_TYPE;
}
