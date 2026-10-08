import { useAuth0 } from "@auth0/auth0-react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import FacetSection from "../facet-section";
import FetchRequest from "../../../lib/fetch-request";
import { clearSearchConfigCache } from "../../../lib/facets";

const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: mockPush,
    };
  },
}));

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(),
}));

jest.mock("../../../lib/fetch-request", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const facetConfig = {
  gender: { optional: false, category: "Donor" },
  status: { optional: false },
  t1d_stage: {
    optional: true,
    category: "Clinical",
    description: "Stage of type 1 diabetes",
  },
  hla: { optional: true, category: "Clinical" },
};

function buildSearchResults({ type = "HumanDonor", selected = [] } = {}) {
  return {
    "@id": `/search/?type=${type}`,
    clear_filters: `/search/?type=${type}`,
    facets: [
      {
        field: "type",
        title: "Object Type",
        terms: [{ key: type, doc_count: 7 }],
      },
      {
        field: "gender",
        title: "Gender",
        terms: [
          { key: "female", doc_count: 4 },
          { key: "male", doc_count: 3 },
        ],
      },
      {
        field: "status",
        title: "Status",
        open_on_load: true,
        terms: [{ key: "released", doc_count: 7 }],
      },
      {
        field: "t1d_stage",
        title: "T1D Stage",
        terms: [{ key: "Stage 1", doc_count: 2 }],
      },
      {
        field: "hla",
        title: "HLA",
        terms: [{ key: "A1", doc_count: 1 }],
      },
    ],
    filters: [{ field: "type", term: type, remove: "/search/" }, ...selected],
    total: 7,
  };
}

function facetFields() {
  return screen
    .getAllByTestId(/^facet-container-/)
    .map((el) =>
      el.getAttribute("data-testid").replace("facet-container-", "")
    );
}

describe("Test <FacetSection> component", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    localStorage.clear();
    sessionStorage.clear();
    clearSearchConfigCache();
    mockPush.mockClear();
    useAuth0.mockReturnValue({ isAuthenticated: true });
  });

  it("renders the non-optional facets and the controls, hiding the type facet", () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    expect(facetFields()).toEqual(["gender", "status"]);
    expect(screen.getByTestId("facettrigger-status")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByTestId("facettrigger-gender")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByTestId("facet-terms-status")).toBeInTheDocument();
    expect(screen.getByText("Clear Filters")).toBeInTheDocument();
    expect(screen.getByLabelText("Open all facets")).toBeInTheDocument();
    expect(screen.getByLabelText("Close all facets")).toBeInTheDocument();
    expect(screen.getByText("Optional Filters")).toBeInTheDocument();
    expect(screen.getByText("Filter Order")).toBeInTheDocument();
  });

  it("renders nothing if only the type facet exists", () => {
    const searchResults = buildSearchResults();
    searchResults.facets = [searchResults.facets[0]];
    const { container } = render(
      <FacetSection searchResults={searchResults} facetConfig={{}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("doesn't offer optional filters for types without them", () => {
    render(
      <FacetSection
        searchResults={buildSearchResults({ type: "Gene" })}
        facetConfig={{ gender: { optional: false } }}
      />
    );
    expect(screen.queryByText("Optional Filters")).not.toBeInTheDocument();
    expect(screen.getByText("Filter Order")).toBeInTheDocument();
  });

  it("clears all filters when clicking the Clear Filters button", () => {
    const searchResults = buildSearchResults({
      selected: [{ field: "gender", term: "female", remove: "/search/" }],
    });
    render(
      <FacetSection searchResults={searchResults} facetConfig={facetConfig} />
    );

    fireEvent.click(screen.getByText("Clear Filters"));
    expect(mockPush).toHaveBeenCalledWith(
      searchResults.clear_filters,
      undefined,
      { scroll: false }
    );
  });

  it("disables Clear Filters when nothing but the type is selected", () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );
    expect(screen.getByLabelText("Clear all filters")).toBeDisabled();
  });

  it("opens and closes all facets and remembers it in localStorage", () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    fireEvent.click(screen.getByLabelText("Open all facets"));
    expect(screen.getByTestId("facettrigger-gender")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByTestId("facettrigger-status")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(JSON.parse(localStorage.getItem("facet-open-HumanDonor"))).toEqual({
      gender: true,
      status: true,
    });

    fireEvent.click(screen.getByLabelText("Close all facets"));
    expect(screen.getByTestId("facettrigger-gender")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByTestId("facettrigger-status")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(JSON.parse(localStorage.getItem("facet-open-HumanDonor"))).toEqual({
      gender: false,
      status: false,
    });
  });

  it("toggles a single facet and toggles all with the alt key", () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    fireEvent.click(screen.getByTestId("facettrigger-gender"));
    expect(screen.getByTestId("facettrigger-gender")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByTestId("facettrigger-status")).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.click(screen.getByTestId("facettrigger-gender"), {
      altKey: true,
    });
    expect(screen.getByTestId("facettrigger-gender")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByTestId("facettrigger-status")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("restores the saved open state from localStorage", async () => {
    localStorage.setItem(
      "facet-open-HumanDonor",
      JSON.stringify({ gender: true, status: false })
    );
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    await waitFor(() =>
      expect(screen.getByTestId("facettrigger-gender")).toHaveAttribute(
        "aria-expanded",
        "true"
      )
    );
    expect(screen.getByTestId("facettrigger-status")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("shows optional facets the user saved in localStorage", async () => {
    localStorage.setItem(
      "facet-optional",
      JSON.stringify({ HumanDonor: ["t1d_stage"] })
    );
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    await waitFor(() =>
      expect(facetFields()).toEqual(["gender", "status", "t1d_stage"])
    );
    expect(
      screen.getByTestId("optional-facet-quick-hide-button-t1d_stage")
    ).toBeInTheDocument();
  });

  it("saves optional filters chosen in the modal to localStorage", async () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    fireEvent.click(screen.getByText("Optional Filters"));
    const modal = await screen.findByTestId("optional-facets-modal");

    // Facets group by category, each with its checkbox.
    expect(within(modal).getByText("Clinical")).toBeInTheDocument();
    expect(within(modal).getByLabelText("T1D Stage")).not.toBeChecked();
    expect(within(modal).queryByLabelText("Gender")).not.toBeInTheDocument();

    fireEvent.click(within(modal).getByLabelText("T1D Stage"));
    fireEvent.click(within(modal).getByLabelText("HLA"));
    fireEvent.click(within(modal).getByText("Save"));

    await waitFor(() =>
      expect(facetFields()).toEqual(["gender", "status", "t1d_stage", "hla"])
    );
    expect(JSON.parse(localStorage.getItem("facet-optional"))).toEqual({
      HumanDonor: ["t1d_stage", "hla"],
    });
  });

  it("doesn't save optional filters when closing the modal", async () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    fireEvent.click(screen.getByText("Optional Filters"));
    const modal = await screen.findByTestId("optional-facets-modal");
    fireEvent.click(within(modal).getByLabelText("T1D Stage"));
    fireEvent.click(within(modal).getByText("Close"));

    await waitFor(() =>
      expect(
        screen.queryByTestId("optional-facets-modal")
      ).not.toBeInTheDocument()
    );
    expect(localStorage.getItem("facet-optional")).toBeNull();
    expect(facetFields()).toEqual(["gender", "status"]);
  });

  it("hides an optional facet with its quick-hide button", async () => {
    localStorage.setItem(
      "facet-optional",
      JSON.stringify({ HumanDonor: ["t1d_stage", "hla"] })
    );
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    const button = await screen.findByTestId(
      "optional-facet-quick-hide-button-t1d_stage"
    );
    fireEvent.click(button);

    await waitFor(() =>
      expect(facetFields()).toEqual(["gender", "status", "hla"])
    );
    expect(JSON.parse(localStorage.getItem("facet-optional"))).toEqual({
      HumanDonor: ["hla"],
    });
  });

  it("applies a saved facet order from localStorage", async () => {
    localStorage.setItem(
      "facet-order-HumanDonor",
      JSON.stringify(["status", "gender"])
    );
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    await waitFor(() => expect(facetFields()).toEqual(["status", "gender"]));
  });

  it("enters and cancels filter-order editing, and resets without saving", async () => {
    localStorage.setItem(
      "facet-order-HumanDonor",
      JSON.stringify(["status", "gender"])
    );
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );
    await waitFor(() => expect(facetFields()).toEqual(["status", "gender"]));

    fireEvent.click(screen.getByText("Filter Order"));
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
    expect(screen.queryByText("Clear Filters")).not.toBeInTheDocument();
    expect(facetFields()).toEqual(["status", "gender"]);

    // Reset shows the default order but only saving persists it.
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(facetFields()).toEqual(["gender", "status"]);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("button", { name: "Done" })
    ).not.toBeInTheDocument();
    expect(facetFields()).toEqual(["status", "gender"]);
    expect(localStorage.getItem("facet-order-HumanDonor")).not.toBeNull();
  });

  it("removes the saved order when saving the default order", async () => {
    localStorage.setItem(
      "facet-order-HumanDonor",
      JSON.stringify(["status", "gender"])
    );
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );
    await waitFor(() => expect(facetFields()).toEqual(["status", "gender"]));

    fireEvent.click(screen.getByText("Filter Order"));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(facetFields()).toEqual(["gender", "status"]);
    expect(localStorage.getItem("facet-order-HumanDonor")).toBeNull();
  });

  it("saves no order when finishing edit mode without changes", () => {
    render(
      <FacetSection
        searchResults={buildSearchResults()}
        facetConfig={facetConfig}
      />
    );

    fireEvent.click(screen.getByText("Filter Order"));
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(localStorage.getItem("facet-order-HumanDonor")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Done" })
    ).not.toBeInTheDocument();
  });

  it("loads the facet config from the registry when the page doesn't supply it", async () => {
    const getObject = jest.fn().mockResolvedValue({
      optional: () => ({
        HumanDonor: {
          facets: {
            gender: { title: "Gender" },
            t1d_stage: { title: "T1D Stage", optional: true },
            hla: { title: "HLA", optional: true },
          },
        },
      }),
    });
    FetchRequest.mockImplementation(() => ({ getObject }));
    localStorage.setItem(
      "facet-optional",
      JSON.stringify({ HumanDonor: ["t1d_stage"] })
    );

    const { container } = render(
      <FacetSection searchResults={buildSearchResults()} />
    );
    // Nothing displays until the registry tells us which facets are optional.
    expect(container).toBeEmptyDOMElement();

    await waitFor(() =>
      expect(facetFields()).toEqual(["gender", "status", "t1d_stage"])
    );
    expect(getObject).toHaveBeenCalledWith("/search-config-registry/");
  });

  it("shows facets as non-optional if the registry can't load", async () => {
    FetchRequest.mockImplementation(() => ({
      getObject: jest.fn().mockRejectedValue(new Error("network")),
    }));

    await act(async () => {
      render(<FacetSection searchResults={buildSearchResults()} />);
    });

    await waitFor(() =>
      expect(facetFields()).toEqual(["gender", "status", "t1d_stage", "hla"])
    );
  });
});
