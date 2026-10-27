import {
  FEATURED_DATASETS,
  getLandingFeaturedDatasets,
  LANDING_FEATURED_COUNT,
} from "../featured-datasets";

describe("featured datasets config", () => {
  it("has the 8 cards from the spec, in order", () => {
    expect(FEATURED_DATASETS.map((d) => d.title)).toEqual([
      "Islet dynamic perifusion",
      "Pancreatic islet scRNA-seq",
      "Islet snATAC-seq",
      "Cell-type peaks from snATAC-seq",
      "cRE\u2013target gene links",
      "Differential gene expression",
      "Donor metadata",
      "Islet biosample metadata",
    ]);
  });

  it("gives every card a unique id, a category and a description", () => {
    const ids = FEATURED_DATASETS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    FEATURED_DATASETS.forEach((dataset) => {
      expect(dataset.category).toBeTruthy();
      expect(dataset.description).toBeTruthy();
    });
  });

  it("names the tool whenever a card has a Visualize link", () => {
    FEATURED_DATASETS.forEach((dataset) => {
      if (dataset.visualizeUrl) {
        expect(dataset.visualizeTool).toBeTruthy();
      }
    });
  });

  it("only gives cards the buttons the spec lists", () => {
    const byId = Object.fromEntries(FEATURED_DATASETS.map((d) => [d.id, d]));
    // No single downloadable file.
    expect(byId["cre-target-gene-links"].downloadUrl).toBeUndefined();
    expect(byId["differential-gene-expression"].downloadUrl).toBeUndefined();
    // No external tool.
    expect(byId["islet-biosample-metadata"].visualizeUrl).toBeUndefined();
    expect(byId["islet-biosample-metadata"].visualizeTool).toBeUndefined();
  });

  it("uses absolute URLs for downloads and visualizations and same-site paths for details", () => {
    FEATURED_DATASETS.forEach((dataset) => {
      [dataset.downloadUrl, dataset.visualizeUrl].forEach((url) => {
        if (url) {
          expect(url).toMatch(/^https:\/\//);
        }
      });
      if (dataset.detailsUrl) {
        expect(dataset.detailsUrl.startsWith("/")).toBe(true);
      }
    });
  });

  it("makes the landing page's list the first four cards", () => {
    expect(LANDING_FEATURED_COUNT).toBe(4);
    expect(getLandingFeaturedDatasets()).toEqual(FEATURED_DATASETS.slice(0, 4));
    expect(getLandingFeaturedDatasets()).toHaveLength(4);
  });
});
