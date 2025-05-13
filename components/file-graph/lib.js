"use strict";
import _ from "lodash";
import XXH from "xxhashjs";
import { isFileSetNodeData } from "./types";
export const NODE_WIDTH = 156;
export const NODE_HEIGHT = 44;
const HASH_SEED = 3904960594;
export function trimIsolatedNodes(graphData) {
  const parentIds = new Set(graphData.flatMap((node) => node.parentIds));
  return graphData.filter(
    (node) => node.parentIds.length > 0 || parentIds.has(node.id)
  );
}
export function collectRelevantFileSetTypes(graphData, fileSet) {
  const fileSetTypes = /* @__PURE__ */ new Set([fileSet["@type"][0]]);
  graphData.forEach((node) => {
    if (isFileSetNodeData(node)) {
      fileSetTypes.add(node.fileSet["@type"][0]);
    }
  });
  return [...fileSetTypes];
}
export function generateGraphData(nativeFiles, fileFileSets, derivedFromFiles) {
  const nativeFilePaths = nativeFiles.map((file) => file["@id"]);
  const graphData = nativeFiles.map((nativeFile) => {
    return {
      id: nativeFile["@id"],
      parentIds:
        nativeFile.derived_from?.filter((derivedFromPath) =>
          nativeFilePaths.includes(derivedFromPath)
        ) || [],
      type: "file",
      file: nativeFile,
      externalFiles: derivedFromFiles.filter((derivedFile) =>
        nativeFile.derived_from?.includes(derivedFile["@id"])
      ),
    };
  });
  const fileSetNodes = graphData.reduce((acc, fileNode) => {
    let nodes = [];
    if (fileNode.externalFiles.length > 0) {
      const fileSetGroups = _.groupBy(
        fileNode.externalFiles,
        (file) => file.file_set["@id"]
      );
      nodes = Object.entries(fileSetGroups).reduce(
        (fileSetNodeAcc, [fileSetPath, files]) => {
          const fileSet = fileFileSets.find(
            (fileSet2) => fileSet2["@id"] === fileSetPath
          );
          const combinedFilePaths = files
            .map((file) => file["@id"])
            .sort()
            .join("");
          const hash = XXH.h32(combinedFilePaths, HASH_SEED).toString(16);
          const fileSetNodeId = `${fileSetPath}-${hash}`;
          const fileSetNodeExists = Boolean(
            acc.find((node) => node.id === fileSetNodeId)
          );
          if (fileSetNodeExists) {
            fileNode.parentIds.push(fileSetNodeId);
            return fileSetNodeAcc;
          }
          const newFileSetNode = {
            id: `${fileSetPath}-${hash}`,
            parentIds: [],
            type: "file-set",
            fileSet,
            files,
          };
          fileNode.parentIds.push(newFileSetNode.id);
          return fileSetNodeAcc.concat(newFileSetNode);
        },
        []
      );
    }
    return acc.concat(nodes);
  }, []);
  return graphData.concat(fileSetNodes);
}
