import { render, screen } from "@testing-library/react";
import Home, { getServerSideProps as getLandingProps } from "../../pages/index";
import Featured from "../../pages/featured";
import { EMPTY_LANDING_DATA, getLandingData } from "../../lib/landing-server";
import nextConfig from "../../next.config";

jest.mock("../../lib/landing-server", () => ({
  __esModule: true,
  EMPTY_LANDING_DATA: {
    stats: null,
    donorTotal: null,
    assayTiles: [],
    analysisTiles: [],
    donorChips: [],
    autoantibodyChip: null,
    resourceLink: null,
    tryChips: [],
  },
  getLandingData: jest.fn(),
}));

describe("landing page routes", () => {
  it("passes the live landing data to the page", async () => {
    const data = {
      ...EMPTY_LANDING_DATA,
      stats: { donors: 1, measurementSets: 2, analysisSets: 3 },
    };
    getLandingData.mockResolvedValue(data);

    const result = await getLandingProps();
    expect(result).toEqual({ props: { landing: data } });
  });

  it("falls back to the empty page data if getting the landing data throws", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => undefined);
    getLandingData.mockRejectedValue(new Error("boom"));

    const result = await getLandingProps();
    expect(result).toEqual({ props: { landing: EMPTY_LANDING_DATA } });
    log.mockRestore();
  });

  it("renders the landing page and the featured page", () => {
    const { unmount } = render(<Home landing={EMPTY_LANDING_DATA} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "PanKbase Data Library" })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("featured-card")).toHaveLength(4);
    unmount();

    render(<Featured />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Featured datasets" })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("featured-card")).toHaveLength(8);
  });

  it("redirects the old /test-homepage review URLs", async () => {
    const redirects = await nextConfig.redirects();
    expect(redirects).toEqual(
      expect.arrayContaining([
        {
          source: "/test-homepage/",
          destination: "/",
          permanent: false,
        },
        {
          source: "/test-homepage/featured/",
          destination: "/featured/",
          permanent: false,
        },
      ])
    );
  });
});
