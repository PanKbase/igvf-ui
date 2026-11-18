import { render, screen } from "@testing-library/react";
import FileTable from "../file-table";

const fileWithoutWorkflow = {
  "@id": "/tabular-files/PKBFI0000AAAA/",
  accession: "PKBFI0000AAAA",
  file_format: "tsv",
  content_type: "gene quantifications",
  status: "released",
  upload_status: "validated",
};

const fileWithWorkflow = {
  "@id": "/tabular-files/PKBFI0000BBBB/",
  accession: "PKBFI0000BBBB",
  file_format: "tsv",
  content_type: "gene quantifications",
  status: "released",
  upload_status: "validated",
  analysis_step_version: {
    analysis_step: {
      workflow: {
        "@id": "/workflows/PKBWF0000WRKF/",
        accession: "PKBWF0000WRKF",
        name: "RNA-seq pipeline",
      },
    },
  },
};

describe("Test the file table workflow column", () => {
  it("shows a workflow column linking to the workflow when a file has one", () => {
    render(<FileTable files={[fileWithoutWorkflow, fileWithWorkflow]} />);

    expect(
      screen.getByRole("columnheader", { name: /Workflow/ })
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "RNA-seq pipeline" });
    expect(link).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/workflows\/PKBWF0000WRKF\/?$/)
    );
  });

  it("hides the workflow column when no file has a workflow", () => {
    render(<FileTable files={[fileWithoutWorkflow]} />);

    expect(
      screen.queryByRole("columnheader", { name: /Workflow/ })
    ).not.toBeInTheDocument();
  });
});
