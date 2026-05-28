import {
  ANALYSIS_SET_CLINICAL_COLUMN_IDS,
  BIOSAMPLE_CLINICAL_COLUMN_IDS,
  buildColumnPresetQuery,
  FILE_SET_CLINICAL_COLUMN_IDS,
  filterHiddenReportColumns,
  getReportColumnPreset,
  HUMAN_DONOR_CLINICAL_COLUMN_IDS,
  shouldApplyDefaultReportColumnPreset,
  WORKFLOW_CLINICAL_COLUMN_IDS,
} from "../report-column-config";

describe("filterHiddenReportColumns", () => {
  it("removes metadata and admin columns", () => {
    const specs = filterHiddenReportColumns([
      { id: "@id", title: "ID" },
      { id: "accession", title: "Accession" },
      { id: "schema_version", title: "Schema Version" },
      { id: "submitted_by", title: "Submitted By" },
      { id: "hba1c", title: "HbA1C (percentage)" },
    ]);
    expect(specs.map((spec) => spec.id)).toEqual(["@id", "accession", "hba1c"]);
  });

  it("removes biosample provenance columns", () => {
    const specs = filterHiddenReportColumns([
      { id: "accession", title: "Accession" },
      { id: "ccf_id", title: "Common Coordinate Framework Identifier" },
      { id: "file_sets", title: "File Sets" },
      { id: "islet_yield", title: "Islet Yield (IEQ)" },
    ]);
    expect(specs.map((spec) => spec.id)).toEqual(["accession", "islet_yield"]);
  });

  it("removes file set provenance columns", () => {
    const specs = filterHiddenReportColumns([
      { id: "accession", title: "Accession" },
      { id: "submitted_files_timestamp", title: "Submitted Files Timestamp" },
      { id: "files", title: "Files" },
      { id: "assay_term", title: "Assay Term" },
    ]);
    expect(specs.map((spec) => spec.id)).toEqual(["accession", "assay_term"]);
  });
});

describe("getReportColumnPreset", () => {
  it("returns clinical columns for HumanDonor only", () => {
    expect(getReportColumnPreset(["HumanDonor"])).toBe(
      HUMAN_DONOR_CLINICAL_COLUMN_IDS
    );
    expect(getReportColumnPreset(["HumanDonor", "RodentDonor"])).toBeNull();
    expect(getReportColumnPreset(["RodentDonor"])).toBeNull();
  });

  it("returns clinical columns for Biosample report types", () => {
    expect(getReportColumnPreset(["Biosample"])).toBe(
      BIOSAMPLE_CLINICAL_COLUMN_IDS
    );
    expect(getReportColumnPreset(["PrimaryIslet"])).toBe(
      BIOSAMPLE_CLINICAL_COLUMN_IDS
    );
    expect(getReportColumnPreset(["Biosample", "PrimaryIslet"])).toBeNull();
  });

  it("returns clinical columns for FileSet report types", () => {
    expect(getReportColumnPreset(["FileSet"])).toBe(FILE_SET_CLINICAL_COLUMN_IDS);
    expect(getReportColumnPreset(["MeasurementSet"])).toBe(
      FILE_SET_CLINICAL_COLUMN_IDS
    );
    expect(getReportColumnPreset(["FileSet", "MeasurementSet"])).toBeNull();
  });

  it("returns a dedicated clinical preset for AnalysisSet", () => {
    expect(getReportColumnPreset(["AnalysisSet"])).toBe(
      ANALYSIS_SET_CLINICAL_COLUMN_IDS
    );
    expect(getReportColumnPreset(["AnalysisSet"])).not.toBe(
      FILE_SET_CLINICAL_COLUMN_IDS
    );
  });

  it("returns clinical columns for Workflow", () => {
    expect(getReportColumnPreset(["Workflow"])).toBe(WORKFLOW_CLINICAL_COLUMN_IDS);
  });
});

describe("shouldApplyDefaultReportColumnPreset", () => {
  it("is true for HumanDonor without field params", () => {
    expect(
      shouldApplyDefaultReportColumnPreset("type=HumanDonor", ["HumanDonor"])
    ).toBe(true);
  });

  it("is false when field params exist", () => {
    expect(
      shouldApplyDefaultReportColumnPreset(
        "type=HumanDonor&field=accession",
        ["HumanDonor"]
      )
    ).toBe(false);
  });

  it("is true for Biosample without field params", () => {
    expect(
      shouldApplyDefaultReportColumnPreset("type=Biosample", ["Biosample"])
    ).toBe(true);
  });

  it("is true for FileSet without field params", () => {
    expect(
      shouldApplyDefaultReportColumnPreset("type=FileSet", ["FileSet"])
    ).toBe(true);
  });

  it("is true for AnalysisSet without field params", () => {
    expect(
      shouldApplyDefaultReportColumnPreset("type=AnalysisSet", ["AnalysisSet"])
    ).toBe(true);
  });

  it("is true for Workflow without field params", () => {
    expect(
      shouldApplyDefaultReportColumnPreset("type=Workflow", ["Workflow"])
    ).toBe(true);
  });
});

describe("buildColumnPresetQuery", () => {
  it("sets field parameters for each preset column", () => {
    const query = buildColumnPresetQuery("type=HumanDonor", [
      "@id",
      "accession",
      "hba1c",
    ]);
    expect(query).toContain("type=HumanDonor");
    expect(query).toContain("field=%40id");
    expect(query).toContain("field=accession");
    expect(query).toContain("field=hba1c");
  });
});
